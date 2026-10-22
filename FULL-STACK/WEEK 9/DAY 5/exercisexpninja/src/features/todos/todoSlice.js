import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [
    {
      id: "morning-pages",
      title: "Take ten minutes for morning pages",
      category: "Personal",
      priority: "Gentle",
      completed: true,
    },
    {
      id: "project-outline",
      title: "Write the first draft of the project outline",
      category: "Work",
      priority: "Focus",
      completed: false,
    },
    {
      id: "fresh-air",
      title: "Step outside for a little fresh air",
      category: "Personal",
      priority: "Gentle",
      completed: false,
    },
    {
      id: "groceries",
      title: "Pick up a few things for dinner",
      category: "Home",
      priority: "Whenever",
      completed: false,
    },
    {
      id: "reply-sam",
      title: "Send Sam the photos from the weekend",
      category: "Personal",
      priority: "Whenever",
      completed: true,
    },
  ],
  visibilityFilter: "All",
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo(state, action) {
      const title = action.payload.title.trim();
      if (!title) return;
      state.todos.unshift({
        id: action.payload.id,
        title,
        category: action.payload.category,
        priority: action.payload.priority,
        completed: false,
      });
    },
    toggleTodo(state, action) {
      const todo = state.todos.find((item) => item.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((item) => item.id !== action.payload);
    },
    setVisibilityFilter(state, action) {
      if (["All", "Active", "Completed"].includes(action.payload)) {
        state.visibilityFilter = action.payload;
      }
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, setVisibilityFilter } =
  todoSlice.actions;
export default todoSlice.reducer;
