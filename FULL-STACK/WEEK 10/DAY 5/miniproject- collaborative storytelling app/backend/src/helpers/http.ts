import type { NextFunction, Request, RequestHandler, Response } from "express"

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next)
  }

export function parseId(value: unknown, label = "id"): number {
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) throw new HttpError(400, `Invalid ${label}.`)
  return n
}

export function field(value: unknown, label: string, min: number, max: number): string {
  const v = typeof value === "string" ? value.trim() : ""
  if (v.length < min) {
    throw new HttpError(400, min <= 1 ? `${label} is required.` : `${label} must be at least ${min} characters.`)
  }
  if (v.length > max) throw new HttpError(400, `${label} must be at most ${max} characters.`)
  return v
}

export const isEmail = (value: string) => value.length <= 100 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export const isUniqueViolation = (err: unknown) =>
  typeof err === "object" && err !== null && "code" in err && err.code === "23505"
