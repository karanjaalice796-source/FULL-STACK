import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { BookItem, type Book, type NewBook, type ReadingStatus } from '../model/Book';
import { sampleBooks } from '../model/sampleBooks';

export type BookFilter = 'all' | ReadingStatus;
export type BookSort = 'date' | 'title' | 'author';

export interface BooksState {
  books: Book[];
  filter: BookFilter;
  category: string;
  search: string;
  sort: BookSort;
  sortDirection: 'asc' | 'desc';
  persistenceError: string | null;
}

const STORAGE_KEY = 'page-and-pine-books';
const SAMPLE_SHELF_VERSION = '2026-releases';
const SAMPLE_SHELF_KEY = 'page-and-pine-sample-shelf-version';
const statuses: ReadingStatus[] = ['to-read', 'reading', 'read'];

function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) return false;
  const book = value as Record<string, unknown>;
  return (
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    typeof book.author === 'string' &&
    typeof book.category === 'string' &&
    (book.coverIsbn === undefined || typeof book.coverIsbn === 'string') &&
    (book.note === undefined || typeof book.note === 'string') &&
    statuses.includes(book.status as ReadingStatus) &&
    typeof book.rating === 'number' &&
    Number.isInteger(book.rating) &&
    book.rating >= 0 &&
    book.rating <= 5 &&
    typeof book.addedAt === 'string'
  );
}

function loadBooks(): { books: Book[]; error: string | null } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let books: Book[] = [];
    if (stored !== null) {
      const data: unknown = JSON.parse(stored);
      if (!Array.isArray(data) || !data.every(isBook)) {
        return { books: [], error: 'Saved library data is invalid. Add books to start a fresh collection.' };
      }
      books = data;
    }

    if (localStorage.getItem(SAMPLE_SHELF_KEY) !== SAMPLE_SHELF_VERSION) {
      books = books.filter((book) => !book.id.startsWith('sample-'));
      const existingBooks = new Set(
        books.map((book) => `${book.title.toLocaleLowerCase()}|${book.author.toLocaleLowerCase()}`)
      );
      const starterBooks = sampleBooks.filter(
        (book) => !existingBooks.has(`${book.title.toLocaleLowerCase()}|${book.author.toLocaleLowerCase()}`)
      );
      books = [...books, ...starterBooks];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        localStorage.setItem(SAMPLE_SHELF_KEY, SAMPLE_SHELF_VERSION);
      } catch {
        return {
          books,
          error: 'Your starter shelf is ready, but the browser could not save it for next time.',
        };
      }
    }
    return { books, error: null };
  } catch {
    return { books: [], error: 'Could not read your saved library. Check browser storage permissions.' };
  }
}

const saved = loadBooks();

const initialState: BooksState = {
  books: saved.books,
  filter: 'all',
  category: 'all',
  search: '',
  sort: 'date',
  sortDirection: 'desc',
  persistenceError: saved.error,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook(state, action: PayloadAction<NewBook>) {
      state.books.unshift(new BookItem(action.payload).toJSON());
      state.persistenceError = null;
    },
    removeBook(state, action: PayloadAction<string>) {
      state.books = state.books.filter((book) => book.id !== action.payload);
      state.persistenceError = null;
    },
    setBookStatus(state, action: PayloadAction<{ id: string; status: ReadingStatus }>) {
      const book = state.books.find((item) => item.id === action.payload.id);
      if (book) book.status = action.payload.status;
      state.persistenceError = null;
    },
    setFilter(state, action: PayloadAction<BookFilter>) {
      state.filter = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setSort(state, action: PayloadAction<BookSort>) {
      if (state.sort === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort = action.payload;
        state.sortDirection = 'asc';
      }
    },
    setPersistenceError(state, action: PayloadAction<string | null>) {
      state.persistenceError = action.payload;
    },
    importBooks(state, action: PayloadAction<Book[]>) {
      state.books = action.payload;
      state.persistenceError = null;
    },
  },
});

export const {
  addBook,
  removeBook,
  setBookStatus,
  setFilter,
  setCategory,
  setSearch,
  setSort,
  setPersistenceError,
  importBooks,
} = booksSlice.actions;

export { STORAGE_KEY, isBook };
export default booksSlice.reducer;
