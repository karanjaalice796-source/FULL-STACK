import { createSlice, nanoid } from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(text) {
        return {
          payload: {
            id: nanoid(),
            text,
            completed: false,
          },
        }
      },
    },
    toggleTodo(state, action) {
      const todo = state.find((item) => item.id === action.payload)
      if (todo) todo.completed = !todo.completed
    },
    removeTodo(state, action) {
      return state.filter((todo) => todo.id !== action.payload)
    },
    clearCompleted(state) {
      return state.filter((todo) => !todo.completed)
    },
  },
})

export const { addTodo, toggleTodo, removeTodo, clearCompleted } = todosSlice.actions
export default todosSlice.reducer
