# Inkwell

A collaborative storytelling app. Log in, start a story, add co-writers, leave notes in the margin, and roll back to any earlier version.

**Stack:** PostgreSQL, Express, React, Node (TypeScript throughout), Redux Toolkit, JWT.

```text
inkwell/
  types/        shared TypeScript types
  backend/      Express API: routes, controllers, models, db, helpers, middleware
  frontend/     Vite + React: app, pages, Redux features
```

## Run it locally

You need Node 18+ and a local PostgreSQL database.

1. Create a database: `createdb inkwell`
2. In `backend`, copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, and `REFRESH_SECRET`.
3. In `frontend`, copy `.env.example` to `.env` if you need to change the API URL.
4. From this folder, run `npm run install:all`.
5. Start the API with `npm run dev:backend` and the client with `npm run dev:frontend`.

The API runs at `http://localhost:4000`; Vite runs at `http://localhost:5173`. Database tables are created automatically when the API starts.

The API health check is available at `GET /api/health`. The frontend opens in a dark notebook theme; use the sun/moon control to switch themes. Login and signup are available in the interface; story routes and contributor operations require authentication.

## Scripts

| Where | Script | What it does |
| --- | --- | --- |
| root | `npm run install:all` | Install backend and frontend dependencies |
| root | `npm run dev:backend` | Start the API with auto-reload |
| root | `npm run dev:frontend` | Start the Vite client |
| root | `npm run build` | Build the backend and frontend |
| backend | `npm start` | Run the compiled server |
| frontend | `npm run preview` | Preview the production build |

## Environment variables

**Backend (`backend/.env`)**

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `DATABASE_SSL` | `true` only when using Render's external database URL |
| `JWT_SECRET` | Signs 15-minute access tokens |
| `REFRESH_SECRET` | Signs 7-day refresh tokens; use a different value |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated |
| `PORT` | Optional; defaults to 4000 |
| `NODE_ENV` | Set to `production` on the deployed backend |

**Frontend (`frontend/.env`)**

| Name | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL including `/api`; defaults to `http://localhost:4000/api` |

## Authentication and API

Access tokens are held only in the Redux store. A seven-day refresh token is stored in an HTTP-only cookie. The client refreshes on page load and retries a request once after an expired access token.

All API routes are under `/api`. Except register, login, refresh, and logout, endpoints require `Authorization: Bearer <token>`.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/register` | Register and sign in |
| POST | `/login` | Sign in |
| POST | `/refresh` | Exchange the refresh cookie for an access token |
| POST | `/logout` | Clear the refresh cookie |
| GET / POST | `/stories` | List / create stories |
| GET / PATCH / DELETE | `/stories/:id` | Read / edit / delete a story |
| GET | `/stories/:id/versions` | Read prior story versions |
| GET / POST | `/stories/:id/comments` | Read / add comments |
| DELETE | `/comments/:id` | Delete a comment as its author or story author |
| POST | `/contributors` | Add a contributor by user ID or email |
| GET | `/contributors/:story_id` | List contributors |
| DELETE | `/contributors/:id` | Remove a contributor |

## Deploy on Render

Create a PostgreSQL instance, then deploy the `backend` as a web service (`npm install && npm run build`, start command `npm start`) and the `frontend` as a static site (`npm install && npm run build`, publish directory `dist`). Configure the environment variables above. Add a frontend rewrite from `/*` to `/index.html` for client-side routes.
