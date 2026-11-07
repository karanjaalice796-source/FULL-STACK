import { asyncHandler, field, HttpError } from "../helpers/http"
import { findUserById, updateUserProfile } from "../models/userModel"

function parseAvatarUrl(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null
  if (typeof value !== "string" || value.length > 2048) {
    throw new HttpError(400, "Avatar URL must be a valid HTTP or HTTPS URL.")
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new HttpError(400, "Avatar URL must be a valid HTTP or HTTPS URL.")
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new HttpError(400, "Avatar URL must use HTTP or HTTPS.")
  }
  return url.toString()
}

export const show = asyncHandler(async (req, res) => {
  const user = await findUserById(req.userId!)
  if (!user) throw new HttpError(404, "User not found.")
  res.json({ user })
})

export const update = asyncHandler(async (req, res) => {
  const username = field(req.body?.username, "Username", 2, 50)
  const avatarUrl = parseAvatarUrl(req.body?.avatar_url)
  const user = await updateUserProfile(req.userId!, username, avatarUrl)
  if (!user) throw new HttpError(404, "User not found.")
  res.json({ user })
})
