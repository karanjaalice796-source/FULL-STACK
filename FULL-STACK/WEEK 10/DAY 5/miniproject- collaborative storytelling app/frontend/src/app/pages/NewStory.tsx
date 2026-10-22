import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { createStory } from "../../features/stories/storiesSlice"
import { useAppDispatch } from "../hooks"

export default function NewStory() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!title.trim()) return setError("Give your story a title.")
    if (!content.trim()) return setError("Write the first few lines before saving.")
    setBusy(true)
    setError(null)
    try {
      const story = await dispatch(createStory({ title, content })).unwrap()
      navigate(`/stories/${story.id}`)
    } catch (reason) {
      setError(typeof reason === "string" ? reason : "Couldn't save your story.")
      setBusy(false)
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)} noValidate>
      <h1>Start a story</h1>
      <p className="note">Write an opening. Others can pick it up once you add them.</p>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" className="title-input" maxLength={255} value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="content">Story</label>
        <textarea id="content" className="ruled-area" rows={14} maxLength={20000} value={content} onChange={(event) => setContent(event.target.value)} />
        <span className="count">{content.length} / 20000</span>
      </div>
      {error && <p className="alert" role="alert">{error}</p>}
      <button type="submit" className="btn" disabled={busy}>{busy ? "Saving…" : "Save story"}</button>
    </form>
  )
}
