export const AUTH_REQUEST = 'auth/request'
export const AUTH_SUCCESS = 'auth/success'
export const AUTH_RESTORED = 'auth/restored'
export const AUTH_FAILURE = 'auth/failure'
export const LOGOUT = 'auth/logout'
export const CLEAR_NOTICE = 'app/clearNotice'
export const SET_NOTICE = 'app/setNotice'
export const CLEAR_AUTH_ERROR = 'auth/clearError'
export const ADD_TODO = 'todos/add'
export const TOGGLE_TODO = 'todos/toggle'
export const REMOVE_TODO = 'todos/remove'

let nextTodoId = 1

export const authRequest = () => ({ type: AUTH_REQUEST })
export const authSuccess = (payload) => ({ type: AUTH_SUCCESS, payload })
export const authRestored = (payload) => ({ type: AUTH_RESTORED, payload })
export const authFailure = (message) => ({ type: AUTH_FAILURE, payload: message })
export const logoutUser = () => ({ type: LOGOUT })
export const clearNotice = () => ({ type: CLEAR_NOTICE })
export const clearAuthError = () => ({ type: CLEAR_AUTH_ERROR })

export const persistenceFailure = (message) => ({
  type: SET_NOTICE,
  payload: message,
})

export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: {
    id: `${Date.now()}-${nextTodoId++}`,
    text,
    completed: false,
  },
})

export const toggleTodo = (todoId) => ({
  type: TOGGLE_TODO,
  payload: todoId,
})

export const removeTodo = (todoId) => ({
  type: REMOVE_TODO,
  payload: todoId,
})
