const db = require('../config/database');

const seedQuestions = [
  {
    question: 'Which planet is known as the Red Planet?',
    correctAnswer: 'Mars',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
  },
  {
    question: 'What is the largest ocean on Earth?',
    correctAnswer: 'Pacific Ocean',
    options: ['Indian Ocean', 'Arctic Ocean', 'Pacific Ocean', 'Atlantic Ocean'],
  },
  {
    question: 'Which language runs natively in a web browser?',
    correctAnswer: 'JavaScript',
    options: ['Java', 'C#', 'JavaScript', 'Python'],
  },
  {
    question: 'How many sides does a hexagon have?',
    correctAnswer: 'Six',
    options: ['Five', 'Six', 'Seven', 'Eight'],
  },
  {
    question: 'Which gas do plants absorb from the atmosphere?',
    correctAnswer: 'Carbon dioxide',
    options: ['Oxygen', 'Nitrogen', 'Hydrogen', 'Carbon dioxide'],
  },
];

async function initializeDatabase() {
  if (!(await db.schema.hasTable('questions'))) {
    await db.schema.createTable('questions', (table) => {
      table.increments('id').primary();
      table.string('question').notNullable();
      table.string('correctAnswer').notNullable();
    });
  }

  if (!(await db.schema.hasTable('options'))) {
    await db.schema.createTable('options', (table) => {
      table.increments('id').primary();
      table.string('option').notNullable();
    });
  }

  if (!(await db.schema.hasTable('questions_options'))) {
    await db.schema.createTable('questions_options', (table) => {
      table.integer('question_id').unsigned().notNullable()
        .references('id').inTable('questions').onDelete('CASCADE');
      table.integer('option_id').unsigned().notNullable()
        .references('id').inTable('options').onDelete('CASCADE');
      table.primary(['question_id', 'option_id']);
    });
  }

  const [{ count }] = await db('questions').count({ count: '*' });
  if (Number(count) > 0) return;

  await db.transaction(async (transaction) => {
    for (const item of seedQuestions) {
      const [questionId] = await transaction('questions').insert({
        question: item.question,
        correctAnswer: item.correctAnswer,
      });

      for (const option of item.options) {
        const [optionId] = await transaction('options').insert({ option });
        await transaction('questions_options').insert({
          question_id: questionId,
          option_id: optionId,
        });
      }
    }
  });
}

async function getQuestions() {
  const rows = await db('questions')
    .join('questions_options', 'questions.id', 'questions_options.question_id')
    .join('options', 'questions_options.option_id', 'options.id')
    .select('questions.id', 'questions.question', 'options.id as optionId', 'options.option')
    .orderBy(['questions.id', 'options.id']);

  const questionMap = new Map();
  for (const row of rows) {
    if (!questionMap.has(row.id)) {
      questionMap.set(row.id, { id: row.id, question: row.question, options: [] });
    }
    questionMap.get(row.id).options.push({ id: row.optionId, text: row.option });
  }

  return Array.from(questionMap.values());
}

async function checkAnswer(questionId, optionId) {
  const question = await db('questions').where({ id: questionId }).first();
  if (!question) return null;

  const selectedOption = await db('questions_options')
    .join('options', 'questions_options.option_id', 'options.id')
    .where({ question_id: questionId, option_id: optionId })
    .select('options.option')
    .first();

  if (!selectedOption) return { invalidOption: true };

  return {
    isCorrect: selectedOption.option === question.correctAnswer,
    correctAnswer: question.correctAnswer,
  };
}

module.exports = { checkAnswer, getQuestions, initializeDatabase };