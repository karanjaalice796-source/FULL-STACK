import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, removeProduct, updateQuantity } from './inventorySlice.js'
import './App.css'

const categories = ['Accessories', 'Lighting', 'Stationery', 'Storage']
const selectProducts = (state) => state.inventory.products

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `product-${Date.now()}`
}

function AddProduct() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const cleanName = name.trim()
    if (products.some((product) => product.name.toLowerCase() === cleanName.toLowerCase())) {
      setError('A product with that name is already in the inventory.')
      return
    }

    dispatch(addProduct({
      id: makeId(),
      name: cleanName,
      category,
      quantity: Number(quantity),
      price: Number(price),
    }))
    setName('')
    setCategory(categories[0])
    setQuantity('')
    setPrice('')
    setError('')
  }

  return (
    <section className="add-panel" aria-labelledby="add-heading">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">NEW STOCK</p>
          <h2 id="add-heading">Add a product</h2>
        </div>
        <span className="add-mark" aria-hidden="true">+</span>
      </div>
      <form className="add-form" onSubmit={handleSubmit}>
        <label className="field field-name">
          <span>Product name</span>
          <input
            maxLength={64}
            onChange={(event) => { setName(event.target.value); setError('') }}
            placeholder="e.g. Ceramic desk planter"
            required
            value={name}
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select onChange={(event) => setCategory(event.target.value)} value={category}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field field-small">
          <span>Quantity</span>
          <input min="0" onChange={(event) => setQuantity(event.target.value)} required type="number" value={quantity} />
        </label>
        <label className="field field-small">
          <span>Unit price</span>
          <span className="price-input"><span aria-hidden="true">$</span><input min="0" onChange={(event) => setPrice(event.target.value)} required step="0.01" type="number" value={price} /></span>
        </label>
        <button className="add-button" type="submit"><span aria-hidden="true">+</span> Add product</button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  )
}

function UpdateQuantity({ product }) {
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(String(product.quantity))

  useEffect(() => {
    setQuantity(String(product.quantity))
  }, [product.quantity])

  function saveQuantity(event) {
    event.preventDefault()
    const nextQuantity = Math.max(0, Number.parseInt(quantity, 10) || 0)
    dispatch(updateQuantity({ id: product.id, quantity: nextQuantity }))
    setQuantity(String(nextQuantity))
  }

  return (
    <form className="quantity-control" onSubmit={saveQuantity} aria-label={`Update quantity for ${product.name}`}>
      <button
        aria-label={`Decrease ${product.name} quantity`}
        disabled={product.quantity === 0}
        onClick={() => dispatch(updateQuantity({ id: product.id, quantity: product.quantity - 1 }))}
        type="button"
      >−</button>
      <input
        aria-label={`Quantity for ${product.name}`}
        min="0"
        onChange={(event) => setQuantity(event.target.value)}
        type="number"
        value={quantity}
      />
      <button
        aria-label={`Increase ${product.name} quantity`}
        onClick={() => dispatch(updateQuantity({ id: product.id, quantity: product.quantity + 1 }))}
        type="button"
      >+</button>
      <button className="save-quantity" type="submit">Save</button>
    </form>
  )
}

function RemoveProduct({ product }) {
  const dispatch = useDispatch()
  return (
    <button
      aria-label={`Remove ${product.name}`}
      className="remove-button"
      onClick={() => dispatch(removeProduct(product.id))}
      title={`Remove ${product.name}`}
      type="button"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4.5 6h11M8 6V4.5h4V6m-6.5 0 .7 9h6.6l.7-9M8.5 9v3.5m3-3.5v3.5" /></svg>
    </button>
  )
}

function InventoryList({ search, category }) {
  const products = useSelector(selectProducts)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category} ${product.id}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (category === 'All categories' || product.category === category)
  })

  if (filteredProducts.length === 0) {
    return <div className="empty-state"><span aria-hidden="true">⌕</span><h3>No products found</h3><p>Try another search or add a new product to your stock.</p></div>
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr><th scope="col">Product</th><th scope="col">Category</th><th scope="col">Unit price</th><th scope="col">Quantity</th><th scope="col">Stock status</th><th scope="col"><span className="sr-only">Actions</span></th></tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td data-label="Product">
                <div className="product-cell"><span className={`product-icon icon-${product.category.toLowerCase()}`} aria-hidden="true">{product.name.charAt(0).toUpperCase()}</span><span><strong>{product.name}</strong><small>{product.id.slice(0, 8).toUpperCase()}</small></span></div>
              </td>
              <td data-label="Category"><span className="category-label">{product.category}</span></td>
              <td className="money-cell" data-label="Unit price">${product.price.toFixed(2)}</td>
              <td className="quantity-cell" data-label="Quantity"><UpdateQuantity product={product} /></td>
              <td data-label="Stock status"><span className={`stock-status ${product.quantity === 0 ? 'out' : product.quantity < 10 ? 'low' : 'in-stock'}`}><span />{product.quantity === 0 ? 'Out of stock' : product.quantity < 10 ? 'Low stock' : 'In stock'}</span></td>
              <td className="action-cell"><RemoveProduct product={product} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InventoryDashboard() {
  const products = useSelector(selectProducts)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const totalUnits = products.reduce((sum, product) => sum + product.quantity, 0)
  const lowStockCount = products.filter((product) => product.quantity < 10).length
  const inventoryValue = products.reduce((sum, product) => sum + product.quantity * product.price, 0)

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Stockroom home"><span className="wordmark-icon" aria-hidden="true"><span /><span /><span /></span>stockroom<span className="wordmark-dot">.</span></a>
        <span className="topbar-note"><span className="live-dot" /> INVENTORY OVERVIEW</span>
      </header>

      <section className="intro" id="top">
        <div><p className="section-kicker">YOUR STORE, AT A GLANCE</p><h1>Good stock.<br /><em>Good business.</em></h1><p className="intro-copy">Keep every item accounted for, from first delivery to last one on the shelf.</p></div>
        <div className="intro-aside"><span className="aside-rule" /><span>INVENTORY<br />CONTROL / 01</span></div>
      </section>

      <section className="metrics" aria-label="Inventory summary">
        <article className="metric"><span className="metric-label">PRODUCTS</span><strong>{products.length.toString().padStart(2, '0')}</strong><span className="metric-note">unique items listed</span></article>
        <article className="metric metric-highlight"><span className="metric-label">TOTAL UNITS</span><strong>{totalUnits.toLocaleString()}</strong><span className="metric-note">units on hand</span></article>
        <article className="metric"><span className="metric-label">LOW STOCK</span><strong>{lowStockCount.toString().padStart(2, '0')}</strong><span className="metric-note">items below 10 units</span></article>
        <article className="metric metric-value"><span className="metric-label">STOCK VALUE</span><strong>${inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong><span className="metric-note">at current unit prices</span></article>
      </section>

      <AddProduct />

      <section className="inventory-section" aria-labelledby="inventory-heading">
        <div className="inventory-heading">
          <div><p className="section-kicker">THE SHELVES</p><h2 id="inventory-heading">Inventory <span>{products.length}</span></h2></div>
          <div className="list-tools">
            <label className="search-box"><svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.8" cy="8.8" r="5.8" /><path d="m13.2 13.2 4 4" /></svg><span className="sr-only">Search inventory</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." value={search} /></label>
            <label className="category-filter"><span className="sr-only">Filter by category</span><select onChange={(event) => setCategory(event.target.value)} value={category}><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
        </div>
        <InventoryList category={category} search={search} />
        <footer className="table-footer"><span>Showing {products.length} {products.length === 1 ? 'product' : 'products'}</span><span>STOCKROOM <span className="wordmark-dot">/</span> INVENTORY</span></footer>
      </section>
      <p className="page-footnote">Every item in its place. Every number up to date.</p>
    </main>
  )
}

export default function App() {
  return <InventoryDashboard />
}