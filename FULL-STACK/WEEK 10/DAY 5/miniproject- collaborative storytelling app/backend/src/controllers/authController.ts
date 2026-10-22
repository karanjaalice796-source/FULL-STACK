import bcrypt from "bcrypt"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { config } from "../config"
import { asyncHandler, field, HttpError, isEmail, isUniqueViolation } from "../helpers/http"
import { clearRefreshCookie, REFRESH_COOKIE, setRefreshCookie, signAccess } from "../helpers/tokens"
import { createUser, findUserByEmail, findUserById } from "../models/userModel"

const SALT_ROUNDS = 10
const DUMMY_HASH = bcrypt.hashSync("inkwell-placeholder", SALT_ROUNDS)

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body ?? {}
  if (!username || !email || !password) throw new HttpError(400, "All fields are required.")

  const name = field(username, "Username", 2, 50)
  const mail = field(email, "Email", 3, 100).toLowerCase()
  if (!isEmail(mail)) throw new HttpError(400, "That doesn't look like a valid email address.")
  if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password) > 72) {
    throw new HttpError(400, "Password must be between 8 and 72 characters.")
  }
  if (await findUserByEmail(mail)) throw new HttpError(400, "An account with that email already exists.")

  let user
  try {
    user = await createUser(name, mail, await bcrypt.hash(password, SALT_ROUNDS))
  } catch (err) {
    if (isUniqueViolation(err)) throw new HttpError(400, "An account with that email already exists.")
    throw err
  }
  setRefreshCookie(res, user.id)
  res.status(201).json({ message: "Account created.", accessToken: signAccess(user.id), user })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {}
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    throw new HttpError(400, "Email and password are required.")
  }
  const row = await findUserByEmail(email.trim().toLowerCase())
  const matches = await bcrypt.compare(password, row?.password_hash ?? DUMMY_HASH)
  if (!row || !matches) throw new HttpError(401, "Invalid credentials.")

  setRefreshCookie(res, row.id)
  res.json({ accessToken: signAccess(row.id), user: { id: row.id, username: row.username, email: row.email } })
})

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE]
  if (typeof token !== "string") throw new HttpError(401, "No active session.")

  let userId: number
  try {
    const payload = jwt.verify(token, config.refreshSecret) as JwtPayload
    if (!Number.isInteger(payload.userId)) throw new Error("Invalid token payload")
    userId = payload.userId
  } catch {
    clearRefreshCookie(res)
    throw new HttpError(401, "Your session has expired. Please log in again.")
  }

  const user = await findUserById(userId)
  if (!user) {
    clearRefreshCookie(res)
    throw new HttpError(401, "Your session has expired. Please log in again.")
  }
  setRefreshCookie(res, user.id)
  res.json({ accessToken: signAccess(user.id), user })
})

export const logout = asyncHandler(async (_req, res) => {
  clearRefreshCookie(res)
  res.status(204).end()
})
