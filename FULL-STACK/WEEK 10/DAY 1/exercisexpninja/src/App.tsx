import { useState } from 'react'
import ContactFormExercise from './components/ContactFormExercise'
import ContactsExercise from './components/ContactsExercise'
import FocusExercise from './components/FocusExercise'
import ProfileExercise from './components/ProfileExercise'
import SurveyExercise from './components/SurveyExercise'
import { ContactProvider } from './context/ContactContext'

const lessons = [
  { id: 'profile', number: '01', title: 'Profile reducer', time: '20 MIN' },
  { id: 'survey', number: '02', title: 'Survey feedback', time: '20 MIN' },
  { id: 'contact-form', number: '03', title: 'Form state', time: '15 MIN' },
  { id: 'context', number: '04', title: 'Shared context', time: '20 MIN' },
  { id: 'ref', number: '05', title: 'DOM refs', time: '10 MIN' },
]

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
    <div className="lesson-heading">
      <span className="lesson-number">{number}</span>
      <div>
        <div className="lesson-title-line"><h2>{title}</h2><span className="duration">{time}</span></div>
        <p>{description}</p>
      </div>
    </div>
  )
}

function App() {
  const [activeLesson, setActiveLesson] = useState('profile')

  return (
    <ContactProvider>
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Hooked home">
            <span className="brand-mark" aria-hidden="true">h<span>.</span></span>
            <span>hooked<span className="brand-light"> / lab</span></span>
          </a>
          <div className="topbar-meta">
            <span>REACT · TYPESCRIPT</span><i />
            <span>WEEK 10 <b>/</b> DAY 01</span>
            <span className="topbar-dot" />
          </div>
        </header>

        <div className="layout" id="top">
          <aside className="sidebar">
            <p className="sidebar-label">TODAY'S PLAYLIST</p>
            <nav aria-label="Exercise navigation">
              {lessons.map((lesson) => (
                <a className={activeLesson === lesson.id ? 'nav-link active' : 'nav-link'} href={`#${lesson.id}`} key={lesson.id} onClick={() => setActiveLesson(lesson.id)}>
                  <span className="nav-index">{lesson.number}</span><span>{lesson.title}</span>
                </a>
              ))}
            </nav>
            <div className="sidebar-card">
              <span aria-hidden="true">✳</span><p>Every state has a story.</p><span>Five hooks. One toolkit.</span>
            </div>
            <p className="sidebar-footer">BUILD · TRY · UNDERSTAND</p>
          </aside>

          <main className="main-content">
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow"><span /> YOUR REACT HOOKS WORKSHOP</p>
                <h1>State of the<br /><em>art.</em></h1>
                <p className="hero-description">
                  Five hands-on builds for handling state, sharing data, and talking to the DOM—with
                  TypeScript along for every step.
                </p>
                <a className="hero-cta" href="#profile">Start exploring <span aria-hidden="true">↓</span></a>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="art-ring ring-three" />
                <div className="art-core"><span>use</span><b>Hook</b></div>
                <span className="art-chip chip-one">useReducer <i>↗</i></span>
                <span className="art-chip chip-two">useContext</span>
                <span className="art-star">✳</span><span className="art-dot" />
              </div>
              <div className="hero-stats">
                <span><b>05</b> interactive exercises</span><i /><span><b>~85</b> minutes of practice</span><i /><span>Learn it by building <b>✦</b></span>
              </div>
            </section>

            <div className="path-heading">
              <div><p className="section-kicker">THE LEARNING PATH</p><h2>Build confidence, one hook at a time.</h2></div>
              <span className="path-note">SCROLL TO EXPLORE <b>↓</b></span>
            </div>

            <section className="lesson" id="profile">
              <SectionHeading number="01" title="A profile with a pulse" time="20 MIN" description="Model initial, loading, success, and error states with a typed reducer." />
              <div className="lesson-card">
                <div className="lesson-intro">
                  <div><p className="card-kicker">USEREDUCER · DISCRIMINATED UNIONS</p><h3>Keep every state in good shape.</h3></div>
                  <p>A reducer handles profile updates through explicit actions. Try saving, or type “error” as the name to see the error path.</p>
                </div>
                <ProfileExercise />
              </div>
            </section>

            <section className="lesson" id="survey">
              <SectionHeading number="02" title="Feedback, with flow" time="20 MIN" description="Guide a survey through initial, submitting, and completed states." />
              <div className="lesson-card">
                <div className="lesson-intro">
                  <div><p className="card-kicker">USEREDUCER · STATE TRANSITIONS</p><h3>A little feedback goes a long way.</h3></div>
                  <p>Start the survey, write a response, submit it, then reset to walk through the flow again.</p>
                </div>
                <SurveyExercise />
              </div>
            </section>

            <section className="lesson" id="contact-form">
              <SectionHeading number="03" title="Form state, all together" time="15 MIN" description="Update typed fields and reset a multi-field form using useReducer." />
              <div className="lesson-card">
                <div className="lesson-intro">
                  <div><p className="card-kicker">USEREDUCER · TYPED ACTIONS</p><h3>Every field has its own action.</h3></div>
                  <p>Dispatch a type-safe <code>updateField</code> action for each input, or reset the form back to its initial state.</p>
                </div>
                <ContactFormExercise />
              </div>
            </section>

            <section className="lesson" id="context">
              <SectionHeading number="04" title="Contacts without the prop chain" time="20 MIN" description="Share a reducer-managed contact list across nested components with context." />
              <div className="lesson-card context-lesson">
                <div className="lesson-intro">
                  <div><p className="card-kicker">USECONTEXT · GLOBAL STATE</p><h3>One provider. Shared everywhere.</h3></div>
                  <p>The list and nested add form both consume the same typed context—no contact props passed down the tree.</p>
                </div>
                <ContactsExercise />
              </div>
            </section>

            <section className="lesson last-lesson" id="ref">
              <SectionHeading number="05" title="A ref that knows where to focus" time="10 MIN" description="Safely reference an HTML input and interact with its DOM element." />
              <div className="lesson-card">
                <div className="lesson-intro">
                  <div><p className="card-kicker">USEREF · DOM ELEMENTS</p><h3>Direct your focus.</h3></div>
                  <p>Focus the input when the component mounts, then use the button to focus it again on demand.</p>
                </div>
                <FocusExercise />
              </div>
            </section>

            <footer className="page-footer"><span>HOOKED LAB <i>·</i> LEARN BY BUILDING</span><a href="#top">Back to top ↑</a></footer>
          </main>
        </div>
      </div>
    </ContactProvider>
  )
}

export default App
