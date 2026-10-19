import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { calculateTotalPrice, selectCartItems, selectProducts } from './features/shop/shopSelectors.js'
import { addToCart, changeQuantity, removeFromCart } from './features/shop/shopSlice.js'
import './App.css'

const formatPrice = (price) => `KSh ${price.toLocaleString('en-KE')}`

const ProductCard = memo(function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-art" style={{ '--product-color': product.color }}>
        <span className="art-number">{product.symbol}</span>
        <span className={`product-shape shape-${product.id}`} aria-hidden="true">
          {product.id === 1 && <span className="mug-handle" />}
          {product.id === 2 && <span className="tote-handle" />}
          {product.id === 3 && <span className="candle-flame" />}
          {product.id === 4 && <span className="bowl-rim" />}
          {product.id === 5 && <span className="notebook-lines" />}
          {product.id === 6 && <span className="towel-lines" />}
        </span>
        <span className="art-caption">{product.category} / Field &amp; Form</span>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.note}</p>
        <div className="product-purchase">
          <strong>{formatPrice(product.price)}</strong>
          <button type="button" onClick={() => onAdd(product.id)}>
            Add to cart <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </article>
  )
})

function CartLine({ item, onChangeQuantity, onRemove }) {
  return (
    <li className="cart-line">
      <span className={`cart-swatch swatch-${item.id}`} aria-hidden="true">{item.symbol}</span>
      <div className="cart-line-details">
        <h3>{item.name}</h3>
        <p>{formatPrice(item.price)} each</p>
        <div className="quantity-control" aria-label={`Quantity of ${item.name}`}>
          <button type="button" onClick={() => onChangeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button>
          <span>{item.quantity}</span>
          <button type="button" onClick={() => onChangeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button>
        </div>
      </div>
      <div className="cart-line-end">
        <strong>{formatPrice(item.price * item.quantity)}</strong>
        <button className="remove-link" type="button" onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </li>
  )
}

function ShoppingCart({ items, total, onChangeQuantity, onRemove }) {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <aside className="cart-panel" aria-label="Shopping cart">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">YOUR BAG</span>
          <h2>Your cart <span>({itemCount})</span></h2>
        </div>
        <span className="bag-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M4.5 8h15l-1.2 12H5.7L4.5 8Z" /><path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" /></svg>
        </span>
      </div>

      {items.length ? (
        <>
          <ul className="cart-items">
            {items.map((item) => (
              <CartLine key={item.id} item={item} onChangeQuantity={onChangeQuantity} onRemove={onRemove} />
            ))}
          </ul>
          <div className="cart-summary">
            <div className="subtotal"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
            <p>Delivery is calculated when you check out.</p>
            <button className="checkout-button" type="button" disabled>
              Continue to checkout <span aria-hidden="true">→</span>
            </button>
            <small>Cart demo for the Redux exercise. No payment is collected.</small>
          </div>
        </>
      ) : (
        <div className="cart-empty">
          <span aria-hidden="true">◯</span>
          <h3>Nothing in your bag yet.</h3>
          <p>Have a look around. You might find a new favourite.</p>
        </div>
      )}
    </aside>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const cartItems = useSelector(selectCartItems)
  const total = useSelector(calculateTotalPrice)
  const handleAddToCart = useCallback((productId) => {
    dispatch(addToCart(productId))
  }, [dispatch])
  const handleChangeQuantity = useCallback((productId, change) => {
    dispatch(changeQuantity({ productId, change }))
  }, [dispatch])
  const handleRemove = useCallback((productId) => {
    dispatch(removeFromCart(productId))
  }, [dispatch])

  return (
    <main className="shop-layout">
      <div className="storefront">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Field and Form home">
            <span className="wordmark-icon" aria-hidden="true">f.</span>
            <span>field <i>&amp;</i> form</span>
          </a>
          <span className="header-note">Useful things, made to last.</span>
          <a className="header-bag" href="#cart">
            Bag <span>{cartItems.reduce((count, item) => count + item.quantity, 0)}</span>
          </a>
        </header>

        <section className="welcome" id="top">
          <div>
            <span className="eyebrow">SMALL GOODS FOR EVERYDAY LIVING</span>
            <h1>Keep the good<br /><em>things close.</em></h1>
            <p>A thoughtful collection for slow mornings, shared tables, and all the little bits in between.</p>
            <a href="#products" className="shop-link">Take a look <span aria-hidden="true">↓</span></a>
          </div>
          <div className="welcome-note">
            <span>NO. 01 — THE EVERYDAY EDIT</span>
            <p>Less, but<br />better loved.</p>
            <span className="note-mark" aria-hidden="true">✳</span>
          </div>
        </section>

        <section className="collection" id="products">
          <div className="collection-heading">
            <div>
              <span className="eyebrow">THE SHOP</span>
              <h2>Things for home</h2>
            </div>
            <span className="collection-count">{products.length} considered essentials</span>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <span>field &amp; form</span>
          <span>Useful things, chosen with care.</span>
        </footer>
      </div>

      <div id="cart" className="cart-column">
        <ShoppingCart
          items={cartItems}
          total={total}
          onChangeQuantity={handleChangeQuantity}
          onRemove={handleRemove}
        />
      </div>
    </main>
  )
}
