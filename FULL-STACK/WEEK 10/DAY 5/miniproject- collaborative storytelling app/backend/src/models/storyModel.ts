import type { Story, StoryVersion } from "@shared"
import { pool } from "../db/pool"

const STORY_SELECT = `
  SELECT s.id, s.title, s.content, s.author_id, s.created_at, s.updated_at,
         u.username AS author_username,
         COALESCE((
           SELECT json_agg(json_build_object('id', c.id, 'user_id', cu.id, 'username', cu.username) ORDER BY c.id)
           FROM contributors c JOIN users cu ON cu.id = c.user_id
           WHERE c.story_id = s.id
         ), '[]'::json) AS contributors,
         (SELECT COUNT(*)::int FROM comments cm WHERE cm.story_id = s.id) AS comment_count
  FROM stories s JOIN users u ON u.id = s.author_id`

export async function listStories(): Promise<Story[]> {
  const { rows } = await pool.query<Story>(`${STORY_SELECT} ORDER BY s.updated_at DESC LIMIT 200`)
  return rows
}

export async function getStory(id: number): Promise<Story | null> {
  const { rows } = await pool.query<Story>(`${STORY_SELECT} WHERE s.id = $1`, [id])
  return rows[0] ?? null
}

export async function createStory(authorId: number, title: string, content: string): Promise<Story> {
  const { rows } = await pool.query<{ id: number }>(
    "INSERT INTO stories (title, content, author_id) VALUES ($1, $2, $3) RETURNING id",
    [title, content, authorId],
  )
  const story = await getStory(rows[0].id)
  if (!story) throw new Error("Created story could not be loaded.")
  return story
}

export async function updateStory(id: number, editorId: number, title: string, content: string): Promise<Story> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await client.query(
      `INSERT INTO story_versions (story_id, title, content, replaced_by)
       SELECT id, title, content, $2 FROM stories
       WHERE id = $1 AND (title <> $3 OR content <> $4)`,
      [id, editorId, title, content],
    )
    await client.query("UPDATE stories SET title = $2, content = $3, updated_at = NOW() WHERE id = $1", [
      id,
      title,
      content,
    ])
    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
  const story = await getStory(id)
  if (!story) throw new Error("Updated story could not be loaded.")
  return story
}

export async function deleteStory(id: number): Promise<void> {
  await pool.query("DELETE FROM stories WHERE id = $1", [id])
}

export async function listVersions(storyId: number): Promise<StoryVersion[]> {
  const { rows } = await pool.query<StoryVersion>(
    `SELECT v.id, v.story_id, v.title, v.content, u.username AS editor_username, v.saved_at
     FROM story_versions v LEFT JOIN users u ON u.id = v.replaced_by
     WHERE v.story_id = $1 ORDER BY v.saved_at DESC, v.id DESC LIMIT 30`,
    [storyId],
  )
  return rows
}

export async function getStoryAccess(storyId: number, userId: number) {
  const { rows } = await pool.query<{ author_id: number; is_contributor: boolean }>(
    `SELECT s.author_id,
            EXISTS (SELECT 1 FROM contributors c WHERE c.story_id = s.id AND c.user_id = $2) AS is_contributor
     FROM stories s WHERE s.id = $1`,
    [storyId, userId],
  )
  if (!rows[0]) return null
  return { isAuthor: rows[0].author_id === userId, isContributor: rows[0].is_contributor }
}
