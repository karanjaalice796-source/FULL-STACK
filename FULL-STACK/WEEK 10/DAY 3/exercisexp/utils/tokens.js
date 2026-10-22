const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

const isProd = process.env.NODE_ENV === 'production';
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_EXPIRES, algorithm: 'HS256' }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_EXPIRES, jwtid: crypto.randomUUID(), algorithm: 'HS256' }
  );
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function cookieOptions(maxAgeMs, path = '/') {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: maxAgeMs,
    path,
  };
}

function issueTokens(res, user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const accessExp = jwt.decode(accessToken).exp * 1000;
  const refreshExp = jwt.decode(refreshToken).exp * 1000;

  db.prepare(
    'INSERT INTO refresh_tokens (token_hash, user_id, expires_at) VALUES (?, ?, ?)'
  ).run(hashToken(refreshToken), user.id, refreshExp);

  res.cookie('accessToken', accessToken, cookieOptions(accessExp - Date.now()));
  res.cookie('refreshToken', refreshToken, cookieOptions(refreshExp - Date.now(), '/auth'));

  return { accessToken, refreshToken };
}

function clearAuthCookies(res) {
  res.clearCookie('accessToken', cookieOptions(0));
  res.clearCookie('refreshToken', cookieOptions(0, '/auth'));
}

module.exports = { issueTokens, clearAuthCookies, hashToken };
