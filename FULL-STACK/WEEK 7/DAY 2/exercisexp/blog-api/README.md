# Blog API

PostgreSQL-backed Express API. The `posts` table is created automatically when the server starts.

Set the PostgreSQL connection using either `DATABASE_URL` or `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`. The default database is `postgres`.

```powershell
$env:PGUSER = "your-postgres-user"
$env:PGPASSWORD = "your-postgres-password"
npm start
```

The API listens on port 3000 by default; set `PORT` to change it. Posts require JSON with non-empty `title` and `content` fields. Routes: `GET /posts`, `GET /posts/:id`, `POST /posts`, `PUT /posts/:id`, and `DELETE /posts/:id`.
