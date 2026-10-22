import type { StoryComment } from "@shared"
import { pool } from "../db/pool"

export async function listComments(storyId: number): Promise<StoryComment[]> {
  const { rows } = await pool.query<StoryComment>(
    `SELECT c.id, c.story_id, c.user_id, u.username, c.body, c.created_at
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.story_id = $1 ORDER BY c.created_at ASC, c.id ASC`,
    [storyId],
  )
  return rows
}

export async function addComment(storyId: number, userId: number, body: string): Promise<StoryComment> {
  const { rows } = await pool.query<StoryComment>(
    `WITH ins AS (
       INSERT INTO comments (story_id, user_id, body) VALUES ($1, $2, $3) RETURNING *
     )
     SELECT ins.id, ins.story_id, ins.user_id, u.username, ins.body, ins.created_at
     FROM ins JOIN users u ON u.id = ins.user_id`,
    [storyId, userId, body],
  )
  return rows[0]
}

export async function getComment(id: number) {
  const { rows } = await pool.query<{ id: number; user_id: number; story_author_id: number }>(
    `SELECT c.id, c.user_id, s.author_id AS story_author_id
     FROM comments c JOIN stories s ON s.id = c.story_id WHERE c.id = $1`,
    [id],
  )
  return rows[0] ?? null
}

export async function deleteComment(id: number): Promise<void> {
  await pool.query("DELETE FROM comments WHERE id = $1", [id])
}
