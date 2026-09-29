const express = require('express');
const booksController = require('../controllers/booksController');

const router = express.Router();

router.get('/', booksController.listBooks);
router.get('/:bookId', booksController.getBook);
router.post('/', booksController.createBook);
router.put('/:bookId', booksController.updateBook);
router.delete('/:bookId', booksController.deleteBook);

module.exports = router;
