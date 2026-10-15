import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice.js'

function ProductListing({ category, onRetry }) {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.products)
  const visibleProducts =
    category === 'All' ? items : items.filter((product) => product.category === category)

  if (status === 'loading' && items.length === 0) {
    return (
      <div className="products-state" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <p>Finding a few good things…</p>
      </div>
    )
  }

  if (status === 'failed' && items.length === 0) {
    return (
      <div className="products-state error-state" role="alert">
        <p>{error}</p>
        <button className="retry-button" type="button" onClick={onRetry}>Try again</button>
      </div>
    )
  }

  if (visibleProducts.length === 0) {
    return <div className="products-state"><p>No products in this collection yet.</p></div>
  }

  return (
    <div className="product-grid" aria-live="polite">
      {visibleProducts.map((product, index) => (
        <article className="product-card" key={product.id}>
          <div className="product-image-wrap">
            <span className="product-index">{String(index + 1).padStart(2, '0')}</span>
            <img src={product.image} alt={product.title} loading="lazy" />
            <button
              className="quick-add"
              type="button"
              aria-label={`Add ${product.title} to bag`}
              onClick={() => dispatch(addToCart(product))}
            >
              +
            </button>
          </div>
          <div className="product-info">
            <p className="product-category">{product.category}</p>
            <h3>{product.title}</h3>
            <div className="product-meta">
              <span className="product-price">${product.price.toFixed(2)}</span>
              <span className="product-rating">★ {product.rating?.rate ?? 'New'}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ProductListing
