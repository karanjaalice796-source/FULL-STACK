import dotenv from "dotenv"

const isProduction = process.env.NODE_ENV === "production"
if (!isProduction) dotenv.config()

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

export const config = {
  isProduction,
  port: Number(process.env.PORT) || 4000,
  databaseUrl: required("DATABASE_URL"),
  databaseSsl: process.env.DATABASE_SSL === "true",
  jwtSecret: required("JWT_SECRET"),
  refreshSecret: required("REFRESH_SECRET"),
  clientOrigins: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
}
