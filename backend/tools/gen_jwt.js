const crypto = require('crypto');
const secret = process.env.JWT_SECRET || 'dev_secret';
const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
const payload = Buffer.from(JSON.stringify({ id: 1, email: 'test@local', role: 'ADMIN', hospital_id: null, iat: Math.floor(Date.now()/1000) })).toString('base64url');
const sig = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
console.log(`${header}.${payload}.${sig}`);
