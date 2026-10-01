import { useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import './CarouselApp.css'

const destinations = [
  {
    name: 'Hong Kong',
    region: 'China',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/jrfyzvgzvhs1iylduuhj.jpg',
    note: 'Harbor lights, hillside paths, endless energy.',
  },
  {
    name: 'Macao',
    region: 'China',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/c1cklkyp6ms02tougufx.webp',
    note: 'Portuguese streets and old-world charm.',
  },
  {
    name: 'Japan',
    region: 'East Asia',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/e8fnw35p6zgusq218foj.webp',
    note: 'A quieter rhythm between city and tradition.',
  },
  {
    name: 'Las Vegas',
    region: 'United States',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/liw377az16sxmp9a6ylg.webp',
    note: 'Bright nights and a little desert drama.',
  },
]

function App() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="destination-page">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Elsewhere home">
          ELSEWHERE<span>.</span>
        </a>
        <span className="topbar-note">A SMALL ATLAS OF BIG PLACES</span>
        <span className="destination-count">04 DESTINATIONS</span>
      </header>

      <main id="top" className="container destination-main">
        <div className="row align-items-end page-intro">
          <div className="col-md-8">
            <p className="eyebrow">Next stop, anywhere</p>
            <h1>Places that stay with you.</h1>
          </div>
          <p className="col-md-4 intro-aside">
            City guide <span aria-hidden="true">/</span> 0{activeIndex + 1} — 04
          </p>
        </div>

        <section className="carousel-wrap" aria-label="Destination carousel">
          <Carousel
            className="destination-carousel"
            selectedItem={activeIndex}
            onChange={setActiveIndex}
            showArrows
            showStatus={false}
            showIndicators={false}
            showThumbs
            infiniteLoop
            swipeable
            emulateTouch
            renderArrowPrev={(clickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow-prev"
                  onClick={clickHandler}
                  aria-label={label}
                >
                  <span aria-hidden="true">&#8592;</span>
                </button>
              )
            }
            renderArrowNext={(clickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow-next"
                  onClick={clickHandler}
                  aria-label={label}
                >
                  <span aria-hidden="true">&#8594;</span>
                </button>
              )
            }
            renderThumbs={() =>
              destinations.map((destination) => (
                <img
                  key={destination.name}
                  src={destination.image}
                  alt={destination.name}
                />
              ))
            }
          >
            {destinations.map((destination, index) => (
              <article className="destination-slide" key={destination.name}>
                <img
                  src={destination.image}
                  alt={`${destination.name} city view`}
                />
                <div className="slide-caption">
                  <div>
                    <p className="slide-region">{destination.region}</p>
                    <h2>{destination.name}</h2>
                    <p className="slide-note">{destination.note}</p>
                  </div>
                  <span className="slide-number">0{index + 1} / 04</span>
                </div>
              </article>
            ))}
          </Carousel>
        </section>
      </main>

      <footer className="page-footer">
        <span>FOUR WINDOWS ON THE WORLD</span>
        <span>MADE FOR THE LONG WAY ROUND</span>
      </footer>
    </div>
  )
}

export default App