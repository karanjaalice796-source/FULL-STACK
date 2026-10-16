import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "task-1",
      title: "Send the first draft to Olivia",
      categoryId: "cat-work",
      time: "09:30",
      progress: 0,
      priority: "High",
    },
    {
      id: "task-2",
      title: "Tidy up the project notes",
      categoryId: "cat-work",
      time: "11:00",
      progress: 0,
      priority: "Normal",
    },
    {
      id: "task-3",
      title: "Pick up something nice for dinner",
      categoryId: "cat-personal",
      time: "17:30",
      progress: 0,
      priority: "Normal",
    },
    {
      id: "task-4",
      title: "A walk without my phone",
      categoryId: "cat-wellbeing",
      time: "18:15",
      progress: 100,
      priority: "Low",
    },
    {
      id: "task-5",
      title: "Read a few pages before bed",
      categoryId: "cat-learning",
      time: "20:30",
      progress: 0,
      priority: "Low",
    },
  ],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(task) {
        return {
          payload: {
            id: nanoid(),
            title: task.title.trim(),
            categoryId: task.categoryId,
            time: task.time || "",
            progress: task.progress ?? 0,
            priority: task.priority || "Normal",
          },
        };
      },
    },
    editTask(state, action) {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (task) {
        task.title = action.payload.title.trim();
        task.categoryId = action.payload.categoryId;
        task.time = action.payload.time || "";
        task.priority = action.payload.priority || task.priority;
      }
    },
    deleteTask(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateTaskProgress(state, action) {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (task) {
        task.progress = Math.max(0, Math.min(100, action.payload.progress));
      }
    },
  },
});

export const { addTask, editTask, deleteTask, updateTaskProgress } =
  tasksSlice.actions;
export default tasksSlice.reducer;