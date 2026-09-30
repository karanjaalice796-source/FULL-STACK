const express = require('express');
const { randomUUID } = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();
const tasksFile = path.join(__dirname, '..', 'data', 'tasks.json');

async function readTasks() {
  const contents = await fs.readFile(tasksFile, 'utf8');
  const tasks = JSON.parse(contents);
  if (!Array.isArray(tasks)) {
    throw new Error('Task data must be a JSON array');
  }
  return tasks;
}

async function writeTasks(tasks) {
  await fs.writeFile(tasksFile, `${JSON.stringify(tasks, null, 2)}\n`, 'utf8');
}

function validateTask(body, { requireTitle = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }

  const allowedFields = ['title', 'description', 'completed'];
  const unknownField = Object.keys(body).find((field) => !allowedFields.includes(field));
  if (unknownField) {
    return `Unknown task field: ${unknownField}`;
  }

  if (requireTitle && (typeof body.title !== 'string' || !body.title.trim())) {
    return 'Title is required and must be a non-empty string';
  }
  if ('title' in body && (typeof body.title !== 'string' || !body.title.trim())) {
    return 'Title must be a non-empty string';
  }
  if ('description' in body && typeof body.description !== 'string') {
    return 'Description must be a string';
  }
  if ('completed' in body && typeof body.completed !== 'boolean') {
    return 'Completed must be a boolean';
  }
  if (!requireTitle && Object.keys(body).length === 0) {
    return 'Provide at least one task field to update';
  }

  return null;
}

function sendValidationError(res, message) {
  if (message) {
    res.status(400).json({ error: message });
    return true;
  }
  return false;
}

router.get('/', async (req, res) => {
  res.json(await readTasks());
});

router.get('/:id', async (req, res) => {
  const tasks = await readTasks();
  const task = tasks.find((item) => item.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

router.post('/', async (req, res) => {
  if (sendValidationError(res, validateTask(req.body, { requireTitle: true }))) {
    return;
  }

  const tasks = await readTasks();
  const task = {
    id: randomUUID(),
    title: req.body.title.trim(),
    description: req.body.description?.trim() || '',
    completed: req.body.completed ?? false,
  };
  tasks.push(task);
  await writeTasks(tasks);
  res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
  if (sendValidationError(res, validateTask(req.body))) {
    return;
  }

  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((item) => item.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updates = { ...req.body };
  if (typeof updates.title === 'string') updates.title = updates.title.trim();
  if (typeof updates.description === 'string') updates.description = updates.description.trim();
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  await writeTasks(tasks);
  res.json(tasks[taskIndex]);
});

router.delete('/:id', async (req, res) => {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((item) => item.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  await writeTasks(tasks);
  res.status(204).end();
});

module.exports = router;
