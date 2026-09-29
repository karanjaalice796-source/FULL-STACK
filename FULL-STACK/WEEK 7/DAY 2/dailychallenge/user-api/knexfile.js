const connection = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
};

if (process.env.DATABASE_URL) connection.connectionString = process.env.DATABASE_URL;

module.exports = {
  development: {
    client: 'pg',
    connection,
    migrations: {
      directory: './server/migrations',
    },
  },
};
