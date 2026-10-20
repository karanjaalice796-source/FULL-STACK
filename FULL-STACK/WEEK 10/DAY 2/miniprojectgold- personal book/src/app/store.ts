import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import booksReducer, { setPersistenceError, STORAGE_KEY } from './booksSlice';

export const store = configureStore({
  reducer: { books: booksReducer },
});

let lastSavedBooks = JSON.stringify(store.getState().books.books);
let handlingPersistence = false;

store.subscribe(() => {
  if (handlingPersistence) return;

  const books = store.getState().books.books;
  const serializedBooks = JSON.stringify(books);
  if (serializedBooks === lastSavedBooks) return;

  handlingPersistence = true;
  try {
    localStorage.setItem(STORAGE_KEY, serializedBooks);
    lastSavedBooks = serializedBooks;
    if (store.getState().books.persistenceError) {
      store.dispatch(setPersistenceError(null));
    }
  } catch {
    store.dispatch(
      setPersistenceError('Your change is visible but could not be saved to browser storage.')
    );
  } finally {
    handlingPersistence = false;
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
