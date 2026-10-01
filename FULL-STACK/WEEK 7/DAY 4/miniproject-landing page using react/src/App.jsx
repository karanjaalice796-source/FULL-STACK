import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import Header from './components/Header.jsx'
import ServiceCard from './components/ServiceCard.jsx'
import Contact from './components/Contact.jsx'
import './App.css'

const services = [
  {
    number: '01',
    title: 'Brand worlds',
    description:
      'Find the sharp idea at the heart of your business, then give it a voice and a visual identity people remember.',
    icon: 'spark',
    accent: 'moss',
  },
  {
    number: '02',
    title: 'Digital places',
    description:
      'Websites and digital products made to feel effortless, work beautifully, and bring the right people closer.',
    icon: 'web',
    accent: 'copper',
  },
  {
    number: '03',
    title: 'Good stories',
    description:
      'Thoughtful campaigns and content that turn what makes you different into something worth sharing.',
    icon: 'story',
    accent: 'blue',
  },
]

function App() {
  return (
    <div className="studio-site">
      <Header />

      <main>
        <section className="studio-hero" aria-labelledby="hero-title">
          <div className="container hero-content">
            <p className="hero-kicker">Independent creative studio · Est. 2016</p>
            <h1 id="hero-title">Morrow<br />Studio</h1>
            <div className="hero-bottom row align-items-end">
              <p className="col-md-7 hero-summary">
                We make brands, digital places, and stories for people building a more thoughtful world.
              </p>
              <a className="col-md-5 hero-link" href="#services">
                Explore what we do
                <span className="hero-link-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faArrowDown} />
                </span>
              </a>
            </div>
          </div>
          <span className="hero-coordinate" aria-hidden="true">40°43' N — 73°59' W</span>
        </section>

        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="container">
            <div className="section-head row align-items-end">
              <div className="col-lg-7">
                <p className="section-kicker">Small team, wide lens</p>
                <h2 id="services-title">Good work starts with a good question.</h2>
              </div>
              <p className="col-lg-4 offset-lg-1 section-aside">
                Strategy, design, and technology working together from the very first sketch.
              </p>
            </div>
            <div className="row service-grid">
              {services.map((service) => (
                <div className="col-md-4" key={service.number}>
                  <ServiceCard {...service} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <footer className="studio-footer">
        <div className="container d-flex justify-content-between align-items-center">
          <span>© 2026 MORROW STUDIO</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </div>
  )
}

export default App
