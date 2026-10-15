# Daymark

A gentle daily productivity tracker built with React, Redux Toolkit, and Vite. Daymark keeps the focus on your own plans: organize tasks into categories, choose a time and priority, and mark progress at your own pace.

## Getting started

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or preview it with `npm run preview`.

## Redux notes

Tasks and categories live in separate Redux Toolkit slices. The memoized selectors in `src/features/selectors.js` derive tasks by category, completed task counts, and category details. Components subscribe to the narrow state they need, and task row callbacks are memoized to avoid unnecessary updates.