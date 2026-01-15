const crypto = require('crypto');

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'default-dev-secret-change-in-production';
const TOKEN_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// The password exists ONLY here on the server
const HELL_PASSWORD = "HAMTAO_SAYS_OK";
const HELL_MESSAGE = `Congratulations on beating Hell mode!

Take a screenshot of your board and post it on X to claim your rewards.
You will be asked for a secret password to claim your rewards—do not share it with anyone!

password : ${HELL_PASSWORD}`;

function verifyToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    const { payload, signature } = decoded;
    
    const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
    if (signature !== expectedSignature) {
      return { valid: false, reason: 'Invalid signature' };
    }
    
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
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

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

  const verification = verifyToken(token);
  if (!verification.valid) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: verification.reason }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: HELL_MESSAGE }),
  };
};

