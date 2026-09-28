const axios = require('axios');
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const exercise = process.argv[2] || 'exercise1';
const PORT = process.env.PORT || 5000;

app.use(express.json());

if (exercise === 'exercise1') {
	const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

	app.get('/api/posts', async (req, res) => {
		try {
			const response = await axios.get(POSTS_URL);
			res.json(response.data);
		} catch (error) {
			sendUpstreamError(res, error);
		}
	});

	app.get('/api/posts/:id', async (req, res) => {
		try {
			const response = await axios.get(`${POSTS_URL}/${req.params.id}`);
			res.json(response.data);
		} catch (error) {
			sendUpstreamError(res, error);
		}
	});

	app.post('/api/posts', async (req, res) => {
		try {
			const response = await axios.post(POSTS_URL, req.body);
			res.status(response.status).json(response.data);
		} catch (error) {
			sendUpstreamError(res, error);
		}
	});

	app.put('/api/posts/:id', async (req, res) => {
		try {
			const response = await axios.put(`${POSTS_URL}/${req.params.id}`, req.body);
			res.json(response.data);
		} catch (error) {
			sendUpstreamError(res, error);
		}
	});

	app.delete('/api/posts/:id', async (req, res) => {
		try {
			const response = await axios.delete(`${POSTS_URL}/${req.params.id}`);
			res.status(response.status).json(response.data);
		} catch (error) {
			sendUpstreamError(res, error);
		}
	});
} else if (exercise === 'exercise2') {
	const JWT_SECRET = process.env.JWT_SECRET || 'development-only-change-this-secret';
	const MAX_FAILED_ATTEMPTS = 5;
	const LOCK_DURATION_MS = 15 * 60 * 1000;
	const users = [];

	app.post('/api/register', async (req, res) => {
		const { username, password } = req.body;

		if (typeof username !== 'string' || !username.trim() || typeof password !== 'string') {
			return res.status(400).json({ error: 'A username and password are required.' });
		}
		if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
			return res.status(400).json({
				error: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.'
			});
		}

		const normalizedUsername = username.trim();
		if (users.some((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase())) {
			return res.status(409).json({ error: 'Username is already registered.' });
		}

		try {
			const user = {
				id: users.length + 1,
				username: normalizedUsername,
				passwordHash: await bcrypt.hash(password, 12),
				failedAttempts: 0,
				lockedUntil: null
			};
			users.push(user);
			res.status(201).json({ id: user.id, username: user.username });
		} catch (error) {
			res.status(500).json({ error: 'Unable to register user.' });
		}
	});

	app.post('/api/login', async (req, res) => {
		const { username, password } = req.body;
		if (typeof username !== 'string' || typeof password !== 'string') {
			return res.status(400).json({ error: 'A username and password are required.' });
		}

		const user = users.find((item) => item.username.toLowerCase() === username.trim().toLowerCase());
		if (!user) {
			return res.status(401).json({ error: 'Invalid username or password.' });
		}
		if (user.lockedUntil && user.lockedUntil > Date.now()) {
			const retryAfter = Math.ceil((user.lockedUntil - Date.now()) / 1000);
			res.set('Retry-After', String(retryAfter));
			return res.status(429).json({ error: 'Account temporarily locked after failed login attempts.' });
		}
		if (user.lockedUntil) {
			user.failedAttempts = 0;
			user.lockedUntil = null;
		}

		try {
			const passwordMatches = await bcrypt.compare(password, user.passwordHash);
			if (!passwordMatches) {
				user.failedAttempts += 1;
				if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
					user.lockedUntil = Date.now() + LOCK_DURATION_MS;
					res.set('Retry-After', String(Math.ceil(LOCK_DURATION_MS / 1000)));
					return res.status(429).json({ error: 'Account temporarily locked after failed login attempts.' });
				}
				return res.status(401).json({ error: 'Invalid username or password.' });
			}

			user.failedAttempts = 0;
			const token = jwt.sign({ sub: String(user.id) }, JWT_SECRET, { expiresIn: '1h' });
			res.json({ token, tokenType: 'Bearer', expiresIn: 3600 });
		} catch (error) {
			res.status(500).json({ error: 'Unable to log in.' });
		}
	});

	app.get('/api/profile', (req, res) => {
		const authorization = req.get('authorization') || '';
		const [scheme, token] = authorization.split(' ');
		if (scheme !== 'Bearer' || !token) {
			return res.status(401).json({ error: 'A bearer token is required.' });
		}

		try {
			const payload = jwt.verify(token, JWT_SECRET);
			const user = users.find((item) => String(item.id) === payload.sub);
			if (!user) {
				return res.status(401).json({ error: 'User no longer exists.' });
			}
			res.json({ id: user.id, username: user.username });
		} catch (error) {
			res.status(401).json({ error: 'Invalid or expired token.' });
		}
	});
} else if (exercise === 'exercise3') {
	const todos = [];
	let nextId = 1;

	app.get('/api/todos', (req, res) => {
		res.json(todos);
	});

	app.get('/api/todos/:id', (req, res) => {
		const todo = findTodo(todos, req.params.id);
		if (!todo) {
			return res.status(404).json({ error: 'Todo not found.' });
		}
		res.json(todo);
	});

	app.post('/api/todos', (req, res) => {
		const { title, completed } = req.body;
		if (typeof title !== 'string' || !title.trim()) {
			return res.status(400).json({ error: 'A non-empty title is required.' });
		}
		if (completed !== undefined && typeof completed !== 'boolean') {
			return res.status(400).json({ error: 'Completed must be a boolean.' });
		}

		const todo = { id: nextId++, title: title.trim(), completed: completed ?? false };
		todos.push(todo);
		res.status(201).json(todo);
	});

	app.put('/api/todos/:id', (req, res) => {
		const todo = findTodo(todos, req.params.id);
		if (!todo) {
			return res.status(404).json({ error: 'Todo not found.' });
		}

		const { title, completed } = req.body;
		if (title === undefined && completed === undefined) {
			return res.status(400).json({ error: 'Provide a title or completed value to update.' });
		}
		if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
			return res.status(400).json({ error: 'Title must be a non-empty string.' });
		}
		if (completed !== undefined && typeof completed !== 'boolean') {
			return res.status(400).json({ error: 'Completed must be a boolean.' });
		}

		if (title !== undefined) todo.title = title.trim();
		if (completed !== undefined) todo.completed = completed;
		res.json(todo);
	});

	app.delete('/api/todos/:id', (req, res) => {
		const todoIndex = todos.findIndex((todo) => todo.id === parseTodoId(req.params.id));
		if (todoIndex === -1) {
			return res.status(404).json({ error: 'Todo not found.' });
		}

		todos.splice(todoIndex, 1);
		res.status(204).end();
	});
} else {
	console.error('Choose exercise1 (posts), exercise2 (login), or exercise3 (todos).');
	process.exit(1);
}

app.listen(PORT, () => {
	console.log(`${exercise} API running at http://localhost:${PORT}`);
});

function sendUpstreamError(res, error) {
	if (error.response) {
		return res.status(error.response.status).json({
			error: 'The posts service returned an error.',
			details: error.response.data
		});
	}

	res.status(502).json({ error: 'The posts service is unavailable.' });
}

function findTodo(todos, value) {
	const id = parseTodoId(value);
	return todos.find((todo) => todo.id === id);
}

function parseTodoId(value) {
	if (!/^\d+$/.test(value)) return NaN;
	const id = Number(value);
	return Number.isSafeInteger(id) && id > 0 ? id : NaN;
}
