const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const { randomBytes, randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3003;
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'local-strategy-game-secret';
const usersFile = path.join(__dirname, 'data', 'users.json');
const games = new Map();
const boardSize = 10;
const obstacles = [
  { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 6 },
  { x: 6, y: 5 }, { x: 7, y: 3 }, { x: 3, y: 7 }, { x: 8, y: 6 },
  { x: 1, y: 6 }, { x: 6, y: 8 },
];
const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function readUsers() {
  const contents = await fs.readFile(usersFile, 'utf8');
  const users = JSON.parse(contents);
  if (!Array.isArray(users)) throw new Error('User data must be a JSON array');
  return users;
}

async function writeUsers(users) {
  await fs.writeFile(usersFile, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
}

function publicGame(game) {
  return {
    id: game.id,
    size: boardSize,
    status: game.status,
    players: game.players,
    obstacles: game.obstacles,
    currentTurn: game.currentTurn,
    winner: game.winner,
    createdAt: game.createdAt,
  };
}

function findGame(req, res) {
  const game = games.get(req.params.id.toUpperCase());
  if (!game) {
    res.status(404).json({ error: 'Game not found' });
    return null;
  }
  return game;
}

function findPlayer(game, userId, res) {
  const player = game.players.find((item) => item.userId === userId);
  if (!player) {
    res.status(403).json({ error: 'You are not a player in this game' });
    return null;
  }
  return player;
}

function requireTurn(game, userId, res) {
  if (game.status !== 'active') {
    res.status(409).json({ error: 'This game is not active', game: publicGame(game) });
    return false;
  }
  if (game.currentTurn !== userId) {
    res.status(409).json({ error: 'Wait for your turn', game: publicGame(game) });
    return false;
  }
  return true;
}

function finishGame(game, winner) {
  game.status = 'finished';
  game.winner = { userId: winner.userId, username: winner.username };
}

function authenticate(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    req.userId = jwt.verify(token, TOKEN_SECRET).sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired login token' });
  }
}

app.post('/api/register', async (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = req.body?.password;
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
    return res.status(400).json({ error: 'Username must be 3-20 letters, numbers, underscores, or hyphens' });
  }
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Password must be 8-72 UTF-8 bytes' });
  }

  const users = await readUsers();
  if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: 'Username is already taken' });
  }
  const user = { id: randomUUID(), username, password: await bcrypt.hash(password, 10) };
  users.push(user);
  await writeUsers(users);
  res.status(201).json({ message: 'Account created. Log in to play.' });
});

app.post('/api/login', async (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = req.body?.password;
  if (!username || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = await readUsers();
  const user = users.find((item) => item.username.toLowerCase() === username.toLowerCase());
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Incorrect username or password' });
  }

  const token = jwt.sign({ sub: user.id }, TOKEN_SECRET, { expiresIn: '12h' });
  res.json({ token, user: { id: user.id, username: user.username } });
});

app.get('/api/me', authenticate, async (req, res) => {
  const user = (await readUsers()).find((item) => item.id === req.userId);
  if (!user) return res.status(401).json({ error: 'Account not found' });
  res.json({ id: user.id, username: user.username });
});

app.post('/api/games', authenticate, async (req, res) => {
  const user = (await readUsers()).find((item) => item.id === req.userId);
  if (!user) return res.status(401).json({ error: 'Account not found' });

  let id;
  do { id = randomBytes(3).toString('hex').toUpperCase(); } while (games.has(id));
  const game = {
    id,
    status: 'waiting',
    players: [{ userId: user.id, username: user.username, position: { x: 0, y: 0 }, base: { x: 0, y: 0 } }],
    obstacles: obstacles.map((cell) => ({ ...cell })),
    currentTurn: user.id,
    winner: null,
    createdAt: new Date().toISOString(),
  };
  games.set(id, game);
  res.status(201).json({ game: publicGame(game) });
});

app.post('/api/games/:id/join', authenticate, async (req, res) => {
  const game = findGame(req, res);
  if (!game) return;
  if (game.status !== 'waiting') return res.status(409).json({ error: 'This game is not waiting for a player' });
  if (game.players.some((player) => player.userId === req.userId)) {
    return res.status(409).json({ error: 'You created this game; another player must join' });
  }
  const user = (await readUsers()).find((item) => item.id === req.userId);
  if (!user) return res.status(401).json({ error: 'Account not found' });

  game.players.push({ userId: user.id, username: user.username, position: { x: 9, y: 9 }, base: { x: 9, y: 9 } });
  game.status = 'active';
  res.json({ game: publicGame(game) });
});

app.get('/api/games/:id', authenticate, (req, res) => {
  const game = findGame(req, res);
  if (!game) return;
  if (!findPlayer(game, req.userId, res)) return;
  res.json({ game: publicGame(game) });
});

app.get('/api/games/:id/winner', authenticate, (req, res) => {
  const game = findGame(req, res);
  if (!game) return;
  if (!findPlayer(game, req.userId, res)) return;
  res.json({ status: game.status, winner: game.winner });
});

app.post('/api/games/:id/moves', authenticate, (req, res) => {
  const game = findGame(req, res);
  if (!game) return;
  const player = findPlayer(game, req.userId, res);
  if (!player) return;
  if (!requireTurn(game, req.userId, res)) return;

  const direction = directions[req.body?.direction];
  if (!direction) return res.status(400).json({ error: 'Direction must be up, down, left, or right' });

  const next = { x: player.position.x + direction.x, y: player.position.y + direction.y };
  if (next.x < 0 || next.x >= boardSize || next.y < 0 || next.y >= boardSize) {
    return res.status(400).json({ error: 'Move would leave the board' });
  }
  if (game.obstacles.some((cell) => cell.x === next.x && cell.y === next.y)) {
    return res.status(409).json({ error: 'An obstacle blocks that space' });
  }
  if (game.players.some((other) => other.userId !== req.userId && other.position.x === next.x && other.position.y === next.y)) {
    return res.status(409).json({ error: 'The other player occupies that space' });
  }

  player.position = next;
  const opponent = game.players.find((other) => other.userId !== req.userId);
  if (opponent && next.x === opponent.base.x && next.y === opponent.base.y) {
    finishGame(game, player);
  } else if (opponent) {
    game.currentTurn = opponent.userId;
  }
  res.json({ game: publicGame(game) });
});

app.post('/api/games/:id/attack', authenticate, (req, res) => {
  const game = findGame(req, res);
  if (!game) return;
  const player = findPlayer(game, req.userId, res);
  if (!player) return;
  if (!requireTurn(game, req.userId, res)) return;

  const opponent = game.players.find((other) => other.userId !== req.userId);
  if (!opponent) return res.status(409).json({ error: 'Waiting for another player' });
  const distance = Math.abs(player.position.x - opponent.base.x) + Math.abs(player.position.y - opponent.base.y);
  if (distance !== 1) return res.status(409).json({ error: 'Move next to the enemy base before attacking' });

  finishGame(game, player);
  res.json({ game: publicGame(game) });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));
app.use((error, req, res, next) => {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : error.message });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Strategy game listening on http://localhost:${PORT}`));
}

module.exports = app;
