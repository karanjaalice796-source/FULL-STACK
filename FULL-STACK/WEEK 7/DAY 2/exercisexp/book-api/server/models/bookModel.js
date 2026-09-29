const books = [
  { id: 1, title: 'The Hobbit', author: 'J. R. R. Tolkien', publishedYear: 1937 },
  { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', publishedYear: 1813 },
];

let nextId = Math.max(0, ...books.map((book) => book.id)) + 1;

function getAllBooks() {
  return books;
}

function getBookById(id) {
  return books.find((book) => book.id === id) || null;
}

function createBook(bookData) {
  const book = { id: nextId++, ...bookData };
  books.push(book);
  return book;
}

function updateBook(id, bookData) {
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return null;
  books[index] = { id, ...bookData };
  return books[index];
}

function deleteBook(id) {
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return false;
  books.splice(index, 1);
  return true;
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
