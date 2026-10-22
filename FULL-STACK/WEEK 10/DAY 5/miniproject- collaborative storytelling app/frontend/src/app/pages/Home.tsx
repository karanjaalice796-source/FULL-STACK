import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { fetchStories } from "../../features/stories/storiesSlice"
import StoryEntry from "../components/StoryEntry"
import { useAppDispatch, useAppSelector } from "../hooks"

type Filter = "all" | "mine" | "joined"
const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "mine", label: "My stories" },
  { id: "joined", label: "Ones I write on" },
]

export default function Home() {
  const dispatch = useAppDispatch()
  const me = useAppSelector((state) => state.auth.user)!
  const { items, listStatus, error } = useAppSelector((state) => state.stories)
  const [filter, setFilter] = useState<Filter>("all")
  const [term, setTerm] = useState("")

  useEffect(() => {
    void dispatch(fetchStories())
  }, [dispatch])

  const shown = useMemo(() => {
    const needle = term.trim().toLowerCase()
    return items.filter((story) => {
      if (filter === "mine" && story.author_id !== me.id) return false
      if (filter === "joined" && !story.contributors.some((person) => person.user_id === me.id)) return false
      return !needle || story.title.toLowerCase().includes(needle)
    })
  }, [items, filter, term, me.id])

  return (
    <>
      <h1>Stories in progress</h1>
      <p className="note">Pick one up, or start your own and pass the pen.</p>
      <div className="tabs">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" className={filter === tab.id ? "tab on" : "tab"} aria-pressed={filter === tab.id} onClick={() => setFilter(tab.id)}>
            {tab.label}
          </button>
        ))}
        <input className="finder" type="search" placeholder="Search titles" aria-label="Search titles" value={term} onChange={(event) => setTerm(event.target.value)} />
      </div>
      {listStatus === "loading" && items.length === 0 && <p className="loading">Flipping through the pages…</p>}
      {listStatus === "failed" && <p className="alert" role="alert">{error || "The stories couldn't be loaded."} <button type="button" className="link-btn" onClick={() => void dispatch(fetchStories())}>Try again</button></p>}
      {listStatus === "ready" && shown.length === 0 && (
        <p className="quiet">
          {items.length === 0 ? <>Nothing has been written yet. <Link to="/stories/new">Start the first story.</Link></> : "No stories match that."}
        </p>
      )}
      {shown.map((story) => <StoryEntry key={story.id} story={story} />)}
    </>
  )
}
