const crypto = require('crypto');

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'default-dev-secret-change-in-production';
const TOKEN_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// The clue exists ONLY here on the server
const CLUE_TEXT = "Luck stretches wide from end to end,\nWhere seven colors gently bend.";

function verifyToken(token) {
  try {
    // Decode base64 token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    const { payload, signature } = decoded;
    
    // Verify signature
    const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
    if (signature !== expectedSignature) {
      return { valid: false, reason: 'Invalid signature' };
    }
    
    // Check expiry
    const { timestamp } = JSON.parse(payload);
    const now = Date.now();
    if (now - timestamp > TOKEN_EXPIRY_MS) {
      return { valid: false, reason: 'Token expired' };
    }
    
    return { valid: true };
  } catch (e) {
    return { valid: false, reason: 'Invalid token format' };
  }
}

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  const { token } = body;

  if (!token) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Token required' }),
    };
  }

  // Verify token
  const verification = verifyToken(token);
  if (!verification.valid) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: verification.reason }),
    };
  }

  // Token valid - return the clue
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clue: CLUE_TEXT }),
  };
};



