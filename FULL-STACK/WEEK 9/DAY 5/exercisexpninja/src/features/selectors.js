import { createSelector } from "@reduxjs/toolkit";

export const selectAllTodos = (state) => state.todos.todos;
export const selectVisibilityFilter = (state) => state.todos.visibilityFilter;

export const selectTodos = createSelector(
  [selectAllTodos, selectVisibilityFilter],
  (todos, visibilityFilter) => {
    if (visibilityFilter === "Active") {
      return todos.filter((todo) => !todo.completed);
    }
    if (visibilityFilter === "Completed") {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  },
);

export const selectFilteredTodosCount = createSelector(
  [selectTodos],
  (todos) => todos.length,
);

export const selectActiveTodosCount = createSelector(
  [selectAllTodos],
  (todos) => todos.filter((todo) => !todo.completed).length,
);

export const selectCompletedTodosCount = createSelector(
  [selectAllTodos],
  (todos) => todos.filter((todo) => todo.completed).length,
);
