import { useEffect, useState } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowRight, Cloud, CloudDrizzle, CloudFog, CloudLightning,
  CloudRain, CloudSnow, CloudSun, Droplets, Heart, MapPin, Search, Sun, Thermometer,
  Trash2, Wind,
} from 'lucide-react'

const FAVORITES_KEY = 'isobar.saved-cities'
const defaultCity = {
  id: 'nairobi-kenya',
  name: 'Nairobi',
  admin1: 'Nairobi County',
  country: 'Kenya',
  latitude: -1.2864,
  longitude: 36.8172,
}

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function cityFromResult(result) {
  return {
    id: String(result.id ?? `${result.latitude},${result.longitude}`),
    name: result.name,
    admin1: result.admin1 ?? '',
    country: result.country ?? '',
    latitude: result.latitude,
    longitude: result.longitude,
  }
}

function weatherDescription(code) {
  if (code === 0) return 'Clear sky'
  if (code === 1) return 'Mostly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code === 45 || code === 48) return 'Foggy'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Light drizzle'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain showers'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowfall'
  if ([95, 96, 99].includes(code)) return 'Thunderstorms'
  return 'Changing skies'
}

function WeatherIcon({ code, size = 24, className = '' }) {
  let Icon = CloudSun
  if (code === 0 || code === 1) Icon = Sun
  else if (code === 3) Icon = Cloud
  else if (code === 45 || code === 48) Icon = CloudFog
  else if ([51, 53, 55, 56, 57].includes(code)) Icon = CloudDrizzle
  else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) Icon = CloudRain
  else if ([71, 73, 75, 77, 85, 86].includes(code)) Icon = CloudSnow
  else if ([95, 96, 99].includes(code)) Icon = CloudLightning

  return <Icon className={className} size={size} strokeWidth={1.5} aria-hidden="true" />
}

function formatDay(dateString, index) {
  if (index === 0) return 'Today'
  return new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${dateString}T12:00:00`))
}

function SearchBox({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchMessage, setSearchMessage] = useState('')

  useEffect(() => {
    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 2) {
      setResults([])
      setSearching(false)
      return undefined
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      setSearching(true)
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedQuery)}&count=6&language=en&format=json`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error('Search is unavailable.')
        const data = await response.json()
        setResults((data.results ?? []).map(cityFromResult))
        setSearchMessage('')
      } catch (error) {
        if (error.name !== 'AbortError') setSearchMessage('City search is unavailable right now.')
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 280)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [query])

  async function submitSearch(event) {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return
    if (results.length) {
      onSelect(results[0])
      setQuery('')
      setResults([])
      return
    }

    setSearching(true)
    setSearchMessage('')
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedQuery)}&count=1&language=en&format=json`,
      )
      if (!response.ok) throw new Error('City search is unavailable.')
      const data = await response.json()
      if (!data.results?.length) {
        setSearchMessage('No matching city found. Try another spelling.')
        return
      }
      onSelect(cityFromResult(data.results[0]))
      setQuery('')
      setResults([])
    } catch {
      setSearchMessage('City search is unavailable right now.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="search-wrap">
      <form className="city-search" onSubmit={submitSearch} role="search">
        <Search size={18} strokeWidth={1.7} aria-hidden="true" />
        <label className="visually-hidden" htmlFor="city-search">Search for a city</label>
        <input
          id="city-search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search city or town"
        />
        {searching && <span className="search-status">Searching</span>}
        <button type="submit" aria-label="Search cities"><ArrowRight size={17} /></button>
      </form>
      {results.length > 0 && (
        <ul className="search-results" aria-label="City suggestions">
          {results.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(city)
                  setQuery('')
                  setResults([])
                }}
              >
                <MapPin size={15} aria-hidden="true" />
                <span><strong>{city.name}</strong><small>{[city.admin1, city.country].filter(Boolean).join(', ')}</small></span>
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {searchMessage && <p className="search-message" role="status">{searchMessage}</p>}
    </div>
  )
}

function ForecastStrip({ daily }) {
  if (!daily?.time?.length) return null

  return (
    <section className="forecast-section" aria-labelledby="forecast-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE DAYS AHEAD</p>
          <h2 id="forecast-title">Five-day outlook</h2>
        </div>
        <span className="forecast-unit">°C</span>
      </div>
      <div className="forecast-grid">
        {daily.time.map((day, index) => (
          <article className={`forecast-day${index === 0 ? ' is-today' : ''}`} key={day}>
            <span className="day-name">{formatDay(day, index)}</span>
            <WeatherIcon code={daily.weather_code[index]} size={25} className="forecast-icon" />
            <span className="day-description">{weatherDescription(daily.weather_code[index])}</span>
            <div className="day-temperatures">
              <strong>{Math.round(daily.temperature_2m_max[index])}°</strong>
              <span>{Math.round(daily.temperature_2m_min[index])}°</span>
            </div>
            {daily.precipitation_probability_max?.[index] > 0 && (
              <span className="rain-chance"><Droplets size={11} /> {daily.precipitation_probability_max[index]}%</span>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function WeatherDetails({ current }) {
  const details = [
    { label: 'FEELS LIKE', value: `${Math.round(current.apparent_temperature)}°`, Icon: Thermometer },
    { label: 'HUMIDITY', value: `${current.relative_humidity_2m}%`, Icon: Droplets },
    { label: 'WIND', value: `${Math.round(current.wind_speed_10m)} km/h`, Icon: Wind },
    { label: 'PRECIPITATION', value: `${current.precipitation} mm`, Icon: ArrowDown },
  ]

  return (
    <section className="details-section" aria-label="Current weather details">
      {details.map(({ label, value, Icon }) => (
        <article className="detail-item" key={label}>
          <Icon size={16} strokeWidth={1.6} aria-hidden="true" />
          <span className="detail-label">{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </section>
  )
}

function WeatherPage({ city, weather, loading, error, onRetry, favorite, onToggleFavorite }) {
  const current = weather?.current
  const daily = weather?.daily

  return (
    <>
      <div className="page-intro">
        <div>
          <p className="eyebrow"><span>01</span> / LOCAL CONDITIONS</p>
          <h1>Weather, in view.</h1>
        </div>
        <p className="updated-note">{current ? `Updated ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(current.time))}` : 'LIVE CONDITIONS'}</p>
      </div>

      <section className="current-weather" aria-label={`Current weather in ${city.name}`}>
        <div className="weather-copy">
          <div className="location-line"><MapPin size={15} /> {[city.name, city.country].filter(Boolean).join(', ')}</div>
          {loading && !current ? (
            <div className="weather-loading" role="status">Finding the forecast<span>…</span></div>
          ) : current ? (
            <>
              <div className="temperature-line"><span>{Math.round(current.temperature_2m)}</span><sup>°</sup><small>C</small></div>
              <p className="condition-text">{weatherDescription(current.weather_code)}</p>
              <p className="high-low">H {Math.round(daily.temperature_2m_max[0])}° <span>/</span> L {Math.round(daily.temperature_2m_min[0])}°</p>
            </>
          ) : (
            <div className="weather-loading">Weather is unavailable</div>
          )}
        </div>
        <div className="weather-art" aria-hidden="true">
          {current && <WeatherIcon code={current.weather_code} size={112} className="hero-weather-icon" />}
          {current?.is_day === 0 && <span className="night-label">AFTER DARK</span>}
        </div>
        <button
          className={`favorite-toggle${favorite ? ' is-favorite' : ''}`}
          type="button"
          aria-pressed={favorite}
          aria-label={favorite ? 'Remove city from favorites' : 'Save city to favorites'}
          onClick={onToggleFavorite}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
          <span>{favorite ? 'Saved' : 'Save place'}</span>
        </button>
      </section>

      {error && (
        <div className="weather-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      )}

      {current && <WeatherDetails current={current} />}
      {daily && <ForecastStrip daily={daily} />}
      {loading && current && <p className="refreshing-note" role="status">Refreshing forecast…</p>}
    </>
  )
}

function FavoritesPage({ favorites, onSelect, onRemove }) {
  return (
    <section className="favorites-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow"><span>02</span> / YOUR PLACES</p>
          <h1>Saved places.</h1>
        </div>
        <span className="favorites-count">{favorites.length} {favorites.length === 1 ? 'PLACE' : 'PLACES'}</span>
      </div>

      {favorites.length ? (
        <ul className="favorites-grid">
          {favorites.map((city) => (
            <li className="favorite-card" key={city.id}>
              <button className="favorite-place" type="button" onClick={() => onSelect(city)}>
                <span className="favorite-map-icon"><MapPin size={17} /></span>
                <span className="favorite-place-copy">
                  <strong>{city.name}</strong>
                  <small>{[city.admin1, city.country].filter(Boolean).join(', ')}</small>
                </span>
                <ArrowRight size={17} className="favorite-arrow" />
              </button>
              <button
                className="remove-favorite"
                type="button"
                aria-label={`Remove ${city.name} from favorites`}
                title="Remove from favorites"
                onClick={() => onRemove(city.id)}
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="favorites-empty">
          <span className="empty-heart"><Heart size={21} /></span>
          <h2>Your map starts here.</h2>
          <p>Save a city from its weather page and it will be waiting here.</p>
          <button type="button" onClick={() => onSelect(null)}><ArrowLeft size={15} /> Back to weather</button>
        </div>
      )}
    </section>
  )
}

export default function App() {
  const [page, setPage] = useState('weather')
  const [city, setCity] = useState(defaultCity)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState(readFavorites)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch {
      setError('Favorites could not be saved in this browser.')
    }
  }, [favorites])

  useEffect(() => {
    const controller = new AbortController()
    async function loadWeather() {
      setLoading(true)
      setError('')
      const url = new URL('https://api.open-meteo.com/v1/forecast')
      url.search = new URLSearchParams({
        latitude: city.latitude,
        longitude: city.longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: '5',
      }).toString()

      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error('Weather data could not be loaded. Please try again.')
        const data = await response.json()
        setWeather(data)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(fetchError.message || 'Weather data could not be loaded.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadWeather()
    return () => controller.abort()
  }, [city, reload])

  const favorite = favorites.some((savedCity) => savedCity.id === city.id)

  function toggleFavorite() {
    setFavorites((previous) => favorite
      ? previous.filter((savedCity) => savedCity.id !== city.id)
      : [city, ...previous])
  }

  function selectCity(nextCity) {
    if (nextCity) setCity(nextCity)
    setPage('weather')
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#weather" onClick={() => setPage('weather')} aria-label="Isobar weather home">
          <span className="brand-mark"><span /></span>
          <span>ISOBAR<span className="brand-divider">/</span>WEATHER</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={page === 'weather' ? 'is-active' : ''} type="button" aria-current={page === 'weather' ? 'page' : undefined} onClick={() => setPage('weather')}>Weather</button>
          <button className={page === 'favorites' ? 'is-active' : ''} type="button" aria-current={page === 'favorites' ? 'page' : undefined} onClick={() => setPage('favorites')}>
            Favorites <span>{favorites.length}</span>
          </button>
        </nav>
      </header>

      <div className="search-area">
        <SearchBox onSelect={selectCity} />
        <p className="search-hint">CITY, TOWN, OR POSTAL AREA</p>
      </div>

      {page === 'weather' ? (
        <WeatherPage
          city={city}
          weather={weather}
          loading={loading}
          error={error}
          onRetry={() => setReload((value) => value + 1)}
          favorite={favorite}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <FavoritesPage
          favorites={favorites}
          onSelect={selectCity}
          onRemove={(id) => setFavorites((previous) => previous.filter((savedCity) => savedCity.id !== id))}
        />
      )}

      <footer className="site-footer">
        <span>ISOBAR <i>·</i> WEATHER FOR THE PLACES YOU KEEP</span>
        <span>DATA BY OPEN-METEO</span>
      </footer>
    </main>
  )
}