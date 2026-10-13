function storageKey(userId) {
  return `little-list-demo-todos:${userId}`
}

export function loadTodos(userId) {
  const savedTodos = window.localStorage.getItem(storageKey(userId))
  if (!savedTodos) return []

  const todos = JSON.parse(savedTodos)
  if (
    !Array.isArray(todos)
    || !todos.every((todo) =>
      todo
      && typeof todo.id === 'string'
      && typeof todo.text === 'string'
      && typeof todo.completed === 'boolean',
    )
  ) {
    throw new Error('Saved tasks are invalid. Clear this site’s local data to continue.')
  }
  return todos
}

export function saveTodos(userId, todos) {
  window.localStorage.setItem(storageKey(userId), JSON.stringify(todos))
}
