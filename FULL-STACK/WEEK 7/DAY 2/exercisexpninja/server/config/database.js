const path = require('path');
const knex = require('knex');

const databaseFile = process.env.DATABASE_FILE || path.join(__dirname, '../../quiz.sqlite3');

const db = knex({
  client: 'sqlite3',
  connection: { filename: databaseFile },
  useNullAsDefault: true,
});

module.exports = db;