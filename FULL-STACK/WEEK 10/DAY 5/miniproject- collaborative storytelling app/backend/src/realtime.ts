import type { Server as HttpServer } from "node:http"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { Server } from "socket.io"
import { config } from "./config"
import type { Story } from "@shared"
import { getStoryAccess } from "./models/storyModel"

let io: Server | null = null

export function attachRealtime(server: HttpServer): void {
  io = new Server(server, {
    cors: { origin: config.clientOrigins, credentials: true },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (typeof token !== "string") {
      next(new Error("Authentication required."))
      return
    }

    try {
      const payload = jwt.verify(token, config.jwtSecret) as JwtPayload
      if (!Number.isInteger(payload.userId)) throw new Error("Invalid token payload.")
      socket.data.userId = payload.userId as number
      next()
    } catch {
      next(new Error("Invalid or expired access token."))
    }
  })

  io.on("connection", (socket) => {
    socket.on("story:join", async (storyId: unknown) => {
      if (!Number.isInteger(storyId) || (storyId as number) < 1) return
      try {
        const access = await getStoryAccess(storyId as number, socket.data.userId as number)
        if (!access || (!access.isAuthor && !access.isContributor)) return
        await socket.join(`story:${storyId}`)
      } catch (error) {
        console.error("Could not authorize story socket room:", error)
        socket.emit("story:error", { message: "Unable to join this story right now." })
      }
    })
  })
}

export function emitStoryUpdated(story: Story): void {
  io?.to(`story:${story.id}`).emit("story:updated", { storyId: story.id })
}
