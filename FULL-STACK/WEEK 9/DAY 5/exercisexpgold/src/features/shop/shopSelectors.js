import { createSelector } from '@reduxjs/toolkit'

export const selectProducts = (state) => state.shop.products
const selectCart = (state) => state.shop.cart

export const selectCartItems = createSelector(
  [selectProducts, selectCart],
  (products, cart) => cart
    .map((item) => {
      const product = products.find((availableProduct) => availableProduct.id === item.productId)
      return product ? { ...product, quantity: item.quantity } : null
    })
    .filter(Boolean),
)

export const calculateTotalPrice = createSelector(
  [selectCartItems],
  (cartItems) => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
)
