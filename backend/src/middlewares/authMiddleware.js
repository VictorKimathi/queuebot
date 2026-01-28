const jwt = require('jsonwebtoken');
const { getServerConfig } = require('../config/server');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) {
    return res.status(401).json({ ok: false, error: { message: 'Missing Authorization header' } });
  }

  try {
    const { jwtSecret } = getServerConfig();
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload; // { id, role }
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: { message: 'Invalid or expired token' } });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, error: { message: 'Unauthenticated' } });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: { message: 'Forbidden' } });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };

