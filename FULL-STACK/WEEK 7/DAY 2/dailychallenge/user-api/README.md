# User Management API

Express, Knex, PostgreSQL, and bcrypt API. It stores public profile data in `users` and bcrypt hashes in `hashpwd`. Registration writes to both tables in one transaction; user responses never include password hashes.

## Configure and run

Set `DATABASE_URL` or `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`. The default database is `postgres`.

```powershell
$env:PGUSER = "your-postgres-user"
$env:PGPASSWORD = "your-postgres-password"
npm run migrate
npm start
```

The API listens on port 3001 by default; set `PORT` to change it. The migration creates both tables. Registration requires `email`, `username`, and a password of at least 8 characters. `first_name` and `last_name` are optional.

## Routes

- `POST /register` with `{ "email", "username", "password", "first_name", "last_name" }`
- `POST /login` with `{ "username", "password" }`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id` with any of `email`, `username`, `first_name`, `last_name`, or `password`
