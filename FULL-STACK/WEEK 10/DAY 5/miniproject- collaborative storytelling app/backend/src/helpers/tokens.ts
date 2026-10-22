import jwt from "jsonwebtoken"
import type { CookieOptions, Response } from "express"
import { config } from "../config"

export const REFRESH_COOKIE = "refreshToken"
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

export const signAccess = (userId: number) => jwt.sign({ userId }, config.jwtSecret, { expiresIn: "15m" })
const signRefresh = (userId: number) => jwt.sign({ userId }, config.refreshSecret, { expiresIn: "7d" })

const baseCookie: CookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? "none" : "lax",
  path: "/api",
}

export const setRefreshCookie = (res: Response, userId: number) =>
  res.cookie(REFRESH_COOKIE, signRefresh(userId), { ...baseCookie, maxAge: SEVEN_DAYS })
export const clearRefreshCookie = (res: Response) => res.clearCookie(REFRESH_COOKIE, baseCookie)
