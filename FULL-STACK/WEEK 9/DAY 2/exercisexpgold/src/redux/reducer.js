import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO } from './actions.js'

export const initialState = {
  categories: [
    { id: 'personal', name: 'Personal', color: 'lavender', todos: [] },
    { id: 'work', name: 'Work', color: 'peach', todos: [] },
    { id: 'study', name: 'Study', color: 'blue', todos: [] },
    { id: 'home', name: 'Home', color: 'sage', todos: [] },
  ],
}

export function todosReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO: {
      const { categoryId, todo } = action.payload
      if (!state.categories.some((category) => category.id === categoryId)) {
        return state
      }

      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === categoryId
            ? { ...category, todos: [...category.todos, todo] }
            : category,
        ),
      }
    }
    case TOGGLE_TODO: {
      const { categoryId, todoId } = action.payload
      const category = state.categories.find((item) => item.id === categoryId)
      if (!category?.todos.some((todo) => todo.id === todoId)) return state

      return {
        ...state,
        categories: state.categories.map((item) =>
          item.id === categoryId
            ? {
                ...item,
                todos: item.todos.map((todo) =>
                  todo.id === todoId
                    ? { ...todo, completed: !todo.completed }
                    : todo,
                ),
              }
            : item,
        ),
      }
    }
    case REMOVE_TODO: {
      const { categoryId, todoId } = action.payload
      const category = state.categories.find((item) => item.id === categoryId)
      if (!category?.todos.some((todo) => todo.id === todoId)) return state

      return {
        ...state,
        categories: state.categories.map((item) =>
          item.id === categoryId
            ? {
                ...item,
                todos: item.todos.filter((todo) => todo.id !== todoId),
              }
            : item,
        ),
      }
    }
    default:
      return state
  }
}
