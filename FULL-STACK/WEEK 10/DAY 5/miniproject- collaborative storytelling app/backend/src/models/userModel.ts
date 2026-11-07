import type { User } from "@shared"
import { pool } from "../db/pool"

export interface UserRow extends User {
  password_hash: string
}

export async function createUser(username: string, email: string, passwordHash: string): Promise<User> {
  const { rows } = await pool.query<User>(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, avatar_url",
    [username, email, passwordHash],
  )
  return rows[0]
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const { rows } = await pool.query<UserRow>(
    "SELECT id, username, email, password_hash, avatar_url FROM users WHERE email = $1",
    [email],
  )
  return rows[0] ?? null
}

export async function findUserById(id: number): Promise<User | null> {
  const { rows } = await pool.query<User>("SELECT id, username, email, avatar_url FROM users WHERE id = $1", [id])
  return rows[0] ?? null
}

export async function updateUserProfile(id: number, username: string, avatarUrl: string | null): Promise<User | null> {
  const { rows } = await pool.query<User>(
    "UPDATE users SET username = $2, avatar_url = $3 WHERE id = $1 RETURNING id, username, email, avatar_url",
    [id, username, avatarUrl],
  )
  return rows[0] ?? null
}
