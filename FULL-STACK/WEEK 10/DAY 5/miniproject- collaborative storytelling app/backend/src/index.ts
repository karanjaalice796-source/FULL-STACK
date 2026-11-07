import { createServer } from "node:http"
import app from "./app"
import { config } from "./config"
import { initDb } from "./db/init"
import { pool } from "./db/pool"
import { attachRealtime } from "./realtime"

async function start(): Promise<void> {
  await initDb()
  const server = createServer(app)
  attachRealtime(server)
  server.listen(config.port, () => {
    console.log(`Inkwell API listening on port ${config.port}`)
  })
  const shutdown = () => {
    server.close(() => {
      void pool.end()
    })
  }
  process.once("SIGINT", shutdown)
  process.once("SIGTERM", shutdown)
}

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled rejection:", reason)
})

start().catch((err: unknown) => {
  console.error("Could not start the server:", err instanceof Error ? err.message : err)
  process.exit(1)
})
