import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  books: [
    { id: 1, title: 'The Haunting of Hill House', author: 'Shirley Jackson', genre: 'Horror', year: 1959, shelf: 'A1', available: true, isbn: '9780143039983', coverId: 13147201, price: 1450 },
    { id: 2, title: 'Mexican Gothic', author: 'Silvia Moreno-Garcia', genre: 'Horror', year: 2020, shelf: 'A2', available: false, isbn: '9780525620785', coverId: 10239163, price: 1850 },
    { id: 3, title: 'The October Country', author: 'Ray Bradbury', genre: 'Horror', year: 1955, shelf: 'A1', available: true, isbn: '9780062242259', coverId: 14828135, price: 1650 },
    { id: 4, title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', year: 1937, shelf: 'B1', available: true, isbn: '9780547928227', coverId: 12003329, price: 1750 },
    { id: 5, title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', genre: 'Fantasy', year: 1968, shelf: 'B2', available: true, isbn: '9780547773742', coverId: 10509685, price: 1550 },
    { id: 6, title: 'Piranesi', author: 'Susanna Clarke', genre: 'Fantasy', year: 2020, shelf: 'B1', available: false, isbn: '9781635575637', coverId: 10226290, price: 2100 },
    { id: 7, title: 'Kindred', author: 'Octavia E. Butler', genre: 'Science Fiction', year: 1979, shelf: 'C1', available: true, isbn: '9780807083697', coverId: 588480, price: 1700 },
    { id: 8, title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', genre: 'Science Fiction', year: 1969, shelf: 'C2', available: true, isbn: '9780441478125', coverId: 284550, price: 1600 },
    { id: 9, title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', year: 1965, shelf: 'C1', available: false, isbn: '9780441172719', coverId: 15166231, price: 1950 },
    { id: 10, title: 'Station Eleven', author: 'Emily St. John Mandel', genre: 'Science Fiction', year: 2014, shelf: 'C2', available: true, isbn: '9780804172448', coverId: 7369961, price: 1800 },
  ],
}

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    toggleAvailability(state, action) {
      const book = state.books.find((item) => item.id === action.payload)

      if (book) {
        book.available = !book.available
      }
    },
  },
})

export const { toggleAvailability } = booksSlice.actions
export default booksSlice.reducer
