const express = require('express');

function createHomeRouter() {
	const router = express.Router();

	router.get('/', (req, res) => {
		res.send('Welcome to the homepage!');
	});

	router.get('/about', (req, res) => {
		res.send('About Us');
	});

	return router;
}

function createTodosRouter() {
	const router = express.Router();
	const todos = [];
	let nextId = 1;

	router.get('/', (req, res) => {
		res.json(todos);
	});

	router.post('/', (req, res) => {
		const { title } = req.body;

		if (typeof title !== 'string' || !title.trim()) {
			return res.status(400).json({ error: 'A non-empty title is required.' });
		}

		const todo = { id: nextId++, title: title.trim(), completed: false };
		todos.push(todo);
		res.status(201).json(todo);
	});

	router.put('/:id', (req, res) => {
		const todo = todos.find((item) => item.id === Number(req.params.id));

		if (!todo) {
			return res.status(404).json({ error: 'To-do item not found.' });
		}

		const { title, completed } = req.body;

		if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
			return res.status(400).json({ error: 'Title must be a non-empty string.' });
		}
		if (completed !== undefined && typeof completed !== 'boolean') {
			return res.status(400).json({ error: 'Completed must be a boolean.' });
		}
		if (title === undefined && completed === undefined) {
			return res.status(400).json({ error: 'Provide a title or completed value to update.' });
		}

		if (title !== undefined) todo.title = title.trim();
		if (completed !== undefined) todo.completed = completed;
		res.json(todo);
	});

	router.delete('/:id', (req, res) => {
		const todoIndex = todos.findIndex((item) => item.id === Number(req.params.id));

		if (todoIndex === -1) {
			return res.status(404).json({ error: 'To-do item not found.' });
		}

		todos.splice(todoIndex, 1);
		res.status(204).end();
	});

	return router;
}

function createBooksRouter() {
	const router = express.Router();
	const books = [];
	let nextId = 1;

	router.get('/', (req, res) => {
		res.json(books);
	});

	router.post('/', (req, res) => {
		const { title, author } = req.body;

		if (typeof title !== 'string' || !title.trim() ||
				typeof author !== 'string' || !author.trim()) {
			return res.status(400).json({ error: 'A non-empty title and author are required.' });
		}

		const book = { id: nextId++, title: title.trim(), author: author.trim() };
		books.push(book);
		res.status(201).json(book);
	});

	router.put('/:id', (req, res) => {
		const book = books.find((item) => item.id === Number(req.params.id));

		if (!book) {
			return res.status(404).json({ error: 'Book not found.' });
		}

		const { title, author } = req.body;

		if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
			return res.status(400).json({ error: 'Title must be a non-empty string.' });
		}
		if (author !== undefined && (typeof author !== 'string' || !author.trim())) {
			return res.status(400).json({ error: 'Author must be a non-empty string.' });
		}
		if (title === undefined && author === undefined) {
			return res.status(400).json({ error: 'Provide a title or author value to update.' });
		}

		if (title !== undefined) book.title = title.trim();
		if (author !== undefined) book.author = author.trim();
		res.json(book);
	});

	router.delete('/:id', (req, res) => {
		const bookIndex = books.findIndex((item) => item.id === Number(req.params.id));

		if (bookIndex === -1) {
			return res.status(404).json({ error: 'Book not found.' });
		}

		books.splice(bookIndex, 1);
		res.status(204).end();
	});

	return router;
}

const exercise = process.argv[2] || 'exercise1';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

if (exercise === 'exercise1') {
	app.use('/', createHomeRouter());
} else if (exercise === 'exercise2') {
	app.use('/todos', createTodosRouter());
} else if (exercise === 'exercise3') {
	app.use('/books', createBooksRouter());
} else {
	console.error('Choose exercise1, exercise2, or exercise3.');
	process.exit(1);
}

app.listen(PORT, () => {
	console.log(`${exercise} server running at http://localhost:${PORT}`);
});
