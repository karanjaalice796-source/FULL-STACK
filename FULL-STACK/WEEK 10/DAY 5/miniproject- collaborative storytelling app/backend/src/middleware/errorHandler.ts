import type { ErrorRequestHandler, RequestHandler } from "express"
import { HttpError } from "../helpers/http"

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Nothing here." })
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message })
    return
  }
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ message: "The request body isn't valid JSON." })
    return
  }
  if (err?.type === "entity.too.large") {
    res.status(413).json({ message: "That's too much text to send at once." })
    return
  }
  console.error(err)
  res.status(500).json({ message: "Something went wrong on our side. Please try again." })
}
