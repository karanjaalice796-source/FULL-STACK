import { createContext, useContext, useEffect, useReducer } from 'react'

const STORAGE_KEY = 'daymark.tasks'
const TaskContext = createContext(null)

const starterTasks = [
  { id: 'task-1', text: 'Review the project brief', completed: true },
  { id: 'task-2', text: 'Sketch the first page layout', completed: false },
  { id: 'task-3', text: 'Send notes to the team', completed: false },
]

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(savedTasks) ? savedTasks : starterTasks
  } catch {
    return starterTasks
  }
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [action.task, ...state.tasks] }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task,
        ),
      }
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, text: action.text } : task,
        ),
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) }
    case 'FILTER_TASKS':
      return { ...state, filter: action.filter }
    case 'CLEAR_COMPLETED':
      return { ...state, tasks: state.tasks.filter((task) => !task.completed) }
    default:
      return state
  }
}

function initializeState() {
  return { tasks: loadTasks(), filter: 'all' }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, undefined, initializeState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks))
  }, [state.tasks])

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTasks must be used inside a TaskProvider.')
  }

  return context
}