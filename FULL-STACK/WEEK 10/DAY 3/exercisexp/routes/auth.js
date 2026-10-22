const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const db = require('../db');
const { validateRegistration } = require('../utils/validation');
const { issueTokens, clearAuthCookies, hashToken } = require('../utils/tokens');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many refresh attempts. Try again later.' },
});
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many registrations from this IP. Try again later.' },
});

router.post('/register', registerLimiter, async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    const errors = validateRegistration({ username, email, password });
    if (errors.length) return res.status(400).json({ errors });

    const exists = db
      .prepare('SELECT id FROM users WHERE username = ? OR email = ?')
      .get(username, email);
    if (exists) {
      return res.status(409).json({ error: 'Username or email already in use.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const confirmToken = crypto.randomBytes(32).toString('hex');
    const info = db
      .prepare(
        'INSERT INTO users (username, email, password_hash, confirm_token) VALUES (?, ?, ?, ?)'
      )
      .run(username, email, passwordHash, confirmToken);

    const user = { id: Number(info.lastInsertRowid), username };
    const link = `${process.env.BASE_URL || 'http://localhost:3000'}/auth/confirm/${confirmToken}`;
    console.log(`[email] To: ${email} | Confirm your account: ${link}`);

    const { accessToken } = issueTokens(res, user);
    res.status(201).json({
      message: 'Registered. Check your email to confirm your address.',
      user: { id: user.id, username, email, confirmed: false },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/confirm/:token', (req, res) => {
  const user = db
    .prepare('SELECT id FROM users WHERE confirm_token = ?')
    .get(req.params.token);
  if (!user) {
    return res.status(400).json({ error: 'Invalid or already-used confirmation link.' });
  }

  db.prepare('UPDATE users SET confirmed = 1, confirm_token = NULL WHERE id = ?').run(user.id);
  res.json({ message: 'Email confirmed. Thank you!' });
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = db
      .prepare('SELECT * FROM users WHERE username = ? OR email = ?')
      .get(username, username);
    const ok = user && (await bcrypt.compare(password, user.password_hash));
    if (!ok) return res.status(401).json({ error: 'Invalid credentials.' });

    const { accessToken } = issueTokens(res, user);
    res.json({
      message: 'Logged in.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        confirmed: !!user.confirmed,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', refreshLimiter, (req, res) => {
  const token = req.cookies.refreshToken || (req.body && req.body.refreshToken);
  if (!token) return res.status(401).json({ error: 'Refresh token missing.' });

  try {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, { algorithms: ['HS256'] });
  } catch {
    clearAuthCookies(res);
    return res.status(403).json({ error: 'Invalid or expired refresh token.' });
  }

  const row = db
    .prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?')
    .get(hashToken(token));

  if (!row) {
    clearAuthCookies(res);
    return res.status(403).json({ error: 'Unknown refresh token.' });
  }
  if (row.revoked) {
    db.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?').run(row.user_id);
    clearAuthCookies(res);
    return res.status(403).json({ error: 'Refresh token revoked. Please log in again.' });
  }

  const user = db.prepare('SELECT id, username FROM users WHERE id = ?').get(row.user_id);
  if (!user) {
    clearAuthCookies(res);
    return res.status(403).json({ error: 'User no longer exists.' });
  }

  db.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE id = ?').run(row.id);
  const { accessToken } = issueTokens(res, user);
  res.json({ message: 'Token refreshed.', accessToken });
});

router.post('/logout', (req, res) => {
  const token = req.cookies.refreshToken || (req.body && req.body.refreshToken);
  if (token) {
    db.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?').run(hashToken(token));
  }
  clearAuthCookies(res);
  res.json({ message: 'Logged out.' });
});

module.exports = router;
