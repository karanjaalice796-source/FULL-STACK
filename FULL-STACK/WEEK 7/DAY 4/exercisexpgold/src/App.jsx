import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import BootstrapCard from './BootstrapCard.jsx'

const celebrities = [
  {
    title: 'Bob Dylan',
    imageUrl: 'https://miro.medium.com/max/4800/1*_EDEWvWLREzlAvaQRfC_SQ.jpeg',
    buttonLabel: 'Go to Wikipedia',
    buttonUrl: 'https://en.wikipedia.org/wiki/Bob_Dylan',
    description:
      'Bob Dylan (born Robert Allen Zimmerman, May 24, 1941) is an American singer/songwriter, author, and artist who has been an influential figure in popular music and culture for more than five decades.',
  },
  {
    title: 'McCartney',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Paul_McCartney_in_October_2018.jpg/240px-Paul_McCartney_in_October_2018.jpg',
    buttonLabel: 'Go to Wikipedia',
    buttonUrl: 'https://en.wikipedia.org/wiki/Paul_McCartney',
    description:
      'Sir James Paul McCartney CH MBE (born 18 June 1942) is an English singer, songwriter, musician, composer, and record and film producer who gained worldwide fame as co-lead vocalist and bassist for the Beatles.',
  },
]

const planets = ['Mars', 'Venus', 'Jupiter', 'Earth', 'Saturn', 'Neptune']

function App() {
  return (
    <div className="gold-page">
      <header className="gold-header">
        <div className="container d-flex align-items-center justify-content-between">
          <a className="gold-brand" href="#top">GOLD / XP</a>
          <span className="header-label">WEEK 7 · DAY 4</span>
        </div>
      </header>

      <main id="top" className="container gold-content">
        <section aria-labelledby="voices-title">
          <div className="section-heading">
            <p className="section-kicker">01 / Icons in music</p>
            <h1 id="voices-title">The voices that shaped a generation.</h1>
          </div>
          <div className="row g-4 celebrity-grid">
            {celebrities.map((celebrity) => (
              <div className="col-12 col-lg-6" key={celebrity.title}>
                <BootstrapCard {...celebrity} />
              </div>
            ))}
          </div>
        </section>

        <section className="planet-section" aria-labelledby="planets-title">
          <div className="section-heading planet-heading">
            <p className="section-kicker">02 / Our neighborhood</p>
            <h2 id="planets-title">The planets</h2>
          </div>
          <ul className="list-group list-group-horizontal-lg planet-list">
            {planets.map((planet, index) => (
              <li className="list-group-item" key={planet}>
                <span className="planet-index">0{index + 1}</span>
                <span>{planet}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
