export const ADD_TODO = 'todos/add'
export const TOGGLE_TODO = 'todos/toggle'
export const REMOVE_TODO = 'todos/remove'
export const CLEAR_COMPLETED = 'todos/clearCompleted'

let nextTodoId = 1

export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: {
    id: `${Date.now()}-${nextTodoId++}`,
    text,
  },
})

export const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: id,
})

export const removeTodo = (id) => ({
  type: REMOVE_TODO,
  payload: id,
})

export const clearCompleted = () => ({
  type: CLEAR_COMPLETED,
})
