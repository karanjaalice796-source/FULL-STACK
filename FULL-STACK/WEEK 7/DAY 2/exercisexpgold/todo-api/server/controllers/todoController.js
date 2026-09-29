const todoModel = require('../models/todoModel');

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function parseTodoId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw httpError(400, 'Todo id must be a positive integer');
  }
  return id;
}

function readTitle(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw httpError(400, 'title is required');
  }
  return value.trim();
}

function readUpdates(body) {
  const updates = {};
  if (Object.hasOwn(body, 'title')) updates.title = readTitle(body.title);
  if (Object.hasOwn(body, 'completed')) {
    if (typeof body.completed !== 'boolean') {
      throw httpError(400, 'completed must be a boolean');
    }
    updates.completed = body.completed;
  }
  if (Object.keys(updates).length === 0) {
    throw httpError(400, 'Provide a title or completed value to update');
  }
  return updates;
}

async function listTodos(req, res) {
  res.json(await todoModel.getAllTodos());
}

async function getTodo(req, res) {
  const todo = await todoModel.getTodoById(parseTodoId(req.params.id));
  if (!todo) throw httpError(404, 'Todo not found');
  res.json(todo);
}

async function createTodo(req, res) {
  const title = readTitle(req.body?.title);
  res.status(201).json(await todoModel.createTodo({ title }));
}

async function updateTodo(req, res) {
  const todo = await todoModel.updateTodo(
    parseTodoId(req.params.id),
    readUpdates(req.body || {}),
  );
  if (!todo) throw httpError(404, 'Todo not found');
  res.json(todo);
}

async function deleteTodo(req, res) {
  const deleted = await todoModel.deleteTodo(parseTodoId(req.params.id));
  if (!deleted) throw httpError(404, 'Todo not found');
  res.status(204).end();
}

module.exports = { listTodos, getTodo, createTodo, updateTodo, deleteTodo };
