import { createSelector } from "@reduxjs/toolkit";

export const selectProducts = (state) => state.cart.products;
const selectCartState = (state) => state.cart.items;

export const selectCartItems = createSelector(
  [selectProducts, selectCartState],
  (products, items) =>
    items
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean),
);

export const calculateTotalPrice = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0),
);

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((count, item) => count + item.quantity, 0),
);
