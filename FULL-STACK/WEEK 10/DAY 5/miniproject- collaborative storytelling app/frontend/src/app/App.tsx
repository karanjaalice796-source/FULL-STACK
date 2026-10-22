import { Link, Outlet, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import NewStory from "./pages/NewStory"
import Signup from "./pages/Signup"
import StoryViewer from "./pages/StoryViewer"

function Layout() {
  return (
    <div className="desk">
      <Navbar />
      <main className="sheet">
        <Outlet />
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <>
      <h1>No page here</h1>
      <p className="note">That page seems to have been torn out.</p>
      <p><Link to="/">Back to the stories</Link></p>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/stories/new" element={<NewStory />} />
          <Route path="/stories/:id" element={<StoryViewer />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
