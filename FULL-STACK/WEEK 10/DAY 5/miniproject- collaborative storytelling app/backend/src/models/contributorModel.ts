import type { Contributor } from "@shared"
import { pool } from "../db/pool"

export async function addContributor(storyId: number, userId: number): Promise<Contributor> {
  const { rows } = await pool.query<Contributor>(
    `WITH ins AS (
       INSERT INTO contributors (story_id, user_id) VALUES ($1, $2) RETURNING id, user_id
     )
     SELECT ins.id, ins.user_id, u.username FROM ins JOIN users u ON u.id = ins.user_id`,
    [storyId, userId],
  )
  return rows[0]
}

export async function listContributors(storyId: number): Promise<Contributor[]> {
  const { rows } = await pool.query<Contributor>(
    `SELECT c.id, c.user_id, u.username FROM contributors c
     JOIN users u ON u.id = c.user_id WHERE c.story_id = $1 ORDER BY c.id`,
    [storyId],
  )
  return rows
}

export async function getContributor(id: number) {
  const { rows } = await pool.query<{ id: number; story_id: number }>(
    "SELECT id, story_id FROM contributors WHERE id = $1",
    [id],
  )
  return rows[0] ?? null
}

export async function removeContributor(id: number): Promise<void> {
  await pool.query("DELETE FROM contributors WHERE id = $1", [id])
}
