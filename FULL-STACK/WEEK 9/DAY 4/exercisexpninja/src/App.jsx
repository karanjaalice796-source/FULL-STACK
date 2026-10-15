import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthForm from './components/AuthForm.jsx'
import ProductListing from './components/ProductListing.jsx'
import ShoppingCart from './components/ShoppingCart.jsx'
import StoreHeader from './components/StoreHeader.jsx'
import { fetchProducts } from './features/products/productSlice.js'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { items: products, status, error } = useSelector((state) => state.products)
  const [category, setCategory] = useState('All')
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const categories = ['All', ...new Set(products.map((product) => product.category))]

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <div className="store-shell">
      <div className="announcement">A considered collection for the everyday <span>·</span> Complimentary shipping over $75</div>
      <div className="content-shell">
        <StoreHeader
          onOpenCart={() => setCartOpen(true)}
          onOpenAuth={() => setAuthOpen(true)}
        />

        <main>
          <section className="hero" id="story">
            <div className="hero-copy">
              <p className="eyebrow">OBJECTS FOR A LIFE WELL LIVED</p>
              <h1>Keep what<br />feels <em>considered.</em></h1>
              <p className="hero-description">Thoughtful pieces, chosen for their lasting usefulness and quiet beauty. Find your next everyday favorite.</p>
              <a className="hero-link" href="#collection">Discover the collection <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-art" aria-label="Softly lit still life of everyday home goods">
              <div className="art-circle" />
              <div className="art-vase"><span /></div>
              <div className="art-book art-book-one" />
              <div className="art-book art-book-two" />
              <div className="art-orb" />
              <span className="art-caption">FORM / FUNCTION / FEELING</span>
            </div>
            <div className="hero-index"><span>01</span><span className="index-line" /><span>04</span></div>
          </section>

          <section className="collection" id="collection">
            <div className="collection-heading">
              <div>
                <p className="eyebrow">THE EDIT / {String(products.length).padStart(2, '0')} PIECES</p>
                <h2>A few good things.</h2>
              </div>
              <div className="collection-aside">
                <span>{status === 'loading' ? 'Gathering the collection…' : 'Chosen with intention.'}</span>
                <button
                  className="refresh-products"
                  type="button"
                  disabled={status === 'loading'}
                  onClick={() => dispatch(fetchProducts())}
                >
                  {status === 'loading' ? 'Loading' : '↻ Refresh'}
                </button>
              </div>
            </div>

            {status === 'failed' && (
              <div className="load-error" role="alert">
                <span>{error}</span>
                <button type="button" onClick={() => dispatch(fetchProducts())}>Try again</button>
              </div>
            )}

            {products.length > 0 && (
              <div className="category-tabs" role="group" aria-label="Filter products by category">
                {categories.map((item) => (
                  <button
                    className={category === item ? 'category-tab is-active' : 'category-tab'}
                    type="button"
                    key={item}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            <ProductListing
              category={category}
              onRetry={() => dispatch(fetchProducts())}
            />
          </section>
        </main>

        <footer className="site-footer">
          <a className="footer-wordmark" href="/">form <span>&</span> field</a>
          <span id="footer-note">Useful things. Chosen well.</span>
          <span>Made for the everyday.</span>
        </footer>
      </div>

      {cartOpen && (
        <ShoppingCart
          onClose={() => setCartOpen(false)}
          onRequestLogin={() => setAuthOpen(true)}
          onCheckoutComplete={() => {
            setCartOpen(false)
            setNotice('Order placed — thank you for choosing thoughtfully.')
            window.setTimeout(() => setNotice(''), 4500)
          }}
        />
      )}

      {authOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAuthOpen(false)
        }}>
          <section className="auth-modal" role="dialog" aria-modal="true" aria-label="Account">
            <button className="close-button modal-close" type="button" aria-label="Close account dialog" onClick={() => setAuthOpen(false)}>×</button>
            <AuthForm onClose={() => setAuthOpen(false)} />
          </section>
        </div>
      )}

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}

export default App
