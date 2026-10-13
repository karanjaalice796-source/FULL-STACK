import {
  ADD_TODO,
  AUTH_FAILURE,
  AUTH_REQUEST,
  AUTH_RESTORED,
  AUTH_SUCCESS,
  CLEAR_AUTH_ERROR,
  CLEAR_NOTICE,
  LOGOUT,
  REMOVE_TODO,
  SET_NOTICE,
  TOGGLE_TODO,
} from './actions.js'

export const initialState = {
  auth: {
    status: 'checking',
    user: null,
    token: null,
    error: null,
  },
  todos: [],
  notice: null,
}

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_REQUEST:
      return {
        ...state,
        auth: { ...state.auth, status: 'loading', error: null },
      }
    case AUTH_SUCCESS:
      return {
        ...state,
        auth: {
          status: 'authenticated',
          user: action.payload.user,
          token: action.payload.token,
          error: null,
        },
        todos: action.payload.todos,
        notice: null,
      }
    case AUTH_RESTORED:
      return action.payload
        ? {
            ...state,
            auth: {
              status: 'authenticated',
              user: action.payload.user,
              token: action.payload.token,
              error: null,
            },
            todos: action.payload.todos,
          }
        : {
            ...state,
            auth: {
              status: 'anonymous',
              user: null,
              token: null,
              error: null,
            },
            todos: [],
          }
    case AUTH_FAILURE:
      return {
        ...state,
        auth: {
          ...state.auth,
          status: state.auth.user ? 'authenticated' : 'anonymous',
          error: action.payload,
        },
      }
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        auth: { ...state.auth, error: null },
      }
    case LOGOUT:
      return {
        ...state,
        auth: {
          status: 'anonymous',
          user: null,
          token: null,
          error: null,
        },
        todos: [],
        notice: null,
      }
    case ADD_TODO:
      if (state.auth.status !== 'authenticated') return state
      return { ...state, todos: [...state.todos, action.payload], notice: null }
    case TOGGLE_TODO:
      if (state.auth.status !== 'authenticated') return state
      if (!state.todos.some((todo) => todo.id === action.payload)) return state
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
        notice: null,
      }
    case REMOVE_TODO:
      if (state.auth.status !== 'authenticated') return state
      if (!state.todos.some((todo) => todo.id === action.payload)) return state
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        notice: null,
      }
    case CLEAR_NOTICE:
      return { ...state, notice: null }
    case SET_NOTICE:
      return { ...state, notice: action.payload }
    default:
      return state
  }
}
