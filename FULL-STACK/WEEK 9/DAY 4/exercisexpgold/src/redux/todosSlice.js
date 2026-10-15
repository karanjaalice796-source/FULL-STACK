import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'

const englishTaskTitles = [
  'Organize your workspace',
  'Reply to important messages',
  'Pick up groceries',
  'Plan your week',
  'Finish the project draft',
  'Review your goals',
  'Prepare for the meeting',
  'Update your reading list',
]

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue, signal }) => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=8',
      { signal },
    )

    if (!response.ok) {
      return rejectWithValue(
        `Could not fetch tasks (HTTP ${response.status}). Please try again.`,
      )
    }

    const todos = await response.json()
    return todos.map((todo) => ({
      ...todo,
      title: englishTaskTitles[todo.id - 1] ?? todo.title,
    }))
  },
)

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.items.unshift(action.payload)
      },
      prepare(title) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
          },
        }
      },
    },
    removeTodo(state, action) {
      state.items = state.items.filter((todo) => todo.id !== action.payload)
    },
    toggleTodo(state, action) {
      const todo = state.items.find((item) => item.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload ??
          action.error.message ??
          'Something went wrong while fetching tasks.'
      })
  },
})

export const { addTodo, removeTodo, toggleTodo } = todosSlice.actions
export default todosSlice.reducer
