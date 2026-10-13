import { ADD_TASK, DELETE_TASK, EDIT_TASK } from './actions.js'

export const initialState = {
  tasksByDay: {},
}

export function plannerReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK: {
      const { day, task } = action.payload
      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [day]: [...(state.tasksByDay[day] ?? []), task],
        },
      }
    }
    case EDIT_TASK: {
      const { day, taskId, updates } = action.payload
      const dayTasks = state.tasksByDay[day] ?? []
      if (!dayTasks.some((task) => task.id === taskId)) return state

      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [day]: dayTasks.map((task) =>
            task.id === taskId ? { ...task, ...updates, id: task.id } : task,
          ),
        },
      }
    }
    case DELETE_TASK: {
      const { day, taskId } = action.payload
      const dayTasks = state.tasksByDay[day] ?? []
      if (!dayTasks.some((task) => task.id === taskId)) return state

      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [day]: dayTasks.filter((task) => task.id !== taskId),
        },
      }
    }
    default:
      return state
  }
}
