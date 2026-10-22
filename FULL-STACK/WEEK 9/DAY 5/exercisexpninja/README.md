# Daylight

A gentle, responsive todo app for the Week 9 Day 5 Redux performance exercise.
Manage a daily list, filter by completion, and get an AI-style next-step
suggestion based on your chosen intention.

The helper uses a small, transparent local matching rule; it does not call an
external AI service.

## Run locally

```sh
npm install
npm run dev
```

## Redux exercise

- `src/features/todos/todoSlice.js` owns the todo list and visibility filter.
- `src/features/selectors.js` provides memoized visible-task and count selectors.
- `src/App.jsx` reads derived state with `useSelector` and uses `useCallback` for
  toggling, deleting, filtering, and adding tasks.
