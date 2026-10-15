import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [
    { id: "cat-work", name: "Work", color: "#6688b8" },
    { id: "cat-personal", name: "Personal", color: "#8c9ec0" },
    { id: "cat-wellbeing", name: "Wellbeing", color: "#6caaa6" },
    { id: "cat-learning", name: "Learning", color: "#9294c5" },
  ],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(category) {
        return {
          payload: {
            id: nanoid(),
            name: category.name.trim(),
            color: category.color || "#8c9b76",
          },
        };
      },
    },
    editCategory(state, action) {
      const category = state.items.find((item) => item.id === action.payload.id);
      if (category) {
        category.name = action.payload.name.trim();
        category.color = action.payload.color || category.color;
      }
    },
    deleteCategory(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addCategory, editCategory, deleteCategory } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;