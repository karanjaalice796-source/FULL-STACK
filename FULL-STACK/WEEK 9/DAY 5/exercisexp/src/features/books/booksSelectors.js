import { createSelector } from '@reduxjs/toolkit'

export const selectBooks = (state) => state.books.books

const createGenreSelector = (genre) => createSelector(
  [selectBooks],
  (books) => books.filter((book) => book.genre === genre),
)

export const selectHorrorBooks = createGenreSelector('Horror')
export const selectFantasyBooks = createGenreSelector('Fantasy')
export const selectScienceFictionBooks = createGenreSelector('Science Fiction')

export const selectAvailableBooks = createSelector(
  [selectBooks],
  (books) => books.filter((book) => book.available),
)
