import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Example1 from './components/Example1.jsx'
import Example2 from './components/Example2.jsx'
import Example3 from './components/Example3.jsx'
import PostList from './components/PostList.jsx'
import PostJson from './components/PostJson.jsx'
import './App.css'

const lessons = [
  { number: '01', title: 'Router + boundaries', note: 'Catch & recover', to: '/' },
  { number: '02', title: 'Read JSON', note: 'Render a collection', to: '/posts' },
  { number: '03', title: 'Parse nested data', note: 'Map arrays in arrays', to: '/data' },
  { number: '04', title: 'Post JSON', note: 'Send a request', to: '/post-json' },
]

function Header() {
  const location = useLocation()
  const activeLesson = location.pathname === '/posts'
    ? '02'
    : location.pathname === '/data'
      ? '03'
      : location.pathname === '/post-json'
        ? '04'
        : '01'

  return (
    <header className="topbar">
      <NavLink className="wordmark" to="/" aria-label="React Fieldnotes home">
        <span className="brand-symbol" aria-hidden="true">f.</span>
        <span>FIELDNOTES<span className="brand-divider"> / </span>REACT</span>
      </NavLink>
      <div className="topbar-meta">
        <span className="live-indicator" />
        <span>INTERACTIVE WORKBOOK</span>
        <span className="edition">WEEK 08 · DAY 02</span>
      </div>
      <div className="mobile-edition">LAB 08.02 <span>·</span> {activeLesson} / 04</div>
    </header>
  )
}

function LessonNav() {
  const location = useLocation()

  return (
    <nav className="lesson-nav" aria-label="Exercises">
      <div className="nav-heading"><span>THE WORKBOOK</span><span>04</span></div>
      {lessons.map((lesson) => (
        <NavLink
          key={lesson.number}
          to={lesson.to}
          end={lesson.to === '/'}
          className={({ isActive }) => {
            const isRouterRoute = lesson.to === '/' && ['/profile', '/shop'].includes(location.pathname)
            return `lesson-link${isActive || isRouterRoute ? ' lesson-active' : ''}`
          }}
        >
          <span className="lesson-number">{lesson.number}</span>
          <span className="lesson-link-copy">
            <strong>{lesson.title}</strong>
            <small>{lesson.note}</small>
          </span>
          <span className="lesson-arrow" aria-hidden="true">↗</span>
        </NavLink>
      ))}
      <div className="nav-footnote">
        <span className="nav-rule" />
        <p>Follow the route.<br />Read the data.<br />See what happens.</p>
        <span className="footnote-mark" aria-hidden="true">✳</span>
      </div>
    </nav>
  )
}

function PageHeading({ number, label, title, accent, description, sideNote }) {
  return (
    <section className="page-heading">
      <div className="heading-copy">
        <p className="eyebrow"><span className="eyebrow-number">{number}</span>{label}</p>
        <h1>{title}<br /><em>{accent}</em></h1>
        <p className="heading-description">{description}</p>
      </div>
      <aside className="heading-side-note">
        <span className="side-note-mark" aria-hidden="true">✳</span>
        <p>{sideNote}</p>
      </aside>
    </section>
  )
}

function RouterTabs() {
  return (
    <nav className="router-tabs" aria-label="React Router demo pages">
      <span className="router-tabs-label">ROUTES</span>
      <NavLink to="/" end className={({ isActive }) => `router-tab${isActive ? ' router-tab-active' : ''}`}>01 <span>Home</span></NavLink>
      <NavLink to="/profile" className={({ isActive }) => `router-tab${isActive ? ' router-tab-active' : ''}`}>02 <span>Profile</span></NavLink>
      <NavLink to="/shop" className={({ isActive }) => `router-tab${isActive ? ' router-tab-active' : ''}`}>03 <span>Shop</span></NavLink>
      <span className="router-tabs-hint"><i /> EACH VIEW HAS ITS OWN BOUNDARY</span>
    </nav>
  )
}

function RouterFrame({ children }) {
  return (
    <>
      <PageHeading
        number="EXERCISE 01"
        label="REACT ROUTER + ERROR BOUNDARY"
        title="Routes can fail."
        accent="Your app shouldn't."
        description="Navigate between views, then visit the deliberately broken shop. A boundary catches the crash without taking down the rest of the workbook."
        sideNote={'Three routes.\nOne safety net.'}
      />
      <div className="demo-window">
        <div className="demo-window-top">
          <span className="window-dots"><i /><i /><i /></span>
          <span className="window-title">ROUTE PREVIEW <span>/</span> REACT ROUTER</span>
          <span className="window-live"><i /> LIVE</span>
        </div>
        <RouterTabs />
        <section className="router-view">{children}</section>
      </div>
      <div className="concept-strip">
        <span className="concept-label">WHAT YOU'LL LEARN</span>
        <span><b>React Router</b> changes the view</span>
        <span><b>Error Boundary</b> catches the crash</span>
        <span><b>React state</b> tracks the request</span>
        <span><b>Event handlers</b> send the payload</span>
        <span><b>JSON</b> renders and travels</span>
      </div>
    </>
  )
}

function HomeScreen() {
  return (
    <RouterFrame>
      <div className="screen-copy">
        <span className="screen-index">01 <span>—</span> HOME SCREEN</span>
        <h2>Welcome <em>home.</em></h2>
        <p>This is the home route. Use the links above to move between screens — the route changes, the app stays put.</p>
        <div className="screen-footer"><span className="screen-dot" /> ROUTE <code>/</code><span className="screen-footer-rule" /> COMPONENT <code>HomeScreen</code></div>
      </div>
      <div className="screen-art home-art" aria-hidden="true">
        <span className="orbit orbit-one" /><span className="orbit orbit-two" />
        <span className="orbit-core">R<span>↗</span></span>
        <span className="art-caption">A SMALL WORLD<br />OF COMPONENTS</span>
        <span className="art-coordinate">40° 43' 55.3" N</span>
      </div>
    </RouterFrame>
  )
}

function ProfileScreen() {
  return (
    <RouterFrame>
      <div className="screen-copy">
        <span className="screen-index">02 <span>—</span> PROFILE SCREEN</span>
        <h2>Good to<br /><em>see you.</em></h2>
        <p>The profile is its own route and its own component. Navigate away and come back — client-side routing keeps it seamless.</p>
        <div className="screen-footer"><span className="screen-dot" /> ROUTE <code>/profile</code><span className="screen-footer-rule" /> COMPONENT <code>ProfileScreen</code></div>
      </div>
      <div className="profile-card">
        <div className="profile-avatar">A<span>✳</span></div>
        <div className="profile-card-bottom"><span>YOUR PROFILE</span><b>ALICE<br />EXPLORER</b><span className="profile-card-id">MEMBER № 0042</span></div>
      </div>
    </RouterFrame>
  )
}

function ShopScreen() {
  throw new Error('ShopScreen intentionally crashed to demonstrate the ErrorBoundary.')
}

function NotFoundScreen() {
  return (
    <div className="simple-screen">
      <span className="screen-index">404 <span>—</span> LOST ROUTE</span>
      <h2>This page<br /><em>isn't here.</em></h2>
      <Link className="text-link" to="/">Back to the workbook <span>↗</span></Link>
    </div>
  )
}

function PostsPage() {
  return (
    <>
      <PageHeading
        number="EXERCISE 02"
        label="DISPLAY JSON DATA"
        title="A little content."
        accent="Already structured."
        description="Import a JSON file as data, map over its posts, and render the title and content of every object."
        sideNote={'JSON in.\nInterface out.'}
      />
      <PostList />
    </>
  )
}

function DataPage() {
  return (
    <>
      <PageHeading
        number="EXERCISE 03"
        label="DISPLAY + PARSE JSON"
        title="Look a little"
        accent="deeper."
        description="The same data, three different class components. Follow each nested array into social links, skills, and experience."
        sideNote={'Arrays inside\nof arrays.'}
      />
      <div className="parsed-data-grid">
        <section className="data-panel data-social"><Example1 /></section>
        <section className="data-panel data-skills"><Example2 /></section>
        <section className="data-panel data-experience"><Example3 /></section>
      </div>
    </>
  )
}

function PostJsonPage() {
  return (
    <>
      <PageHeading
        number="EXERCISE 04"
        label="POST JSON DATA"
        title="Send it"
        accent="somewhere."
        description="Enter a webhook.site URL to send a real POST request. Inspect the response here and the captured request on webhook.site."
        sideNote={'One click.\nA real request.'}
      />
      <PostJson />
    </>
  )
}

function Workspace() {
  return (
    <div className="app-shell">
      <Header />
      <div className="work-area">
        <LessonNav />
        <main className="lesson-panel">
          <Routes>
            <Route path="/" element={<ErrorBoundary><HomeScreen /></ErrorBoundary>} />
            <Route path="/profile" element={<ErrorBoundary><ProfileScreen /></ErrorBoundary>} />
            <Route path="/shop" element={<ErrorBoundary><ShopScreen /></ErrorBoundary>} />
            <Route path="/posts" element={<ErrorBoundary><PostsPage /></ErrorBoundary>} />
            <Route path="/data" element={<ErrorBoundary><DataPage /></ErrorBoundary>} />
            <Route path="/post-json" element={<ErrorBoundary><PostJsonPage /></ErrorBoundary>} />
            <Route path="*" element={<ErrorBoundary><NotFoundScreen /></ErrorBoundary>} />
          </Routes>
          <footer className="page-footer">
            <span>FIELDNOTES FOR THE CURIOUS</span>
            <span>REACT FUNDAMENTALS <i>✳</i> {new Date().getFullYear()}</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Workspace />
    </BrowserRouter>
  )
}
