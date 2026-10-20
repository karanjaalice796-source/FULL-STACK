import { useMemo } from 'react';
import {
  addBook,
  removeBook,
  setBookStatus,
  setCategory,
  setFilter,
  setSearch,
  setSort,
  type BookFilter,
  type BookSort,
} from '../app/booksSlice';
import { useAppDispatch, useAppSelector } from '../app/store';
import type { Book, NewBook, ReadingStatus } from '../model/Book';

export function useBooks() {
  const dispatch = useAppDispatch();
  const { books, filter, category, search, sort, sortDirection } = useAppSelector(
    (state) => state.books
  );

  const categories = useMemo(
    () => Array.from(new Set(books.map((book) => book.category))).sort((a, b) => a.localeCompare(b)),
    [books]
  );

  const visibleBooks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return books
      .filter((book) => filter === 'all' || book.status === filter)
      .filter((book) => category === 'all' || book.category === category)
      .filter(
        (book) =>
          !query ||
          book.title.toLocaleLowerCase().includes(query) ||
          book.author.toLocaleLowerCase().includes(query)
      )
      .sort((a, b) => {
        const comparison =
          sort === 'date'
            ? a.addedAt.localeCompare(b.addedAt)
            : a[sort].localeCompare(b[sort], undefined, { sensitivity: 'base' });
        return comparison * (sortDirection === 'asc' ? 1 : -1);
      });
  }, [books, filter, category, search, sort, sortDirection]);

  const stats = useMemo(
    () => ({
      total: books.length,
      read: books.filter((book) => book.status === 'read').length,
      reading: books.filter((book) => book.status === 'reading').length,
      toRead: books.filter((book) => book.status === 'to-read').length,
    }),
    [books]
  );

  return {
    books,
    categories,
    visibleBooks,
    stats,
    filter,
    category,
    search,
    sort,
    sortDirection,
    add: (book: NewBook) => dispatch(addBook(book)),
    remove: (id: string) => dispatch(removeBook(id)),
    updateStatus: (id: string, status: ReadingStatus) =>
      dispatch(setBookStatus({ id, status })),
    updateFilter: (value: BookFilter) => dispatch(setFilter(value)),
    updateCategory: (value: string) => dispatch(setCategory(value)),
    updateSearch: (value: string) => dispatch(setSearch(value)),
    updateSort: (value: BookSort) => dispatch(setSort(value)),
  };
}

export type { Book };
