//ex1: Building a RESTful API
// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Simulated database
let posts = [
    { id: 1, title: 'Introduction to Node.js', content: 'Node.js is a runtime environment built on V8.' },
    { id: 2, title: 'Understanding Express', content: 'Express is a fast, unopinionated web framework for Node.js.' }
];

// GET /posts - Return all blog posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// GET /posts/:id - Return a specific blog post
app.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
});

// POST /posts - Create a new blog post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const newPost = {
        id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
        title,
        content
    };
    
    posts.push(newPost);
    res.status(201).json(newPost);
});

// PUT /posts/:id - Update an existing blog post
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
    }
    
    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    
    res.json(post);
});

// DELETE /posts/:id - Delete a blog post
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Blog post not found' });
    }
    
    const deletedPost = posts.splice(postIndex, 1);
    res.json({ message: 'Post deleted successfully', deletedPost });
});

// Error handling for invalid routes (404)
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Server-error fallback handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Blog API server is running on http://localhost:${PORT}`);
});

//ex2: Building a Basic CRUD API with Express.js
// app.js
const express = require('express');
const booksApp = express();
const BOOKS_PORT = 5000;

// Parse JSON request body middleware
booksApp.use(express.json());

// Basic books data array
let books = [
    { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937 },
    { id: 2, title: '1984', author: 'George Orwell', publishedYear: 1949 },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedYear: 1960 }
];

// GET /api/books - Read all books
booksApp.get('/api/books', (req, res) => {
    res.json(books);
});

// GET /api/books/:bookId - Read a single book by ID
booksApp.get('/api/books/:bookId', (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json(book);
});

// POST /api/books - Create a new book
booksApp.post('/api/books', (req, res) => {
    const { title, author, publishedYear } = req.body;
    
    const newBook = {
        id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
        title,
        author,
        publishedYear
    };
    
    books.push(newBook);
    res.status(201).json(newBook);
});

// Start server
booksApp.listen(BOOKS_PORT, () => {
    console.log(`Book API server is running on http://localhost:${BOOKS_PORT}`);
});

//ex: Building a CRUD API with Express and Axios
// data/dataService.js
const axios = require('axios');

async function fetchPosts() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching data from JSONPlaceholder:', error.message);
        throw error;
    }
}

module.exports = { fetchPosts };