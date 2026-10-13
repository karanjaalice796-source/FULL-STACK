import { createSlice, nanoid } from '@reduxjs/toolkit'

const plannerSlice = createSlice({
  name: 'planner',
  initialState: {
    tasksByDay: {},
  },
  reducers: {
    addTask: {
      reducer(state, action) {
        const { day, task } = action.payload
        state.tasksByDay[day] ??= []
        state.tasksByDay[day].push(task)
      },
      prepare({ day, task }) {
        return {
          payload: {
            day,
            task: {
              ...task,
              id: nanoid(),
            },
          },
        }
      },
    },
    editTask(state, action) {
      const { day, taskId, updates } = action.payload
      const task = state.tasksByDay[day]?.find((item) => item.id === taskId)
      if (task) Object.assign(task, updates)
    },
    deleteTask(state, action) {
      const { day, taskId } = action.payload
      const tasks = state.tasksByDay[day]
      if (tasks) {
        state.tasksByDay[day] = tasks.filter((task) => task.id !== taskId)
      }
    },
  },
})

export const { addTask, editTask, deleteTask } = plannerSlice.actions
export default plannerSlice.reducer
