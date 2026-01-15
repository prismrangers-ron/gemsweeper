const crypto = require('crypto');

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'default-dev-secret-change-in-production';
const TOKEN_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function generateToken() {
  const timestamp = Date.now();
  const payload = JSON.stringify({ timestamp, nonce: crypto.randomBytes(16).toString('hex') });
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  
  // Base64 encode the payload and signature together
  const token = Buffer.from(JSON.stringify({ payload, signature })).toString('base64');
  return token;
}

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

  const token = generateToken();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  };
};



