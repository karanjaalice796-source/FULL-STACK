import { configureStore } from '@reduxjs/toolkit'
import shopReducer from '../features/shop/shopSlice.js'

export const store = configureStore({
  reducer: {
    shop: shopReducer,
  },
})
