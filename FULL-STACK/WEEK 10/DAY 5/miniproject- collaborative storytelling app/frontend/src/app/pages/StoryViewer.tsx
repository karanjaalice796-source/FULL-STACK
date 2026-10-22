import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import type { StoryVersion } from "@shared"
import {
  deleteStory,
  discardDraft,
  fetchStory,
  saveStory,
  setDraftField,
  startEditing,
} from "../../features/stories/storiesSlice"
import Comments from "../components/Comments"
import History from "../components/History"
import Writers from "../components/Writers"
import { timeAgo } from "../format"
import { useAppDispatch, useAppSelector } from "../hooks"

export default function StoryViewer() {
  const { id } = useParams()
  return <StoryPage key={id} storyId={Number(id)} />
}

function StoryPage({ storyId }: { storyId: number }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const me = useAppSelector((state) => state.auth.user)!
  const story = useAppSelector((state) => state.stories.items.find((item) => item.id === storyId))
  const { draft, saving, error, versions } = useAppSelector((state) => state.stories)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    void dispatch(fetchStory(storyId)).unwrap().catch(() => setMissing(true))
  }, [dispatch, storyId])

  if (missing) {
    return <><h1>Story not found</h1><p className="note">It may have been deleted.</p><Link to="/">Back to the stories</Link></>
  }
  if (!story) return <p className="loading">Turning to the right page…</p>

  const isAuthor = story.author_id === me.id
  const canEdit = isAuthor || story.contributors.some((person) => person.user_id === me.id)
  const editing = draft?.id === story.id
  const paragraphs = story.content.split(/\n{2,}/).filter((paragraph) => paragraph.trim())

  async function remove() {
    if (!window.confirm("Delete this story for good? Its comments and history go too.")) return
    try {
      await dispatch(deleteStory(storyId)).unwrap()
      navigate("/")
    } catch {
      // The rejected thunk leaves an error message in the stories state.
    }
  }

  function restore(version: StoryVersion) {
    dispatch(saveStory({ id: storyId, title: version.title, content: version.content }))
  }

  return (
    <>
      <div className="reader">
        <article>
          {editing && draft ? (
            <form onSubmit={(event) => { event.preventDefault(); void dispatch(saveStory(draft)) }} noValidate>
              <div className="field">
                <label htmlFor="edit-title">Title</label>
                <input id="edit-title" className="title-input" maxLength={255} value={draft.title} onChange={(event) => dispatch(setDraftField({ field: "title", value: event.target.value }))} />
              </div>
              <div className="field">
                <label htmlFor="edit-text">Story</label>
                <textarea id="edit-text" className="ruled-area" rows={16} maxLength={20000} value={draft.content} onChange={(event) => dispatch(setDraftField({ field: "content", value: event.target.value }))} />
                <span className="count">{draft.content.length} / 20000</span>
              </div>
              {error && <p className="alert" role="alert">{error}</p>}
              <div className="actions">
                <button type="submit" className="btn" disabled={saving || !draft.title.trim() || !draft.content.trim()}>{saving ? "Saving…" : "Save changes"}</button>
                <button type="button" className="btn plain" disabled={saving} onClick={() => dispatch(discardDraft())}>Discard changes</button>
              </div>
            </form>
          ) : (
            <>
              <h1>{story.title}</h1>
              <p className="note">by {story.author_username}, updated {timeAgo(story.updated_at)}</p>
              <div className="story-body">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              {error && <p className="alert" role="alert">{error}</p>}
              <div className="actions">
                {canEdit && <button type="button" className="btn" onClick={() => dispatch(startEditing(story))}>Edit story</button>}
                {isAuthor && <button type="button" className="btn danger" onClick={() => void remove()}>Delete story</button>}
              </div>
            </>
          )}
        </article>
        <aside>
          <Writers story={story} isAuthor={isAuthor} />
          <History versions={versions} canRestore={canEdit} busy={saving} onRestore={restore} />
        </aside>
      </div>
      <Comments storyId={story.id} authorId={story.author_id} />
    </>
  )
}
