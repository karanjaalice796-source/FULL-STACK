import { useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'

const categories = ['mountain', 'beaches', 'birds', 'food']
const pageSize = 30

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const query = searchTerm.trim()

    if (query) {
      navigate(`/search/${encodeURIComponent(query)}`)
    }
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} role="search">
      <label className="visually-hidden" htmlFor="gallery-search">
        Search photos
      </label>
      <input
        id="gallery-search"
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search for photos..."
      />
      <button type="submit" aria-label="Search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>
      </button>
    </form>
  )
}

function Gallery({ category }) {
  const { query: searchQuery } = useParams()
  const query = searchQuery || category
  const title = searchQuery ? `Search results for “${query}”` : `${category} photography`
  const [pagination, setPagination] = useState({
    query: '',
    offsets: [undefined],
    page: 1,
  })
  const pageState = pagination.query === query
    ? pagination
    : { query, offsets: [undefined], page: 1 }
  const activeOffset = pageState.offsets[pageState.page - 1]
  const [images, setImages] = useState([])
  const [nextOffset, setNextOffset] = useState(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: query,
      gsrnamespace: '6',
      gsrlimit: String(pageSize),
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '640',
      format: 'json',
      origin: '*',
    })
    if (activeOffset !== undefined) {
      params.set('gsroffset', String(activeOffset))
    }

    async function loadImages() {
      setIsLoading(true)
      setError('')
      setImages([])
      setNextOffset(undefined)

      try {
        const response = await fetch(
          `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Image search failed (${response.status}). Please try again.`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error.info || 'Image search failed. Please try again.')
        }

        const results = Object.values(data.query?.pages ?? {})
          .sort((left, right) => left.index - right.index)
          .map((image) => {
            const info = image.imageinfo?.[0]
            return info?.thumburl
              ? {
                  id: image.pageid,
                  title: image.title.replace(/^File:/, '').replace(/\.[^.]+$/, '').replaceAll('_', ' '),
                  imageUrl: info.thumburl,
                  sourceUrl: info.descriptionurl,
                }
              : null
          })
          .filter(Boolean)

        setImages(results)
        setNextOffset(data.continue?.gsroffset)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load images. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadImages()
    return () => controller.abort()
  }, [query, pageState.page, activeOffset, retryCount])

  function goToPage(nextPage) {
    const current = pageState
    setPagination({
      ...current,
      page: nextPage,
      offsets: nextPage > current.page
        ? current.offsets.slice(0, current.page).concat(nextOffset)
        : current.offsets.slice(0, nextPage),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="gallery">
      <div className="gallery-heading">
        <div>
          <p className="eyebrow">{searchQuery ? 'YOUR SEARCH' : 'EXPLORE THE COLLECTION'}</p>
          <h1>{title}</h1>
          <p className="gallery-description">
            {searchQuery
              ? `A little inspiration for your search for ${query}.`
              : `A handpicked window into the world of ${category}.`}
          </p>
        </div>
        <span className="photo-count">
          {isLoading ? 'Finding photos…' : `${images.length} photos`}
        </span>
      </div>

      {error && (
        <div className="notice error-notice" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setRetryCount((count) => count + 1)}>
            Try again
          </button>
        </div>
      )}

      {isLoading && (
        <div className="loading-state" role="status">
          <span className="spinner" aria-hidden="true" />
          <p>Gathering a little inspiration…</p>
        </div>
      )}

      {!isLoading && !error && images.length === 0 && (
        <div className="notice empty-notice">
          <h2>No photos found just yet</h2>
          <p>Try another search, or explore one of the collections above.</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="image-grid">
          {images.map((image) => (
            <a
              className="image-card"
              href={image.sourceUrl}
              target="_blank"
              rel="noreferrer"
              key={image.id}
              aria-label={`View source for ${image.title}`}
            >
              <img src={image.imageUrl} alt={image.title} loading="lazy" />
              <span className="image-caption">
                <span>{image.title}</span>
                <span className="source-arrow" aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      )}

      {!isLoading && !error && (pageState.page > 1 || nextOffset !== undefined) && (
        <nav className="pagination" aria-label="Gallery pages">
          <button
            type="button"
            onClick={() => goToPage(pageState.page - 1)}
            disabled={pageState.page === 1}
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          <span>Page {pageState.page}</span>
          <button
            type="button"
            onClick={() => goToPage(pageState.page + 1)}
            disabled={nextOffset === undefined}
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </nav>
      )}
    </main>
  )
}

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/mountain" aria-label="SnapShot home">
          <span className="brand-mark" aria-hidden="true">s.</span>
          <span>snap<span className="brand-light">shot</span></span>
        </NavLink>
        <SearchBar />
        <span className="header-note">A little visual inspiration</span>
      </header>

      <nav className="category-nav" aria-label="Photo categories">
        {categories.map((item) => (
          <NavLink
            className={({ isActive }) => `category-link${isActive ? ' active' : ''}`}
            to={`/${item}`}
            key={item}
          >
            {item}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/mountain" replace />} />
        {categories.map((category) => (
          <Route
            path={`/${category}`}
            element={<Gallery category={category} />}
            key={category}
          />
        ))}
        <Route path="/search/:query" element={<Gallery />} />
        <Route path="*" element={<Navigate to="/mountain" replace />} />
      </Routes>

      <footer className="site-footer">
        Photos from <a href="https://commons.wikimedia.org/" target="_blank" rel="noreferrer">Wikimedia Commons</a>
        <span> · </span>
        Made for curious eyes
      </footer>
    </div>
  )
}

export default App
