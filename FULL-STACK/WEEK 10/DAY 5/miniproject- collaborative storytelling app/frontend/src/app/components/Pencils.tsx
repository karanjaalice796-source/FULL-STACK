import type { CSSProperties } from "react"
import { pencilColor } from "../format"

interface Writer {
  id: number
  username: string
}

export default function Pencils({ writers }: { writers: Writer[] }) {
  return (
    <span className="pencils">
      {writers.map((writer) => (
        <span
          key={writer.id}
          className="pencil"
          style={{ "--c": pencilColor(writer.id) } as CSSProperties}
          title={writer.username}
        >
          {writer.username.charAt(0).toUpperCase()}
        </span>
      ))}
    </span>
  )
}
