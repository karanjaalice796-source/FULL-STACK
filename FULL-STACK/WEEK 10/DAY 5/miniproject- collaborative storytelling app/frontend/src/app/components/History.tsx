import type { StoryVersion } from "@shared"
import { timeAgo } from "../format"

interface Props {
  versions: StoryVersion[]
  canRestore: boolean
  busy: boolean
  onRestore: (version: StoryVersion) => void
}

export default function History({ versions, canRestore, busy, onRestore }: Props) {
  return (
    <section className="panel">
      <h3>Earlier versions</h3>
      {versions.length === 0 ? <p className="quiet">Nothing has been rewritten yet.</p> : (
        <ul className="versions">
          {versions.map((version) => (
            <li key={version.id}>
              <details>
                <summary>{timeAgo(version.saved_at)}{version.editor_username && <span className="quiet"> before {version.editor_username}'s edit</span>}</summary>
                <p className="version-title">{version.title}</p>
                <p className="version-text">{version.content.slice(0, 400)}{version.content.length > 400 ? "…" : ""}</p>
                {canRestore && <button type="button" className="btn plain small" disabled={busy} onClick={() => onRestore(version)}>Restore this version</button>}
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
