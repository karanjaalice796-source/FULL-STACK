import Counter from './components/Counter'
import Greeting from './components/Greeting'
import UserCard from './components/UserCard'
import UserList from './components/UserList'

const exercises = [
  { id: 'setup', number: '01', title: 'Project setup', time: '10 min' },
  { id: 'props', number: '02', title: 'Typed props', time: '15 min' },
  { id: 'state', number: '03', title: 'State with useState', time: '20 min' },
  { id: 'optional', number: '04', title: 'Optional props', time: '15 min' },
  { id: 'effect', number: '05', title: 'Data with useEffect', time: '20 min' },
]

function BrandIcon() {
  return (
    <span className="brand-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M16 3.5 28.5 10.75v10.5L16 28.5 3.5 21.25v-10.5L16 3.5Z" />
        <path d="m10.5 13 5.5-3.2 5.5 3.2M10.5 19l5.5 3.2 5.5-3.2M16 9.8v12.4" />
      </svg>
    </span>
  )
}

function SectionHeading({
  number,
  title,
  description,
  time,
}: {
  number: string
  title: string
  description: string
  time: string
}) {
  return (
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <div className="section-title-group">
        <div className="section-title-line">
          <h2>{title}</h2>
          <span className="time-pill">{time}</span>
        </div>
        <p>{description}</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="TypeScript Lab home">
          <BrandIcon />
          <span>little<span className="brand-accent">type</span> lab</span>
        </a>
        <div className="topbar-right">
          <span className="course-label">REACT · TYPESCRIPT</span>
          <span className="topbar-divider" />
          <span className="week-label">WEEK 10 <span>/</span> DAY 01</span>
          <span className="progress-mark" aria-label="Five exercises">
            <i /><i /><i /><i /><i />
          </span>
        </div>
      </header>

      <div className="workspace" id="top">
        <aside className="sidebar">
          <div className="sidebar-label">TODAY'S PLAYLIST</div>
          <nav aria-label="Exercise navigation">
            {exercises.map((exercise) => (
              <a
                className="nav-item"
                href={`#${exercise.id}`}
                key={exercise.id}
              >
                <span className="nav-number">{exercise.number}</span>
                <span className="nav-title">{exercise.title}</span>
              </a>
            ))}
          </nav>
          <div className="sidebar-note">
            <span className="note-sparkle" aria-hidden="true">✳</span>
            <p>Small steps, strong types.</p>
            <span>You're doing great.</span>
          </div>
          <div className="sidebar-bottom">BUILD · TRY · LEARN</div>
        </aside>

        <main className="main-content">
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span /> YOUR HANDS-ON WORKSHOP</div>
              <h1>Make React<br />feel <em>type-safe.</em></h1>
              <p className="hero-description">
                Five small exercises to turn TypeScript from “more syntax” into your new superpower.
                Learn by exploring the working examples below.
              </p>
              <a className="start-link" href="#setup">
                Let’s get started <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="art-orbit orbit-three" />
              <div className="art-sun">TS</div>
              <span className="art-star star-one">✳</span>
              <span className="art-star star-two">✦</span>
              <span className="art-dot dot-one" />
              <span className="art-dot dot-two" />
              <div className="floating-tag tag-props">props <span>✓</span></div>
              <div className="floating-tag tag-state">{'{ state }'}</div>
            </div>
            <div className="hero-footer">
              <span><strong>5</strong> bite-sized exercises</span>
              <span className="hero-footer-dot" />
              <span><strong>~80</strong> minutes</span>
              <span className="hero-footer-dot" />
              <span>One happy developer <span aria-hidden="true">↗</span></span>
            </div>
          </section>

          <div className="section-intro">
            <div>
              <p className="micro-label">THE LEARNING PATH</p>
              <h2>One concept at a time.</h2>
            </div>
            <span className="scroll-hint">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>
          </div>

          <section className="exercise-section" id="setup">
            <SectionHeading
              number="01"
              title="Start with a clean slate"
              time="10 MIN"
              description="Create a React + TypeScript project with Vite and get the dev server running."
            />
            <div className="exercise-card setup-card">
              <div className="setup-copy">
                <span className="card-eyebrow">YOUR FIRST STEP</span>
                <h3>A fresh canvas, ready to go.</h3>
                <p>Vite gives you a lightning-fast dev server, React builds the UI, and TypeScript helps catch mistakes as you write.</p>
                <ul className="check-list">
                  <li><span>✓</span> React + TypeScript template</li>
                  <li><span>✓</span> TypeScript config included</li>
                  <li><span>✓</span> Ready for hot reload</li>
                </ul>
              </div>
              <div className="terminal-card">
                <div className="terminal-top">
                  <div className="terminal-dots"><i /><i /><i /></div>
                  <span>YOUR TERMINAL</span>
                  <span className="terminal-shell">zsh</span>
                </div>
                <div className="terminal-body">
                  <p><span className="terminal-prompt">~</span> npm create vite@latest my-app</p>
                  <p className="terminal-output">◇ Select a framework: <b>React</b></p>
                  <p className="terminal-output">◇ Select a variant: <b>TypeScript</b></p>
                  <p><span className="terminal-prompt">~</span> cd my-app <span className="terminal-muted">&&</span> npm install</p>
                  <p><span className="terminal-prompt">~</span> npm run dev <span className="terminal-cursor" /></p>
                </div>
              </div>
            </div>
          </section>

          <section className="exercise-section" id="props">
            <SectionHeading
              number="02"
              title="Give your component a voice"
              time="15 MIN"
              description="Define a props interface and let TypeScript guide what your component needs."
            />
            <div className="exercise-card split-card">
              <div className="concept-copy">
                <span className="card-eyebrow">INTERFACES · PROPS</span>
                <h3>A little hello goes a long way.</h3>
                <p>Our <code>Greeting</code> component asks for a name and a message count. Try changing the values in <code>App.tsx</code> and see the typed props in action.</p>
                <div className="type-chip"><span className="chip-dot" /> GreetingProps <span className="chip-brace">{'{ name, messageCount }'}</span></div>
              </div>
              <div className="component-stage">
                <div className="stage-label">LIVE COMPONENT</div>
                <Greeting name="Alice" messageCount={3} />
              </div>
            </div>
          </section>

          <section className="exercise-section" id="state">
            <SectionHeading
              number="03"
              title="Make it interactive"
              time="20 MIN"
              description="Use useState with explicit types, and keep track of the last action."
            />
            <div className="exercise-card split-card counter-card">
              <div className="concept-copy">
                <span className="card-eyebrow">USESTATE · EVENT HANDLERS</span>
                <h3>One click. New state.</h3>
                <p>State is typed as a number, and every update uses the previous value safely. The action label is a union type—only known actions are allowed.</p>
                <div className="type-chip"><span className="chip-dot chip-mint" /> count: <span className="chip-brace">number</span></div>
              </div>
              <div className="component-stage counter-stage">
                <div className="stage-label">GIVE IT A GO</div>
                <Counter />
              </div>
            </div>
          </section>

          <section className="exercise-section" id="optional">
            <SectionHeading
              number="04"
              title="Make props more flexible"
              time="15 MIN"
              description="Mark props optional and provide friendly defaults when they aren't passed in."
            />
            <div className="exercise-card optional-card">
              <div className="concept-copy">
                <span className="card-eyebrow">OPTIONAL PROPS · DEFAULT VALUES</span>
                <h3>Same component, different people.</h3>
                <p>Every field on <code>UserCardProps</code> is optional. Pass your own details—or let the defaults do the work.</p>
                <div className="optional-examples">
                  <div><span className="example-check">✓</span><code>&lt;UserCard /&gt;</code><span className="example-note">defaults</span></div>
                  <div><span className="example-check">✓</span><code>&lt;UserCard name="Sam" /&gt;</code><span className="example-note">custom</span></div>
                </div>
              </div>
              <div className="user-card-stage">
                <UserCard />
                <UserCard name="Sam Rivera" age={24} role="Product designer" />
              </div>
            </div>
          </section>

          <section className="exercise-section last-exercise" id="effect">
            <SectionHeading
              number="05"
              title="Bring in the outside world"
              time="20 MIN"
              description="Fetch real data on mount, and show clear loading and error states."
            />
            <div className="exercise-card api-card">
              <div className="concept-copy api-copy">
                <span className="card-eyebrow">USEEFFECT · FETCH · ASYNC</span>
                <h3>A real list, from an API.</h3>
                <p>Users come from JSONPlaceholder. The response is typed, fetch errors are displayed, and an AbortController cleans up when the component unmounts.</p>
                <div className="api-endpoint"><span className="api-method">GET</span> jsonplaceholder.typicode.com/users</div>
              </div>
              <UserList />
            </div>
          </section>

          <footer className="page-footer">
            <span>YOU MADE IT THROUGH THE PLAYLIST <span aria-hidden="true">✦</span></span>
            <a href="#top">Back to top ↑</a>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
