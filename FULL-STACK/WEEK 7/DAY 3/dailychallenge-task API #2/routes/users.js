const express = require('express');
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();
const usersFile = path.join(__dirname, '..', 'data', 'users.json');
const bcryptRounds = 10;
const registrationFields = ['name', 'lastName', 'email', 'username', 'password'];
const editableFields = registrationFields;

async function readUsers() {
  const contents = await fs.readFile(usersFile, 'utf8');
  const users = JSON.parse(contents);
  if (!Array.isArray(users)) {
    throw new Error('User data must be a JSON array');
  }
  return users;
}

async function writeUsers(users) {
  await fs.writeFile(usersFile, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function validateUser(body, { requireAll = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }

  const unknownField = Object.keys(body).find((field) => !editableFields.includes(field));
  if (unknownField) {
    return `Unknown user field: ${unknownField}`;
  }
  if (requireAll) {
    const missingField = registrationFields.find((field) => !(field in body));
    if (missingField) {
      return `${missingField} is required`;
    }
  } else if (Object.keys(body).length === 0) {
    return 'Provide at least one user field to update';
  }

  for (const field of ['name', 'lastName', 'username']) {
    if (field in body && (typeof body[field] !== 'string' || !body[field].trim())) {
      return `${field} must be a non-empty string`;
    }
  }
  if ('email' in body && (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()))) {
    return 'A valid email address is required';
  }
  if ('password' in body) {
    if (typeof body.password !== 'string' || !body.password) {
      return 'Password must be a non-empty string';
    }
    if (Buffer.byteLength(body.password, 'utf8') > 72) {
      return 'Password must be no longer than 72 UTF-8 bytes';
    }
  }

  return null;
}

function normalizedUserFields(body) {
  const fields = { ...body };
  for (const field of ['name', 'lastName', 'username']) {
    if (typeof fields[field] === 'string') fields[field] = fields[field].trim();
  }
  if (typeof fields.email === 'string') fields.email = fields.email.trim().toLowerCase();
  return fields;
}

function sendValidationError(res, message) {
  if (message) {
    res.status(400).json({ error: message });
    return true;
  }
  return false;
}

async function hasDuplicateIdentity(users, fields, ignoredId) {
  return users.some((user) => user.id !== ignoredId && (
    user.username.toLowerCase() === fields.username?.toLowerCase()
    || user.email.toLowerCase() === fields.email?.toLowerCase()
  ));
}

async function passwordAlreadyUsed(users, password, ignoredId) {
  for (const user of users) {
    if (user.id !== ignoredId && await bcrypt.compare(password, user.password)) {
      return true;
    }
  }
  return false;
}

router.post('/register', async (req, res) => {
  const validationError = validateUser(req.body, { requireAll: true });
  if (sendValidationError(res, validationError)) return;

  const fields = normalizedUserFields(req.body);
  const users = await readUsers();
  if (await hasDuplicateIdentity(users, fields)) {
    return res.status(409).json({ error: 'Username or email already exists' });
  }
  if (await passwordAlreadyUsed(users, fields.password)) {
    return res.status(409).json({ error: 'Password is already in use' });
  }

  const user = {
    id: randomUUID(),
    name: fields.name,
    lastName: fields.lastName,
    email: fields.email,
    username: fields.username,
    password: await bcrypt.hash(fields.password, bcryptRounds),
  };
  users.push(user);
  await writeUsers(users);
  res.status(201).json({ message: 'Registration successful', user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = await readUsers();
  const user = users.find((item) => item.username.toLowerCase() === username.trim().toLowerCase());
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.json({ message: `Welcome, ${user.name}!`, user: publicUser(user) });
});

router.get('/users', async (req, res) => {
  const users = await readUsers();
  res.json(users.map(publicUser));
});

router.get('/users/:id', async (req, res) => {
  const users = await readUsers();
  const user = users.find((item) => item.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(publicUser(user));
});

router.put('/users/:id', async (req, res) => {
  const validationError = validateUser(req.body);
  if (sendValidationError(res, validationError)) return;

  const users = await readUsers();
  const userIndex = users.findIndex((item) => item.id === req.params.id);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  const fields = normalizedUserFields(req.body);
  if (await hasDuplicateIdentity(users, fields, req.params.id)) {
    return res.status(409).json({ error: 'Username or email already exists' });
  }
  if (fields.password && await passwordAlreadyUsed(users, fields.password, req.params.id)) {
    return res.status(409).json({ error: 'Password is already in use' });
  }
  if (fields.password) fields.password = await bcrypt.hash(fields.password, bcryptRounds);

  users[userIndex] = { ...users[userIndex], ...fields };
  await writeUsers(users);
  res.json(publicUser(users[userIndex]));
});

module.exports = router;
