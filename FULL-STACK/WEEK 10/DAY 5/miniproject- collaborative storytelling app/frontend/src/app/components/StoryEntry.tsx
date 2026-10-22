import { Link } from "react-router-dom"
import type { Story } from "@shared"
import { excerpt, timeAgo } from "../format"
import Pencils from "./Pencils"

export default function StoryEntry({ story }: { story: Story }) {
  const writers = [{ id: story.author_id, username: story.author_username }].concat(
    story.contributors.map((contributor) => ({ id: contributor.user_id, username: contributor.username })),
  )
  return (
    <Link to={`/stories/${story.id}`} className="entry">
      <h2>{story.title}</h2>
      <p className="entry-text">{excerpt(story.content, 200)}</p>
      <div className="entry-meta">
        <Pencils writers={writers} />
        <span>by {story.author_username}</span>
        <span>{timeAgo(story.updated_at)}</span>
        {story.comment_count > 0 && (
          <span className="hand">{story.comment_count} {story.comment_count === 1 ? "note" : "notes"} in the margin</span>
        )}
      </div>
    </Link>
  )
}
