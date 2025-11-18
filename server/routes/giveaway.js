import express from 'express';
import { broadcast } from '../index.js';
import { getAccessToken } from './auth.js';

const router = express.Router();

// Store active giveaways (in production, use a database)
const giveaways = new Map();
const participants = new Map();

// Middleware to check authentication
function requireAuth(req, res, next) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }

  const accessToken = getAccessToken(sessionId);
  if (!accessToken) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  req.sessionId = sessionId;
  req.accessToken = accessToken;
  next();
}

// Create a new giveaway
router.post('/create', requireAuth, (req, res) => {
  const {
    title,
    description,
    duration,
    type,
    keyword,
    requirements,
    maxWinners,
  } = req.body;

  const giveawayId = Math.random().toString(36).substring(7);
  const giveaway = {
    id: giveawayId,
    title,
    description,
    duration,
    type,
    keyword,
    requirements: requirements || {},
    maxWinners: maxWinners || 1,
    status: 'pending',
    createdAt: Date.now(),
    startedAt: null,
    endedAt: null,
    sessionId: req.sessionId,
  };

  giveaways.set(giveawayId, giveaway);
  participants.set(giveawayId, new Map());

  broadcast({
    type: 'giveaway_created',
    giveaway,
  });

  res.json({ success: true, giveaway });
});

// Start a giveaway
router.post('/:giveawayId/start', requireAuth, (req, res) => {
  const { giveawayId } = req.params;
  const giveaway = giveaways.get(giveawayId);

  if (!giveaway) {
    return res.status(404).json({ error: 'Giveaway not found' });
  }

  if (giveaway.sessionId !== req.sessionId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (giveaway.status !== 'pending') {
    return res.status(400).json({ error: 'Giveaway already started' });
  }

  giveaway.status = 'active';
  giveaway.startedAt = Date.now();

  // Set auto-end timer if duration is specified
  if (giveaway.duration) {
    setTimeout(() => {
      endGiveaway(giveawayId);
    }, giveaway.duration * 1000);
  }

  broadcast({
    type: 'giveaway_started',
    giveaway,
  });

  res.json({ success: true, giveaway });
});

// Add participant
router.post('/:giveawayId/participate', requireAuth, (req, res) => {
  const { giveawayId } = req.params;
  const { userId, username, displayName, message } = req.body;

  const giveaway = giveaways.get(giveawayId);
  if (!giveaway) {
    return res.status(404).json({ error: 'Giveaway not found' });
  }

  if (giveaway.status !== 'active') {
    return res.status(400).json({ error: 'Giveaway is not active' });
  }

  const giveawayParticipants = participants.get(giveawayId);
  
  // Check if user already participated
  if (giveawayParticipants.has(userId)) {
    return res.status(400).json({ error: 'User already participating' });
  }

  // Validate keyword if required
  if (giveaway.keyword && !message?.toLowerCase().includes(giveaway.keyword.toLowerCase())) {
    return res.status(400).json({ error: 'Keyword not found in message' });
  }

  const participant = {
    userId,
    username,
    displayName,
    message,
    timestamp: Date.now(),
  };

  giveawayParticipants.set(userId, participant);

  broadcast({
    type: 'participant_added',
    giveawayId,
    participant,
    totalParticipants: giveawayParticipants.size,
  });

  res.json({ success: true, participant });
});

// Get giveaway participants
router.get('/:giveawayId/participants', requireAuth, (req, res) => {
  const { giveawayId } = req.params;
  const giveawayParticipants = participants.get(giveawayId);

  if (!giveawayParticipants) {
    return res.status(404).json({ error: 'Giveaway not found' });
  }

  res.json({
    participants: Array.from(giveawayParticipants.values()),
    total: giveawayParticipants.size,
  });
});

// Draw winners
router.post('/:giveawayId/draw', requireAuth, (req, res) => {
  const { giveawayId } = req.params;
  const giveaway = giveaways.get(giveawayId);

  if (!giveaway) {
    return res.status(404).json({ error: 'Giveaway not found' });
  }

  if (giveaway.sessionId !== req.sessionId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const giveawayParticipants = participants.get(giveawayId);
  const participantArray = Array.from(giveawayParticipants.values());

  if (participantArray.length === 0) {
    return res.status(400).json({ error: 'No participants' });
  }

  // Randomly select winners
  const winners = [];
  const maxWinners = Math.min(giveaway.maxWinners, participantArray.length);
  const availableParticipants = [...participantArray];

  for (let i = 0; i < maxWinners; i++) {
    const randomIndex = Math.floor(Math.random() * availableParticipants.length);
    winners.push(availableParticipants[randomIndex]);
    availableParticipants.splice(randomIndex, 1);
  }

  giveaway.winners = winners;
  giveaway.status = 'completed';
  giveaway.endedAt = Date.now();

  broadcast({
    type: 'winners_drawn',
    giveawayId,
    winners,
    giveaway,
  });

  res.json({ success: true, winners, giveaway });
});

// End giveaway
router.post('/:giveawayId/end', requireAuth, (req, res) => {
  const { giveawayId } = req.params;
  const result = endGiveaway(giveawayId, req.sessionId);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.json({ success: true, giveaway: result.giveaway });
});

// Helper function to end giveaway
function endGiveaway(giveawayId, sessionId = null) {
  const giveaway = giveaways.get(giveawayId);

  if (!giveaway) {
    return { error: 'Giveaway not found', status: 404 };
  }

  if (sessionId && giveaway.sessionId !== sessionId) {
    return { error: 'Unauthorized', status: 403 };
  }

  if (giveaway.status === 'completed') {
    return { error: 'Giveaway already ended', status: 400 };
  }

  giveaway.status = 'ended';
  giveaway.endedAt = Date.now();

  broadcast({
    type: 'giveaway_ended',
    giveaway,
  });

  return { giveaway };
}

// Get giveaway details
router.get('/:giveawayId', requireAuth, (req, res) => {
  const { giveawayId } = req.params;
  const giveaway = giveaways.get(giveawayId);

  if (!giveaway) {
    return res.status(404).json({ error: 'Giveaway not found' });
  }

  const giveawayParticipants = participants.get(giveawayId);

  res.json({
    giveaway,
    participantCount: giveawayParticipants.size,
  });
});

// List all giveaways
router.get('/', requireAuth, (req, res) => {
  const allGiveaways = Array.from(giveaways.values())
    .filter(g => g.sessionId === req.sessionId)
    .map(g => ({
      ...g,
      participantCount: participants.get(g.id)?.size || 0,
    }));

  res.json({ giveaways: allGiveaways });
});

// Delete giveaway
router.delete('/:giveawayId', requireAuth, (req, res) => {
  const { giveawayId } = req.params;
  const giveaway = giveaways.get(giveawayId);

  if (!giveaway) {
    return res.status(404).json({ error: 'Giveaway not found' });
  }

  if (giveaway.sessionId !== req.sessionId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  giveaways.delete(giveawayId);
  participants.delete(giveawayId);

  broadcast({
    type: 'giveaway_deleted',
    giveawayId,
  });

  res.json({ success: true });
});

export default router;
