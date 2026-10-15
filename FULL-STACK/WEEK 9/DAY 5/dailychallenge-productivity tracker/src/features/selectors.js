import { createSelector } from "@reduxjs/toolkit";

const selectTaskItems = (state) => state.tasks.items;
const selectCategoryItems = (state) => state.categories.items;

export const selectTasksByCategory = createSelector(
  [selectTaskItems, (_state, categoryId) => categoryId],
  (tasks, categoryId) =>
    categoryId === "all"
      ? tasks
      : tasks.filter((task) => task.categoryId === categoryId),
);

export const selectCompletedTasks = createSelector(
  [selectTaskItems],
  (tasks) => tasks.filter((task) => task.progress === 100).length,
);

export const selectCategoryById = createSelector(
  [selectCategoryItems, (_state, categoryId) => categoryId],
  (categories, categoryId) =>
    categories.find((category) => category.id === categoryId),
);