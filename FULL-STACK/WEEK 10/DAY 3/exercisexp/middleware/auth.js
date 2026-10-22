const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  let token = req.cookies && req.cookies.accessToken;
  const header = req.headers.authorization;
  if (!token && header && header.startsWith('Bearer ')) {
    token = header.slice(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.', code: 'NO_TOKEN' });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      algorithms: ['HS256'],
    });
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ error: 'Invalid token.', code: 'TOKEN_INVALID' });
  }
}

module.exports = authenticate;
