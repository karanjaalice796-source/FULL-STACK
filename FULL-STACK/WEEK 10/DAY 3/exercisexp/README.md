# JWT Authentication with Express

A Node.js/Express API that demonstrates registration and login, password hashing, access and refresh JWTs, httpOnly cookies, authenticated routes, refresh-token rotation and revocation, email-confirmation flow, rate limiting, and SQLite persistence.

## Requirements

- Node.js 22 or newer and npm
- Windows users may need the C++ Build Tools installed if `better-sqlite3` or `bcrypt` cannot use a prebuilt binary for their Node.js version.

## Setup

From this directory, install dependencies:

```sh
npm install
```

Copy `.env.example` to `.env`. The project includes a local `.env` with independently generated development secrets; do not commit or share it. If you need to generate new secrets, run this command twice and use different outputs:

```sh
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Start the server:

```sh
npm start
```

For development with Node's file watcher:

```sh
npm run dev
```

The server listens on `http://localhost:3000` by default. SQLite creates `app.db` automatically on first start. Both `.env` and the database files are excluded by `.gitignore`.

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port | `3000` |
| `NODE_ENV` | Set to `production` to mark cookies Secure | `development` |
| `BASE_URL` | Base URL used in confirmation links | `http://localhost:3000` |
| `DB_FILE` | SQLite database file path | `app.db` |
| `ACCESS_TOKEN_SECRET` | Secret for signing access tokens | Required |
| `REFRESH_TOKEN_SECRET` | Separate secret for refresh tokens | Required |
| `ACCESS_TOKEN_EXPIRES` | Access-token lifetime | `15m` |
| `REFRESH_TOKEN_EXPIRES` | Refresh-token lifetime | `7d` |

Use long, random, distinct secrets in every environment. Production deployments should use HTTPS and a managed secret store. The development `.env` is not suitable for production.

## JWT overview

A JSON Web Token consists of a header, payload, and signature. The signed payload in this project carries a user ID (`sub`) and, for access tokens, a username. Tokens expire; the signature lets the server detect tampering but does not encrypt the payload. Do not place passwords or other secrets in a JWT.

Access tokens are sent as httpOnly cookies and can also be supplied by API clients in an `Authorization: Bearer <token>` header. Refresh tokens are stored as httpOnly cookies scoped to `/auth`; only their SHA-256 hashes are stored in SQLite. Refresh tokens rotate on use, and reusing a revoked refresh token revokes the user's stored refresh tokens.

## API

All request bodies below use JSON. Cookies are set automatically by registration, login, and refresh; a browser client should send requests with credentials enabled.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `POST` | `/auth/register` | Create an account; body: `{ "username", "email", "password" }` |
| `GET` | `/auth/confirm/:token` | Confirm email using the link logged by the demo |
| `POST` | `/auth/login` | Log in with `{ "username": "<username or email>", "password": "..." }` |
| `POST` | `/auth/refresh` | Rotate a refresh token and issue a new access token |
| `POST` | `/auth/logout` | Revoke the current refresh token and clear auth cookies |
| `GET` | `/api/auth-check` | Return authentication status |
| `GET` | `/api/protected` | Example protected resource |
| `GET` | `/api/me` | Read the authenticated user's profile |
| `PUT` | `/api/profile` | Update `username`, `email`, or both |

`/api/*` routes require a valid access token. Missing credentials return `401`; invalid credentials return `403`. Expired access tokens return `401` with code `TOKEN_EXPIRED`; call `/auth/refresh` and retry. Registration enforces a 3-20 character username, a basic email format, and an 8-72 character password containing lowercase, uppercase, and numeric characters.

### Try it with curl

Register (the development confirmation URL is printed in the server console):

```sh
curl -i -c cookies.txt -H "Content-Type: application/json" -d "{\"username\":\"alice1\",\"email\":\"alice@example.com\",\"password\":\"SecurePass1\"}" http://localhost:3000/auth/register
```

Call a protected route using the saved cookies:

```sh
curl -i -b cookies.txt http://localhost:3000/api/me
```

Refresh or log out using the same cookie jar:

```sh
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/refresh
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout
```

## Exercise checklist

- [x] Validate registration and hash passwords with bcrypt.
- [x] Issue expiring access and refresh JWTs.
- [x] Verify access tokens in authentication middleware and protect API routes.
- [x] Store tokens in httpOnly cookies and clear cookies on logout.
- [x] Rotate, hash, and revoke refresh tokens in SQLite.
- [x] Update the authenticated user's username and email.
- [x] Demonstrate email confirmation links.
- [x] Rate-limit registration, login, and refresh endpoints.
- [ ] Replace the console-only confirmation email with a real email provider.
- [ ] Add automated tests and deployment-specific CSRF/origin protections.

The confirmation-email flow is for learning only: links are logged to the server console rather than emailed. In production, send confirmation links through an email provider, require HTTPS, review cookie and CSRF protections for the client deployment, and monitor token revocation and account activity.
