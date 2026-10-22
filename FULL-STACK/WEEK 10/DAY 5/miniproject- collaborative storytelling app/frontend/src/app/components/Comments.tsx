import { useState, type CSSProperties, type FormEvent } from "react"
import { postComment, removeComment } from "../../features/stories/storiesSlice"
import { pencilColor, timeAgo } from "../format"
import { useAppDispatch, useAppSelector } from "../hooks"

export default function Comments({ storyId, authorId }: { storyId: number; authorId: number }) {
  const dispatch = useAppDispatch()
  const me = useAppSelector((state) => state.auth.user)
  const comments = useAppSelector((state) => state.stories.comments)
  const [body, setBody] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!body.trim()) {
      setError("Write something first.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      await dispatch(postComment({ storyId, body })).unwrap()
      setBody("")
    } catch (reason) {
      setError(typeof reason === "string" ? reason : "Couldn't post your comment.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="comments">
      <h2>Notes in the margin</h2>
      {comments.length === 0 && <p className="quiet">No comments yet. Be the first to say what you think.</p>}
      {comments.map((comment) => (
        <article key={comment.id} className="comment" style={{ "--c": pencilColor(comment.user_id) } as CSSProperties}>
          <header>
            <b>{comment.username}</b>
            <span className="quiet">{timeAgo(comment.created_at)}</span>
            {me && (comment.user_id === me.id || authorId === me.id) && (
              <button type="button" className="link-btn" onClick={() => void dispatch(removeComment(comment.id)).unwrap().catch((reason: unknown) => setError(typeof reason === "string" ? reason : "Couldn't delete that note."))}>delete</button>
            )}
          </header>
          <p>{comment.body}</p>
        </article>
      ))}
      {me ? (
        <form onSubmit={(event) => void submit(event)} noValidate>
          <label htmlFor="new-comment">Add a comment</label>
          <textarea id="new-comment" className="plain-area" rows={3} maxLength={2000} value={body} onChange={(event) => setBody(event.target.value)} />
          {error && <p className="alert" role="alert">{error}</p>}
          <button type="submit" className="btn" disabled={busy}>{busy ? "Adding…" : "Add comment"}</button>
        </form>
      ) : (
        <p className="quiet">You’re viewing the story in read-only mode.</p>
      )}
    </section>
  )
}
