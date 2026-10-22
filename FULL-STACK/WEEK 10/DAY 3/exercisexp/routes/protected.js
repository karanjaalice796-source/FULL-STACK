const express = require('express');
const crypto = require('crypto');

const db = require('../db');
const authenticate = require('../middleware/auth');
const { isValidEmail } = require('../utils/validation');

const router = express.Router();

router.use(authenticate);

router.get('/auth-check', (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});

router.get('/protected', (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is protected data.` });
});

router.get('/me', (req, res) => {
  const user = db
    .prepare('SELECT id, username, email, confirmed, created_at FROM users WHERE id = ?')
    .get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ ...user, confirmed: !!user.confirmed });
});

router.put('/profile', (req, res) => {
  const { username, email } = req.body || {};
  const current = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!current) return res.status(404).json({ error: 'User not found.' });

  const errors = [];
  const newUsername = username !== undefined ? username : current.username;
  const newEmail = email !== undefined ? email : current.email;

  if (username !== undefined && (
    typeof username !== 'string' || !/^[a-zA-Z0-9_]{3,20}$/.test(username)
  )) {
    errors.push('Username must be 3-20 characters: letters, numbers, underscores only.');
  }
  if (email !== undefined && !isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }
  if (errors.length) return res.status(400).json({ errors });

  const clash = db
    .prepare('SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?')
    .get(newUsername, newEmail, req.user.id);
  if (clash) return res.status(409).json({ error: 'Username or email already in use.' });

  let confirmed = current.confirmed;
  let confirmToken = current.confirm_token;
  if (newEmail.toLowerCase() !== current.email.toLowerCase()) {
    confirmed = 0;
    confirmToken = crypto.randomBytes(32).toString('hex');
    const link = `${process.env.BASE_URL || 'http://localhost:3000'}/auth/confirm/${confirmToken}`;
    console.log(`[email] To: ${newEmail} | Confirm your new address: ${link}`);
  }

  db.prepare(
    'UPDATE users SET username = ?, email = ?, confirmed = ?, confirm_token = ? WHERE id = ?'
  ).run(newUsername, newEmail, confirmed, confirmToken, req.user.id);

  res.json({
    message: 'Profile updated. If you changed your username, log in again to refresh your token.',
    user: {
      id: req.user.id,
      username: newUsername,
      email: newEmail,
      confirmed: !!confirmed,
    },
  });
});

module.exports = router;
