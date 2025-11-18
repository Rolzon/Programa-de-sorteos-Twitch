import express from 'express';
import dotenv from 'dotenv';

// Load environment variables BEFORE reading them
dotenv.config();

const router = express.Router();

// Store tokens temporarily (in production, use a database)
const tokenStore = new Map();

// Twitch OAuth configuration
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;

// Generate authorization URL
router.get('/login', (req, res) => {
  const scopes = [
    'user:read:email',
    'channel:read:subscriptions',
    'moderator:read:followers',
    'channel:read:redemptions',
    'bits:read',
    'chat:read',
    'chat:edit',
  ].join(' ');

  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(scopes)}`;

  res.json({ authUrl });
});

// OAuth callback
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No authorization code provided');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: TWITCH_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.message || 'Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    const userData = await userResponse.json();
    const user = userData.data[0];

    // Store token with user ID
    const sessionId = Math.random().toString(36).substring(7);
    tokenStore.set(sessionId, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      user,
      timestamp: Date.now(),
    });

    // Redirect to frontend with session ID
    // Use the origin of TWITCH_REDIRECT_URI so it works in production
    const redirectOrigin = TWITCH_REDIRECT_URI
      ? new URL(TWITCH_REDIRECT_URI).origin
      : 'http://localhost:5173';

    res.redirect(`${redirectOrigin}?session=${sessionId}`);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send('Authentication failed');
  }
});

// Get session info
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = tokenStore.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  // Check if token is expired
  const expiresAt = session.timestamp + (session.expiresIn * 1000);
  if (Date.now() > expiresAt) {
    tokenStore.delete(sessionId);
    return res.status(401).json({ error: 'Session expired' });
  }

  res.json({
    user: session.user,
    expiresAt,
  });
});

// Refresh token
router.post('/refresh/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const session = tokenStore.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: session.refreshToken,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.message || 'Failed to refresh token');
    }

    // Update session
    session.accessToken = tokenData.access_token;
    session.refreshToken = tokenData.refresh_token;
    session.expiresIn = tokenData.expires_in;
    session.timestamp = Date.now();

    tokenStore.set(sessionId, session);

    res.json({ success: true });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Logout
router.post('/logout/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  tokenStore.delete(sessionId);
  res.json({ success: true });
});

// Get access token for internal use
export function getAccessToken(sessionId) {
  const session = tokenStore.get(sessionId);
  return session?.accessToken;
}

export default router;
