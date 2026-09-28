const express = require('express');

const app = express();
const postsRouter = express.Router();
const PORT = process.env.PORT || 3000;
const posts = [];
let nextPostId = 1;

app.use(express.json());

postsRouter.get('/', (req, res) => {
	res.json(posts);
});

postsRouter.get('/:id', (req, res) => {
	const postId = parsePostId(req.params.id);
	if (!postId) {
		return res.status(400).json({ error: 'Post ID must be a positive integer.' });
	}

	const post = posts.find((item) => item.id === postId);
	if (!post) {
		return res.status(404).json({ error: 'Post not found.' });
	}

	res.json(post);
});

postsRouter.post('/', (req, res) => {
	const { title, content } = req.body;
	const validationError = validatePostFields(title, content);
	if (validationError) {
		return res.status(400).json({ error: validationError });
	}

	const post = {
		id: nextPostId++,
		title: title.trim(),
		content: content.trim(),
		timestamp: new Date().toISOString()
	};

	posts.push(post);
	res.status(201).json(post);
});

postsRouter.put('/:id', (req, res) => {
	const postId = parsePostId(req.params.id);
	if (!postId) {
		return res.status(400).json({ error: 'Post ID must be a positive integer.' });
	}

	const post = posts.find((item) => item.id === postId);
	if (!post) {
		return res.status(404).json({ error: 'Post not found.' });
	}

	const { title, content } = req.body;
	const validationError = validatePostFields(title, content);
	if (validationError) {
		return res.status(400).json({ error: validationError });
	}

	post.title = title.trim();
	post.content = content.trim();
	post.timestamp = new Date().toISOString();
	res.json(post);
});

postsRouter.delete('/:id', (req, res) => {
	const postId = parsePostId(req.params.id);
	if (!postId) {
		return res.status(400).json({ error: 'Post ID must be a positive integer.' });
	}

	const postIndex = posts.findIndex((item) => item.id === postId);
	if (postIndex === -1) {
		return res.status(404).json({ error: 'Post not found.' });
	}

	posts.splice(postIndex, 1);
	res.status(204).end();
});

app.use('/posts', postsRouter);

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found.' });
});

app.use((error, req, res, next) => {
	if (error.type === 'entity.parse.failed') {
		return res.status(400).json({ error: 'Request body must contain valid JSON.' });
	}

	console.error(error);
	res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
	console.log(`Blog API running at http://localhost:${PORT}`);
});

function parsePostId(value) {
	if (!/^\d+$/.test(value)) return null;
	const postId = Number(value);
	return Number.isSafeInteger(postId) && postId > 0 ? postId : null;
}

function validatePostFields(title, content) {
	if (typeof title !== 'string' || !title.trim()) {
		return 'A non-empty title is required.';
	}
	if (typeof content !== 'string' || !content.trim()) {
		return 'Non-empty content is required.';
	}
	return null;
}
