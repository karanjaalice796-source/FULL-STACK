# Kindred Market

A small, responsive shopping app for the Week 9 Day 5 Redux performance exercise.
It includes a Redux Toolkit cart, memoized selectors, product search and category
filters, and a local AI-style shopping helper that suggests items based on a
chosen shopping goal and the contents of your bag.

The recommendation helper runs in the browser with a small transparent matching
rule; it does not call an external AI service.

## Run locally

```sh
npm install
npm run dev
```

## Redux exercise

- `src/features/cart/cartSlice.js` owns the available products and cart state.
- `src/features/selectors.js` exports memoized product, cart-item, cart-count,
  and total-price selectors.
- `src/App.jsx` reads derived values with `useSelector` and uses `useCallback`
  for cart actions.
