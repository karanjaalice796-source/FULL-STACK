import jwt, { type JwtPayload } from "jsonwebtoken"
import type { RequestHandler } from "express"
import { config } from "../config"

declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

export const authenticate: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined
  if (!token) {
    res.status(401).json({ message: "Please log in to continue." })
    return
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload
    if (!Number.isInteger(payload.userId)) throw new Error("Invalid token payload")
    req.userId = payload.userId as number
    next()
  } catch {
    res.status(401).json({ message: "Your session has expired." })
  }
}
