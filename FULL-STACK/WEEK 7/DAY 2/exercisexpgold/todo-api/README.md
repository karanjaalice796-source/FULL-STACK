# Todo API

Express and Knex API backed by PostgreSQL. The migration creates a `tasks` table with `id`, `title`, and `completed` fields.

Configure `DATABASE_URL` or `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`. The default database is `postgres`.

```powershell
$env:PGUSER = "your-postgres-user"
$env:PGPASSWORD = "your-postgres-password"
npm run migrate
npm start
```

The API listens on port 3002 by default; set `PORT` to change it.

- `POST /api/todos` with `{ "title": "Buy groceries" }`
- `GET /api/todos`
- `GET /api/todos/:id`
- `PUT /api/todos/:id` with `{ "title": "Buy groceries", "completed": true }` or either field alone
- `DELETE /api/todos/:id`
