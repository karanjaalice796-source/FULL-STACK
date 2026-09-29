const bookModel = require('../models/bookModel');

function parseBookId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    const error = new Error('bookId must be a positive integer');
    error.status = 400;
    throw error;
  }
  return id;
}

function readBookBody(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const author = typeof body.author === 'string' ? body.author.trim() : '';
  const publishedYear = Number(body.publishedYear);
  if (!title || !author || !Number.isInteger(publishedYear) || publishedYear < 1) {
    const error = new Error('title, author, and a valid publishedYear are required');
    error.status = 400;
    throw error;
  }
  return { title, author, publishedYear };
}

function listBooks(req, res) {
  res.json(bookModel.getAllBooks());
}

function getBook(req, res) {
  const book = bookModel.getBookById(parseBookId(req.params.bookId));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.status(200).json(book);
}

function createBook(req, res) {
  res.status(201).json(bookModel.createBook(readBookBody(req.body || {})));
}

function updateBook(req, res) {
  const book = bookModel.updateBook(
    parseBookId(req.params.bookId),
    readBookBody(req.body || {}),
  );
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
}

function deleteBook(req, res) {
  if (!bookModel.deleteBook(parseBookId(req.params.bookId))) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.status(204).end();
}

module.exports = { listBooks, getBook, createBook, updateBook, deleteBook };
