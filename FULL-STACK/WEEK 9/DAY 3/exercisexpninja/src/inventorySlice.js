import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [
    { id: 'sku-1042', name: 'Arc desk lamp', category: 'Lighting', quantity: 18, price: 48 },
    { id: 'sku-1038', name: 'Grid notebook set', category: 'Stationery', quantity: 7, price: 16 },
    { id: 'sku-1021', name: 'Modular tray', category: 'Storage', quantity: 32, price: 24 },
    { id: 'sku-1017', name: 'Brass pen cup', category: 'Accessories', quantity: 4, price: 29 },
  ],
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addProduct(state, action) {
      state.products.unshift(action.payload)
    },
    updateQuantity(state, action) {
      const product = state.products.find((item) => item.id === action.payload.id)
      if (product) product.quantity = Math.max(0, Number(action.payload.quantity) || 0)
    },
    removeProduct(state, action) {
      state.products = state.products.filter((product) => product.id !== action.payload)
    },
  },
})

export const { addProduct, updateQuantity, removeProduct } = inventorySlice.actions
export default inventorySlice.reducer