# A little message exchange

A small React + Express exercise: fetch a greeting, send a message, and see the server's reply.

## Run locally

Build the React client, then start Express to serve the client and API together.

**Terminal 1 — Build the client**

```powershell
cd client
npm install
npm run build
```

**Terminal 2 — Start the server**

```powershell
cd ..\server
npm install
npm start
```

Open `http://localhost:5000`. Express serves the built React client and handles its API requests on the same origin.

## API

- `GET /api/hello` returns `{ "message": "Hello From Express" }`.
- `POST /api/world` accepts `{ "message": "..." }`, logs the submitted body in the server terminal, and replies with the echoed message.
