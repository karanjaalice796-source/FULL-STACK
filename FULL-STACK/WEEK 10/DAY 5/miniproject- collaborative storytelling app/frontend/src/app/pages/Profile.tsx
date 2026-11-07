import { useEffect, useState, type FormEvent } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { request } from "../api"
import { updateUser } from "../../features/auth/authSlice"
import { fetchStories } from "../../features/stories/storiesSlice"
import type { User } from "@shared"

export default function Profile() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)!
  const stories = useAppSelector((state) => state.stories.items)
  const [username, setUsername] = useState(user.username)
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void dispatch(fetchStories())
  }, [dispatch])

  const createdCount = stories.filter((story) => story.author_id === user.id).length
  const contributedCount = stories.filter((story) => story.contributors.some((contributor) => contributor.user_id === user.id)).length

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage("")
    try {
      const result = await request<{ user: User }>("/profile", {
        method: "PATCH",
        body: { username, avatar_url: avatarUrl.trim() || null },
      })
      dispatch(updateUser(result.user))
      setMessage("Your profile has been updated.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Your profile could not be saved.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h1>Your profile</h1>
      <p className="note">A little about the person behind the stories.</p>
      <section className="profile-card">
        <div className="profile-summary">
          <img
            className="profile-avatar"
            src={user.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.username)}`}
            alt={`${user.username}'s avatar`}
          />
          <div>
            <h2>{user.username}</h2>
            <p className="quiet">{user.email}</p>
          </div>
        </div>
        <div className="profile-stats">
          <p><strong>{createdCount}</strong><span>Stories created</span></p>
          <p><strong>{contributedCount}</strong><span>Stories contributed to</span></p>
        </div>
      </section>
      <form className="auth-form profile-form" onSubmit={(event) => void saveProfile(event)}>
        <div className="field">
          <label htmlFor="profile-username">Username</label>
          <input
            id="profile-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={2}
            maxLength={50}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="profile-avatar">Avatar image URL</label>
          <input
            id="profile-avatar"
            type="url"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            placeholder="https://example.com/avatar.png"
          />
          <span className="help">Use a public image URL. Leave empty to use a generated avatar.</span>
        </div>
        {message && <p className={message.startsWith("Your profile") ? "success" : "alert"} role="status">{message}</p>}
        <button className="btn" type="submit" disabled={busy || username.trim().length < 2}>
          {busy ? "Saving…" : "Save profile"}
        </button>
      </form>
    </>
  )
}
