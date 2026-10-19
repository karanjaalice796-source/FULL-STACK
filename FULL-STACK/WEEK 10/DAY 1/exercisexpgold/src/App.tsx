import { useMemo, useState } from 'react'
import DataTable, { type TableColumn } from './components/DataTable'
import RegistrationForm from './components/RegistrationForm'
import UserCacheDemo from './components/UserCacheDemo'

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  status: 'Active' | 'Away' | 'Invited'
}

const teamMembers: TeamMember[] = [
  { id: 1, name: 'Amara Okafor', email: 'amara@studio.co', role: 'Design lead', status: 'Active' },
  { id: 2, name: 'Noah Williams', email: 'noah@studio.co', role: 'Engineer', status: 'Active' },
  { id: 3, name: 'Sofia Chen', email: 'sofia@studio.co', role: 'Product', status: 'Away' },
  { id: 4, name: 'Ethan Patel', email: 'ethan@studio.co', role: 'Engineer', status: 'Active' },
  { id: 5, name: 'Maya Laurent', email: 'maya@studio.co', role: 'Research', status: 'Invited' },
]

const columns: TableColumn<TeamMember>[] = [
  { key: 'name', title: 'NAME', sortable: true },
  { key: 'email', title: 'EMAIL', sortable: true },
  { key: 'role', title: 'ROLE', sortable: true },
  {
    key: 'status',
    title: 'STATUS',
    sortable: true,
    render: (status) => (
      <span className={`member-status status-${String(status).toLowerCase()}`}>
        <i />{status}
      </span>
    ),
  },
]

function App() {
  const [memberFilter, setMemberFilter] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([])
  const [activeSection, setActiveSection] = useState('form')

  const selectedSummary = useMemo(() => {
    if (selectedMembers.length === 0) return 'Select rows to try the typed selection callback.'
    return `${selectedMembers.length} selected: ${selectedMembers.map((member) => member.name.split(' ')[0]).join(', ')}`
  }, [selectedMembers])

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Typecraft home">
          <span className="brand-mark" aria-hidden="true">t<span>.</span></span>
          <span>typecraft<span className="brand-light"> / lab</span></span>
        </a>
        <div className="topbar-meta">
          <span>REACT + TYPESCRIPT</span><i />
          <span>WEEK 10 <b>/</b> DAY 01</span>
          <span className="topbar-dot" />
        </div>
      </header>

      <div className="layout" id="top">
        <aside className="sidebar">
          <p className="sidebar-label">TODAY'S WORKSHOP</p>
          <nav aria-label="Exercise navigation">
            <a className={activeSection === 'form' ? 'nav-link active' : 'nav-link'} href="#form" onClick={() => setActiveSection('form')}>
              <span className="nav-index">01</span><span>Custom form hook</span>
            </a>
            <a className={activeSection === 'table' ? 'nav-link active' : 'nav-link'} href="#table" onClick={() => setActiveSection('table')}>
              <span className="nav-index">02</span><span>Generic data table</span>
            </a>
            <a className={activeSection === 'cache' ? 'nav-link active' : 'nav-link'} href="#cache" onClick={() => setActiveSection('cache')}>
              <span className="nav-index">03</span><span>Fetch & cache</span>
            </a>
          </nav>
          <div className="sidebar-card">
            <span className="sidebar-flower" aria-hidden="true">✳</span>
            <p>Types that scale.</p>
            <span>Reusable by design.</span>
          </div>
          <p className="sidebar-footer">BUILD SOMETHING THOUGHTFUL</p>
        </aside>

        <main className="main-content">
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow"><span /> ADVANCED REACT PATTERNS</p>
              <h1>Make complex<br />feel <em>composable.</em></h1>
              <p className="hero-description">
                Three practical patterns for building interfaces that are reusable, type-safe,
                and ready to grow with you.
              </p>
              <a href="#form" className="hero-cta">Explore the workshop <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="art-ring ring-three" />
              <div className="art-core"><span>&lt;</span><i>TS</i><span>/&gt;</span></div>
              <span className="art-chip chip-hook">useForm <b>↗</b></span>
              <span className="art-chip chip-generic">&lt;T&gt;</span>
              <span className="art-star">✳</span><span className="art-dot" />
            </div>
            <div className="hero-stats">
              <span><b>03</b> hands-on builds</span><i />
              <span><b>75</b> minutes of practice</span><i />
              <span>One more confident you <b>✦</b></span>
            </div>
          </section>

          <div className="path-heading">
            <div><p className="section-kicker">THE LEARNING PATH</p><h2>Three patterns. Real practice.</h2></div>
            <span className="path-note">SCROLL TO EXPLORE <b>↓</b></span>
          </div>

          <section className="lesson" id="form">
            <div className="lesson-heading">
              <span className="lesson-number">01</span>
              <div><div className="lesson-title-line"><h2>A form hook of your own</h2><span className="duration">20 MIN</span></div>
                <p>Reusable state, field-level validation, and clear submission feedback.</p></div>
            </div>
            <div className="lesson-card form-lesson">
              <div className="lesson-copy">
                <p className="card-kicker">CUSTOM HOOKS · VALIDATION</p>
                <h3>Good forms feel effortless.</h3>
                <p><code>useForm&lt;T&gt;</code> keeps the values, errors, and submit state together. Try the built-in validation—or use <code>@error.test</code> to see the submission error.</p>
                <div className="code-note"><span /> TYPED VALUES <b>·</b> EMAIL <b>·</b> PASSWORD</div>
              </div>
              <div className="form-demo">
                <div className="demo-caption">CREATE YOUR ACCOUNT</div>
                <RegistrationForm />
              </div>
            </div>
          </section>

          <section className="lesson" id="table">
            <div className="lesson-heading">
              <span className="lesson-number">02</span>
              <div><div className="lesson-title-line"><h2>A table that knows its types</h2><span className="duration">25 MIN</span></div>
                <p>One generic component, configurable columns, sorting, filtering, and selection.</p></div>
            </div>
            <div className="lesson-card table-lesson">
              <div className="table-toolbar">
                <div><p className="card-kicker">STUDIO DIRECTORY</p><h3>Team members <span>{teamMembers.length}</span></h3></div>
                <label className="table-search">
                  <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.8" /><path d="m13.2 13.2 4 4" /></svg>
                  <input value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)} placeholder="Filter team..." aria-label="Filter team members" />
                </label>
              </div>
              <DataTable<TeamMember>
                data={teamMembers}
                columns={columns}
                filterText={memberFilter}
                onSelect={setSelectedMembers}
              />
              <div className="selection-footer"><span className="selection-mark">✓</span>{selectedSummary}</div>
            </div>
          </section>

          <section className="lesson last-lesson" id="cache">
            <div className="lesson-heading">
              <span className="lesson-number">03</span>
              <div><div className="lesson-title-line"><h2>Fetch once. Remember it.</h2><span className="duration">30 MIN</span></div>
                <p>Cache API results, handle every request state, and refresh whenever you need.</p></div>
            </div>
            <div className="lesson-card cache-lesson">
              <div className="lesson-copy cache-copy">
                <p className="card-kicker">CUSTOM HOOKS · API · CACHE</p>
                <h3>Meet the community.</h3>
                <p>This request is cached for five minutes. Refresh bypasses the cache; clearing it removes the saved response and fetches a fresh one.</p>
                <div className="cache-key"><span className="cache-key-dot" /> KEYED BY REQUEST URL</div>
              </div>
              <UserCacheDemo />
            </div>
          </section>

          <footer className="page-footer">
            <span>TYPECRAFT LAB <i>·</i> BUILT WITH CARE, AND TYPES</span>
            <a href="#top">Back to top ↑</a>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
