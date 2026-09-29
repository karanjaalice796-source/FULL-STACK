const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const databaseFile = path.join(os.tmpdir(), `quickfire-${process.pid}.sqlite3`);
process.env.DATABASE_FILE = databaseFile;

const db = require('../server/config/database');
const questionModel = require('../server/models/questionModel');
const { app } = require('../server');

let server;
let baseUrl;

before(async () => {
  await questionModel.initializeDatabase();
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await db.destroy();
  await fs.rm(databaseFile, { force: true });
});

test('questions are returned with options and without the correct answer', async () => {
  const response = await fetch(`${baseUrl}/api/questions`);
  const { questions } = await response.json();

  assert.equal(response.status, 200);
  assert.equal(questions.length, 5);
  assert.equal(questions[0].options.length, 4);
  assert.equal('correctAnswer' in questions[0], false);
});

test('answer endpoint reports correct and incorrect choices', async () => {
  const { questions } = await (await fetch(`${baseUrl}/api/questions`)).json();
  const question = questions[0];
  const correctOption = question.options.find((option) => option.text === 'Mars');
  const wrongOption = question.options.find((option) => option.text !== 'Mars');

  const correctResponse = await fetch(`${baseUrl}/api/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId: question.id, optionId: correctOption.id }),
  });
  assert.deepEqual(await correctResponse.json(), { isCorrect: true, correctAnswer: 'Mars' });

  const wrongResponse = await fetch(`${baseUrl}/api/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId: question.id, optionId: wrongOption.id }),
  });
  assert.deepEqual(await wrongResponse.json(), { isCorrect: false, correctAnswer: 'Mars' });
});

test('answer endpoint rejects unknown questions and unrelated options', async () => {
  const { questions } = await (await fetch(`${baseUrl}/api/questions`)).json();
  const optionFromAnotherQuestion = questions[1].options[0];

  const unknownResponse = await fetch(`${baseUrl}/api/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId: 9999, optionId: optionFromAnotherQuestion.id }),
  });
  assert.equal(unknownResponse.status, 404);

  const invalidOptionResponse = await fetch(`${baseUrl}/api/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId: questions[0].id, optionId: optionFromAnotherQuestion.id }),
  });
  assert.equal(invalidOptionResponse.status, 400);
});