# Trackly — Job Tracker

Trackly keeps a job search in one private workspace: applications, a drag-and-drop pipeline, interview preparation, contacts, follow-up dates, a calendar, and search insights.

## Requirements

- Node.js 24 or later (`node:sqlite` is used for the local relational database).

## Run locally

From this directory:

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000), create an account, and start tracking your search. The SQLite database is created at `data/trackly.db` on first launch and is excluded from Git.

To load a sample workspace for a portfolio demo:

```sh
npm run seed
```

Sign in with `demo@trackly.app` / `trackly-demo-2026`. Use `DEMO_PASSWORD` to set a different password when seeding. Never deploy the demo password or account as a production credential.

Run the API and data-isolation tests with:

```sh
npm test
```

## What's included

- Private accounts with salted scrypt password hashes and signed, `HttpOnly`, `SameSite=Lax` sessions.
- Server-side, relational SQLite persistence for users, jobs, interviews, contacts, and activity history.
- User-scoped application CRUD, search and status filtering, salary ranges, tags, priorities, follow-ups, and notes.
- A drag-and-drop pipeline with Wishlist, Applied, Phone Screen, Interview, Offer, Rejected, and Withdrawn stages.
- Interview preparation notes, recruiter contacts, linked resume/cover-letter/portfolio URLs, a monthly interview/follow-up calendar, dashboard, insights, dark mode, and CSV/JSON exports.
- A learning page with short resume, application, interview, follow-up, networking, and offer guides; lesson progress is kept per account in the browser.
- Responsive layouts for desktop, tablet, and mobile, with an applicant-tracking photo background.
- Input validation, request-size limits, login throttling, cross-origin mutation checks, ownership checks, and basic security headers.

## Configuration and deployment

- `PORT` selects the HTTP port (defaults to `3000`).
- `DATABASE_PATH` selects the SQLite file (defaults to `data/trackly.db`).
- `JWT_SECRET` should be a random value of at least 32 characters in production. The development default is only for local use.
- Production hosting must use HTTPS and durable storage for `data/trackly.db`; otherwise account data will not persist across restarts. Do not deploy the demo seed.

Document attachments are saved as links; file uploads, email reminders, and interview notifications are not configured.

The nine-page blueprint proposes React/Vite, Express, Prisma, and PostgreSQL. This runnable implementation keeps the frontend dependency-free and uses Node's built-in HTTP server and SQLite so it can be tried locally without a package install or database service. Migrating the persistence layer to Prisma/PostgreSQL and deploying the static client and API separately remain production follow-ups.
