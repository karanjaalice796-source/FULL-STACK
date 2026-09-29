const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function requiredText(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw httpError(400, `${field} is required`);
  }
  return value.trim();
}

function parseUserId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw httpError(400, 'id must be a positive integer');
  return id;
}

function publicUser(user) {
  const { password, ...profile } = user;
  return profile;
}

async function register(req, res) {
  const email = requiredText(req.body?.email, 'email');
  const username = requiredText(req.body?.username, 'username');
  const password = requiredText(req.body?.password, 'password');
  if (!email.includes('@')) throw httpError(400, 'email must be valid');
  if (password.length < 8) throw httpError(400, 'password must be at least 8 characters');

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await userModel.createUser({
      email,
      username,
      first_name: typeof req.body.first_name === 'string' ? req.body.first_name.trim() : null,
      last_name: typeof req.body.last_name === 'string' ? req.body.last_name.trim() : null,
      passwordHash,
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === '23505') throw httpError(409, 'email or username is already registered');
    throw error;
  }
}

async function login(req, res) {
  const username = requiredText(req.body?.username, 'username');
  const password = requiredText(req.body?.password, 'password');
  const user = await userModel.getUserForLogin(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw httpError(401, 'Invalid username or password');
  }
  res.json(publicUser(user));
}

async function listUsers(req, res) {
  res.json(await userModel.getAllUsers());
}

async function getUser(req, res) {
  const user = await userModel.getUserById(parseUserId(req.params.id));
  if (!user) throw httpError(404, 'User not found');
  res.json(user);
}

async function updateUser(req, res) {
  const changes = {};
  for (const field of ['email', 'username', 'first_name', 'last_name']) {
    if (Object.hasOwn(req.body || {}, field)) {
      changes[field] = requiredText(req.body[field], field);
    }
  }

  if (changes.email && !changes.email.includes('@')) throw httpError(400, 'email must be valid');
  if (Object.hasOwn(req.body || {}, 'password')) {
    const password = requiredText(req.body.password, 'password');
    if (password.length < 8) throw httpError(400, 'password must be at least 8 characters');
    changes.passwordHash = await bcrypt.hash(password, 12);
  }
  if (Object.keys(changes).length === 0) throw httpError(400, 'At least one field is required');

  try {
    const user = await userModel.updateUser(parseUserId(req.params.id), changes);
    if (!user) throw httpError(404, 'User not found');
    res.json(user);
  } catch (error) {
    if (error.code === '23505') throw httpError(409, 'email or username is already registered');
    throw error;
  }
}

module.exports = { register, login, listUsers, getUser, updateUser };
