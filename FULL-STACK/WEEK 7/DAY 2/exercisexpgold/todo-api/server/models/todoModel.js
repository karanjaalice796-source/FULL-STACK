const db = require('../config/database');

const todoColumns = ['id', 'title', 'completed', 'created_at', 'updated_at'];

async function getAllTodos() {
  return db('tasks').select(todoColumns).orderBy('id');
}

async function getTodoById(id) {
  return (await db('tasks').select(todoColumns).where({ id }).first()) || null;
}

async function createTodo({ title }) {
  const [todo] = await db('tasks')
    .insert({ title })
    .returning(todoColumns);
  return todo;
}

async function updateTodo(id, changes) {
  const [todo] = await db('tasks')
    .where({ id })
    .update({ ...changes, updated_at: db.fn.now() })
    .returning(todoColumns);
  return todo || null;
}

async function deleteTodo(id) {
  const deletedCount = await db('tasks').where({ id }).delete();
  return deletedCount > 0;
}

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo };
