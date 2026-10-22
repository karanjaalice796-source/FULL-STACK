import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { config } from "./config"
import { errorHandler, notFound } from "./middleware/errorHandler"
import authRoutes from "./routes/authRoutes"
import commentRoutes from "./routes/commentRoutes"
import contributorRoutes from "./routes/contributorRoutes"
import storyRoutes from "./routes/storyRoutes"

const app = express()

app.set("trust proxy", 1)
app.disable("x-powered-by")
app.use(helmet())
app.use(cors({ origin: config.clientOrigins, credentials: true }))
app.use(express.json({ limit: "100kb" }))
app.use(cookieParser())

app.get("/api/health", (_req, res) => {
  res.json({ ok: true })
})

app.use("/api", authRoutes)
app.use("/api/stories", storyRoutes)
app.use("/api/contributors", contributorRoutes)
app.use("/api/comments", commentRoutes)
app.use(notFound)
app.use(errorHandler)

export default app
