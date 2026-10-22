import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [
    { id: 1, name: 'Everyday stoneware mug', category: 'Kitchen', price: 850, note: 'Made for the first cup and the last one.', color: '#bdc5b4', symbol: '01' },
    { id: 2, name: 'Linen market tote', category: 'Bags', price: 1200, note: 'Room for a loaf, a book, and a little more.', color: '#d8c2a0', symbol: '02' },
    { id: 3, name: 'Cedarwood candle', category: 'Home', price: 1450, note: 'Warm wood, soft light, no fuss.', color: '#d7a78b', symbol: '03' },
    { id: 4, name: 'Hand-thrown breakfast bowl', category: 'Kitchen', price: 1100, note: 'A quiet favourite for everyday meals.', color: '#c0c9cd', symbol: '04' },
    { id: 5, name: 'Pocket notebook set', category: 'Paper', price: 650, note: 'Three small places to catch a good thought.', color: '#d4c8d3', symbol: '05' },
    { id: 6, name: 'Soft cotton tea towel', category: 'Home', price: 720, note: 'A useful thing that looks good doing its job.', color: '#d4c9a5', symbol: '06' },
  ],
  cart: [],
}

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = state.products.find((item) => item.id === action.payload)
      if (!product) return

      const cartItem = state.cart.find((item) => item.productId === action.payload)
      if (cartItem) {
        cartItem.quantity += 1
      } else {
        state.cart.push({ productId: action.payload, quantity: 1 })
      }
    },
    removeFromCart(state, action) {
      state.cart = state.cart.filter((item) => item.productId !== action.payload)
    },
    changeQuantity(state, action) {
      const cartItem = state.cart.find((item) => item.productId === action.payload.productId)
      if (!cartItem) return

      cartItem.quantity += action.payload.change
      if (cartItem.quantity <= 0) {
        state.cart = state.cart.filter((item) => item.productId !== action.payload.productId)
      }
    },
  },
})

export const { addToCart, removeFromCart, changeQuantity } = shopSlice.actions
export default shopSlice.reducer
