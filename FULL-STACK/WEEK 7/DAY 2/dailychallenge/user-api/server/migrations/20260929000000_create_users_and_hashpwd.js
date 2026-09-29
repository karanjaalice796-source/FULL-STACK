exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('username').notNullable().unique();
    table.string('first_name');
    table.string('last_name');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('hashpwd', (table) => {
    table.increments('id').primary();
    table
      .string('username')
      .notNullable()
      .unique()
      .references('username')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('password').notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('hashpwd');
  await knex.schema.dropTableIfExists('users');
};
