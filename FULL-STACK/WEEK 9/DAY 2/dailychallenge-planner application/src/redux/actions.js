export const ADD_TASK = 'planner/addTask'
export const EDIT_TASK = 'planner/editTask'
export const DELETE_TASK = 'planner/deleteTask'

let nextTaskId = 1

export const addTask = (day, task) => ({
  type: ADD_TASK,
  payload: {
    day,
    task: {
      ...task,
      id: `${Date.now()}-${nextTaskId++}`,
    },
  },
})

export const editTask = (day, taskId, updates) => ({
  type: EDIT_TASK,
  payload: { day, taskId, updates },
})

export const deleteTask = (day, taskId) => ({
  type: DELETE_TASK,
  payload: { day, taskId },
})
