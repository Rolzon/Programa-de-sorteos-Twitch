import express from 'express';
import { getAccessToken } from './auth.js';

const router = express.Router();
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

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

  req.accessToken = accessToken;
  next();
}

// Get channel information
router.get('/channel/:broadcasterId', requireAuth, async (req, res) => {
  try {
    const { broadcasterId } = req.params;
    const response = await fetch(
      `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`,
          'Client-Id': TWITCH_CLIENT_ID,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching channel:', error);
    res.status(500).json({ error: 'Failed to fetch channel information' });
  }
});

// Get followers
router.get('/followers/:broadcasterId', requireAuth, async (req, res) => {
  try {
    const { broadcasterId } = req.params;
    const { after } = req.query;
    
    let url = `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}&first=100`;
    if (after) {
      url += `&after=${after}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${req.accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// Get subscribers
router.get('/subscribers/:broadcasterId', requireAuth, async (req, res) => {
  try {
    const { broadcasterId } = req.params;
    const { after } = req.query;
    
    let url = `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${broadcasterId}&first=100`;
    if (after) {
      url += `&after=${after}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${req.accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Get chatters (using EventSub or TMI)
router.get('/chatters/:broadcasterId', requireAuth, async (req, res) => {
  try {
    const { broadcasterId } = req.params;
    
    // Note: Twitch removed the chatters endpoint from Helix API
    // This would need to be implemented using IRC/TMI or EventSub
    // For now, return a placeholder
    res.json({
      data: [],
      message: 'Chatters endpoint requires IRC/TMI integration',
    });
  } catch (error) {
    console.error('Error fetching chatters:', error);
    res.status(500).json({ error: 'Failed to fetch chatters' });
  }
});

// Get VIPs
router.get('/vips/:broadcasterId', requireAuth, async (req, res) => {
  try {
    const { broadcasterId } = req.params;
    
    const response = await fetch(
      `https://api.twitch.tv/helix/channels/vips?broadcaster_id=${broadcasterId}`,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`,
          'Client-Id': TWITCH_CLIENT_ID,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching VIPs:', error);
    res.status(500).json({ error: 'Failed to fetch VIPs' });
  }
});

// Get moderators
router.get('/moderators/:broadcasterId', requireAuth, async (req, res) => {
  try {
    const { broadcasterId } = req.params;
    
    const response = await fetch(
      `https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${broadcasterId}`,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`,
          'Client-Id': TWITCH_CLIENT_ID,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching moderators:', error);
    res.status(500).json({ error: 'Failed to fetch moderators' });
  }
});

export default router;
