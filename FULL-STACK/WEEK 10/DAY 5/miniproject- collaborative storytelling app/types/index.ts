// Shared between backend and frontend. Type-only: always import with `import type`.
export interface User {
  id: number
  username: string
  email: string
}

export interface Contributor {
  id: number
  user_id: number
  username: string
}

export interface Story {
  id: number
  title: string
  content: string
  author_id: number
  author_username: string
  created_at: string
  updated_at: string
  contributors: Contributor[]
  comment_count: number
}

export interface StoryComment {
  id: number
  story_id: number
  user_id: number
  username: string
  body: string
  created_at: string
}

export interface StoryVersion {
  id: number
  story_id: number
  title: string
  content: string
  editor_username: string | null
  saved_at: string
}

export interface AuthResponse {
  accessToken: string
  user: User
  message?: string
}

export interface ApiErrorBody {
  message: string
}
