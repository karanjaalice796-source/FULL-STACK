import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import BookList, { shelves } from './features/books/BookList.jsx'
import { selectBooks } from './features/books/booksSelectors.js'
import './App.css'

const money = (amount) => `KSh ${amount.toLocaleString('en-KE')}`

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M7 10.5c5.1-1.2 9.4-.2 13 2.6v19c-3.6-2.8-7.9-3.8-13-2.6v-19Z" />
        <path d="M33 10.5c-5.1-1.2-9.4-.2-13 2.6v19c3.6-2.8 7.9-3.8 13-2.6v-19Z" />
        <path d="M11 15.5c2.3-.3 4.2.1 6 1.1M11 20c2.3-.3 4.2.1 6 1.1M29 15.5c-2.3-.3-4.2.1-6 1.1M29 20c-2.3-.3-4.2.1-6 1.1" />
      </svg>
    </span>
  )
}

function BasketPanel({ books, basket, onChangeQuantity, onClose }) {
  const items = Object.entries(basket)
    .map(([id, quantity]) => ({
      book: books.find((book) => book.id === Number(id)),
      quantity,
    }))
    .filter((item) => item.book)
  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

  return (
    <div className="basket-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <aside className="basket-panel" role="dialog" aria-modal="true" aria-labelledby="basket-title">
        <div className="basket-heading">
          <div>
            <span className="small-label">YOUR PICKS</span>
            <h2 id="basket-title">Your basket <span>({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2>
          </div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close basket">×</button>
        </div>
        {items.length ? (
          <>
            <div className="basket-items">
              {items.map(({ book, quantity }) => (
                <article className="basket-item" key={book.id}>
                  <img src={`https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`} alt="" />
                  <div className="basket-item-info">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <strong>{money(book.price)}</strong>
                  </div>
                  <div className="quantity-control" aria-label={`Quantity of ${book.title}`}>
                    <button type="button" onClick={() => onChangeQuantity(book.id, -1)} aria-label={`Remove one ${book.title}`}>−</button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => onChangeQuantity(book.id, 1)} aria-label={`Add one ${book.title}`}>+</button>
                  </div>
                </article>
              ))}
            </div>
            <div className="basket-summary">
              <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              <p>Delivery is worked out at checkout.</p>
              <button className="checkout-button" type="button" disabled>
                Checkout <span aria-hidden="true">→</span>
              </button>
              <p className="demo-note">This is a shop preview. Connect checkout to accept payments.</p>
            </div>
          </>
        ) : (
          <div className="basket-empty">
            <span className="empty-book-icon" aria-hidden="true">＋</span>
            <h3>Your next good read goes here.</h3>
            <p>Choose a book from the shelves to get started.</p>
            <button type="button" onClick={onClose}>Keep browsing</button>
          </div>
        )}
      </aside>
    </div>
  )
}

export default function App() {
  const [genre, setGenre] = useState('all')
  const [search, setSearch] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [basket, setBasket] = useState({})
  const [basketOpen, setBasketOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const books = useSelector(selectBooks)
  const basketCount = Object.values(basket).reduce((sum, count) => sum + count, 0)

  const addToBasket = (book) => {
    if (!book.available) return
    setBasket((current) => ({ ...current, [book.id]: (current[book.id] || 0) + 1 }))
    setNotice(`${book.title} added to your basket`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  const changeQuantity = (id, change) => {
    setBasket((current) => {
      const quantity = (current[id] || 0) + change
      if (quantity <= 0) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: quantity }
    })
  }

  const featuredBooks = useMemo(() => books.slice(0, 3), [books])

  return (
    <main className="shop-page">
      <div className="announcement">
        <span>Independent books, picked with care</span>
        <span className="announcement-divider" />
        <span>Free local delivery on orders over KSh 3,000</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="The Reading Room home">
          <BrandMark />
          <span className="brand-name">The Reading Room</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-current" href="#shop">Shop books</a>
          <a href="#about">About us</a>
        </nav>
        <div className="header-actions">
          <div className={`header-search ${mobileSearchOpen ? 'is-open' : ''}`}>
            <button
              className="search-toggle"
              type="button"
              aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
              aria-expanded={mobileSearchOpen}
              onClick={() => setMobileSearchOpen((open) => !open)}
            >
              <svg viewBox="0 0 20 20" fill="none"><circle cx="8.7" cy="8.7" r="5.8" /><path d="m13 13 4 4" /></svg>
            </button>
            <label className="visually-hidden" htmlFor="book-search">Search books</label>
            <input
              id="book-search"
              type="search"
              placeholder="Find a book or author"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <button className="basket-button" type="button" onClick={() => setBasketOpen(true)} aria-label={`Open basket, ${basketCount} items`}>
            <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M4 7.5h14l-1.1 11H5.1L4 7.5Z" />
              <path d="M8 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span>Basket</span>
            <span className="basket-count">{basketCount}</span>
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="hero-kicker"><span /> A BOOKSHOP FOR CURIOUS READERS</span>
          <h1>Find a book<br />you’ll <em>carry with you.</em></h1>
          <p>Good stories, thoughtful picks, and the pleasure of finding just the right one.</p>
          <a className="hero-button" href="#shop">Browse the books <span aria-hidden="true">→</span></a>
          <span className="hero-footnote">A small, independent bookshop. Welcome in.</span>
        </div>
        <div className="hero-books" aria-label="A few books from our shelves">
          <span className="hero-side-note">A FEW THINGS<br />WE’VE BEEN READING</span>
          {featuredBooks.map((book, index) => (
            <div className={`hero-book hero-book-${index + 1}`} key={book.id}>
              <img src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`} alt={`Cover of ${book.title}`} />
            </div>
          ))}
          <span className="hero-edition-note">PAPERBACKS &amp; HARDBACKS<br />FOR SLOWER AFTERNOONS</span>
        </div>
      </section>

      <section className="service-strip" aria-label="Shop information">
        <div><span className="service-icon">01</span><span><strong>Picked by people</strong><small>One reader to another</small></span></div>
        <div><span className="service-icon">02</span><span><strong>Wrapped with care</strong><small>A good parcel matters</small></span></div>
        <div><span className="service-icon">03</span><span><strong>Local bookshop</strong><small>Your order supports our shelves</small></span></div>
      </section>

      <section className="catalog" id="shop" aria-label="Shop books">
        <div className="catalog-heading">
          <div>
            <span className="section-eyebrow">THE BOOKS</span>
            <h2>Take a look around.</h2>
          </div>
          <span className="catalog-count">{books.length} books on the shelf</span>
        </div>

        <div className="catalog-controls">
          <div className="genre-tabs" role="group" aria-label="Filter books by genre">
            {shelves.map((shelf) => (
              <button
                key={shelf.key}
                className={`genre-tab ${genre === shelf.key ? 'is-active' : ''}`}
                type="button"
                aria-pressed={genre === shelf.key}
                onClick={() => setGenre(shelf.key)}
              >
                {shelf.label}
              </button>
            ))}
          </div>
          <span className="filter-caption">Find something you’ll love.</span>
        </div>
        <BookList genre={genre} search={search} onAdd={addToBasket} />
        <p className="price-disclaimer">Sample prices and delivery terms in KSh are placeholders for this shop preview.</p>
      </section>

      <section className="about-strip" id="about">
        <span className="about-flourish" aria-hidden="true">rr</span>
        <div>
          <span className="section-eyebrow">A NOTE FROM THE SHOP</span>
          <p>We like books that stay with you. Take your time, browse the shelves, and if you need a recommendation, just ask.</p>
        </div>
        <a href="#shop">Back to the books <span aria-hidden="true">↑</span></a>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#top"><BrandMark /><span>The Reading Room</span></a>
        <p>Independent books. Good company.</p>
        <span>Cover images via Open Library</span>
      </footer>

      {notice && <div className="toast" role="status">{notice}</div>}
      {basketOpen && (
        <BasketPanel
          books={books}
          basket={basket}
          onChangeQuantity={changeQuantity}
          onClose={() => setBasketOpen(false)}
        />
      )}
    </main>
  )
}
