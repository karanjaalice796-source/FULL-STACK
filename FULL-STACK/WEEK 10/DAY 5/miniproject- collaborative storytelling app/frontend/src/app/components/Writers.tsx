import { useState, type FormEvent } from "react"
import type { Story } from "@shared"
import { addContributor, removeContributor } from "../../features/stories/storiesSlice"
import { useAppDispatch } from "../hooks"
import Pencils from "./Pencils"

export default function Writers({ story, isAuthor }: { story: Story; isAuthor: boolean }) {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function invite(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) {
      setError("Enter the email they signed up with.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      await dispatch(addContributor({ storyId: story.id, email })).unwrap()
      setEmail("")
    } catch (reason) {
      setError(typeof reason === "string" ? reason : "Couldn't add that writer.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel">
      <h3>Writers</h3>
      <ul className="writers">
        <li><Pencils writers={[{ id: story.author_id, username: story.author_username }]} />{story.author_username}<span className="hand">author</span></li>
        {story.contributors.map((contributor) => (
          <li key={contributor.id}>
            <Pencils writers={[{ id: contributor.user_id, username: contributor.username }]} />
            {contributor.username}
            {isAuthor && (
              <button type="button" className="link-btn" onClick={() => void dispatch(removeContributor({ storyId: story.id, id: contributor.id })).unwrap().catch((reason: unknown) => setError(typeof reason === "string" ? reason : "Couldn't remove that writer."))}>
                remove
              </button>
            )}
          </li>
        ))}
      </ul>
      {isAuthor && (
        <form onSubmit={(event) => void invite(event)} noValidate>
          <label htmlFor="invite-email">Add a writer by email</label>
          <input id="invite-email" type="email" value={email} maxLength={100} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
          {error && <p className="alert" role="alert">{error}</p>}
          <button type="submit" className="btn small" disabled={busy}>{busy ? "Adding…" : "Add writer"}</button>
        </form>
      )}
    </section>
  )
}
