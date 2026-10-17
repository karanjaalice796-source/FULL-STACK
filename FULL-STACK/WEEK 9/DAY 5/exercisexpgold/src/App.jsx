import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  removeFromCart,
} from "./features/cart/cartSlice";
import {
  calculateTotalPrice,
  selectCartCount,
  selectCartItems,
  selectProducts,
} from "./features/selectors";
import { getRecommendations } from "./features/recommendations";

const categories = ["Everything", "Home", "Desk", "On the go"];
const goals = [
  "A slower morning",
  "A happier workspace",
  "A thoughtful little gift",
];
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap" style={{ backgroundColor: product.color }}>
        <img alt={product.name} className="product-image" loading="lazy" src={product.image} />
        <span className="product-tag">{product.tag}</span>
        <button
          aria-label={`Add ${product.name} to your bag`}
          className="quick-add"
          onClick={() => onAdd(product.id)}
          type="button"
        >
          +
        </button>
      </div>
      <div className="product-details">
        <div className="product-title-row">
          <h3>{product.name}</h3>
          <span className="product-price">{currency.format(product.price)}</span>
        </div>
        <p>{product.description}</p>
        <button className="text-add" onClick={() => onAdd(product.id)} type="button">
          Add to bag <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  );
}

function CartLine({ item, onAdd, onDecrease, onRemove }) {
  return (
    <li className="cart-line">
      <img alt="" className="cart-line-image" src={item.image} />
      <div className="cart-line-info">
        <h3>{item.name}</h3>
        <span>{currency.format(item.price)}</span>
        <div aria-label={`${item.name} quantity`} className="quantity-control">
          <button
            aria-label={`Decrease ${item.name} quantity`}
            onClick={() => onDecrease(item.id)}
            type="button"
          >
            −
          </button>
          <span>{item.quantity}</span>
          <button
            aria-label={`Increase ${item.name} quantity`}
            onClick={() => onAdd(item.id)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <div className="cart-line-end">
        <span className="line-total">{currency.format(item.price * item.quantity)}</span>
        <button
          aria-label={`Remove ${item.name} from your bag`}
          className="remove-item"
          onClick={() => onRemove(item.id)}
          type="button"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

function App() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const totalPrice = useSelector(calculateTotalPrice);
  const [activeCategory, setActiveCategory] = useState("Everything");
  const [search, setSearch] = useState("");
  const [goal, setGoal] = useState(goals[0]);
  const [notice, setNotice] = useState("");

  const handleAddToCart = useCallback(
    (productId) => {
      dispatch(addToCart(productId));
      const product = products.find((item) => item.id === productId);
      if (product) setNotice(`${product.name} added to your bag.`);
    },
    [dispatch, products],
  );
  const handleDecrease = useCallback(
    (productId) => dispatch(decreaseQuantity(productId)),
    [dispatch],
  );
  const handleRemove = useCallback(
    (productId) => dispatch(removeFromCart(productId)),
    [dispatch],
  );
  const handleClearCart = useCallback(() => dispatch(clearCart()), [dispatch]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "Everything" || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, search]);

  const recommendations = useMemo(
    () => getRecommendations(products, cartItems, goal),
    [cartItems, goal, products],
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <a aria-label="Kindred Market home" className="wordmark" href="#top">
          <span aria-hidden="true" className="brand-flower">✳</span>
          kindred<span className="wordmark-light">market</span>
        </a>
        <nav aria-label="Main navigation" className="main-nav">
          <a className="nav-link active" href="#shop">Shop all</a>
          <a className="nav-link" href="#little-helper">Our little helper</a>
          <a className="nav-link" href="#about">Our kind of good</a>
        </nav>
        <a className="bag-link" href="#your-bag">
          Your bag <span className="bag-count">{cartCount}</span>
        </a>
      </header>

      <main id="top">
        <section aria-labelledby="hero-title" className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> SMALL THINGS, BIG FEELING</span>
            <h1 id="hero-title">Make room for<br />the <em>everyday lovely.</em></h1>
            <p>Thoughtful little things for your home, your desk, and all the bits in between.</p>
            <a className="button button-dark" href="#shop">Find your little something <span aria-hidden="true">↗</span></a>
            <div className="hero-note">
              <span aria-hidden="true" className="note-sparkle">✳</span>
              <span>Good things, picked with a little more thought.</span>
            </div>
          </div>
          <div aria-label="A calm, sunlit home with thoughtful everyday objects" className="hero-image">
            <div className="hero-image-caption">
              <span>THE SLOW-DOWN EDIT</span>
              <span>Little rituals, lovely days. <span aria-hidden="true">↗</span></span>
            </div>
          </div>
          <span aria-hidden="true" className="hero-side-note">A LITTLE MORE YOU, EVERY DAY</span>
        </section>

        <section className="shop-section page-section" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A FEW GOOD THINGS</span>
              <h2>Made for your kind of day.</h2>
              <p>Useful, lovely, and always happy to see you.</p>
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Search products"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Looking for something?"
                type="search"
                value={search}
              />
              <kbd>⌘ K</kbd>
            </label>
          </div>
          <div aria-label="Filter products by category" className="category-tabs">
            {categories.map((category) => (
              <button
                aria-pressed={activeCategory === category}
                className={`category-tab${activeCategory === category ? " selected" : ""}`}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
            <span className="item-count">{visibleProducts.length} lovely things</span>
          </div>
          {visibleProducts.length ? (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} onAdd={handleAddToCart} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-search">
              <span aria-hidden="true">⌕</span>
              <h3>Nothing quite like that (yet).</h3>
              <p>Try another word or have a look at everything.</p>
              <button
                className="text-add"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("Everything");
                }}
                type="button"
              >
                Show me everything ↗
              </button>
            </div>
          )}
        </section>

        <section aria-labelledby="assistant-title" className="assistant-section" id="little-helper">
          <div className="assistant-topline">
            <span className="assistant-sparkle" aria-hidden="true">✳</span>
            <span>A LITTLE HELP FROM OUR AI</span>
            <span className="local-pill"><span /> PERSONAL PICKS</span>
          </div>
          <div className="assistant-content">
            <div className="assistant-intro">
              <h2 id="assistant-title">Not sure what<br />you’re in the mood for?</h2>
              <p>Tell me what kind of day you’re making. I’ll find a couple of good fits.</p>
              <label className="goal-label" htmlFor="shopping-goal">TODAY, I’M AFTER…</label>
              <select
                id="shopping-goal"
                onChange={(event) => setGoal(event.target.value)}
                value={goal}
              >
                {goals.map((option) => <option key={option}>{option}</option>)}
              </select>
              <p className="ai-disclaimer">A tiny, on-device demo that matches your goal and bag to our little shop.</p>
            </div>
            <div aria-live="polite" className="recommendation-list">
              {recommendations.length ? recommendations.map((product, index) => (
                <article className="recommendation-card" key={product.id}>
                  <img alt="" src={product.image} />
                  <div className="recommendation-info">
                    <span className="recommendation-label">{index === 0 ? "A GOOD PLACE TO START" : "ALSO A LOVELY FIT"}</span>
                    <h3>{product.name}</h3>
                    <span>{product.description}</span>
                  </div>
                  <div className="recommendation-action">
                    <strong>{currency.format(product.price)}</strong>
                    <button
                      aria-label={`Add AI pick ${product.name} to your bag`}
                      className="recommendation-add"
                      onClick={() => handleAddToCart(product.id)}
                      type="button"
                    >
                      Add +
                    </button>
                  </div>
                </article>
              )) : (
                <div className="recommendations-empty">
                  <span aria-hidden="true">✳</span>
                  <p>You’ve found all our little things. That’s some lovely taste.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="kind-note page-section" id="about">
          <span aria-hidden="true">✳</span>
          <p>A softer landing for your everyday.</p>
          <span>Carefully considered. Happily kept.</span>
        </section>

        <section aria-labelledby="cart-title" className="cart-section page-section" id="your-bag">
          <div className="cart-heading">
            <div>
              <span className="eyebrow">YOUR LITTLE FINDS</span>
              <h2 id="cart-title">Your bag <span>({cartCount})</span></h2>
            </div>
            {cartItems.length > 0 && (
              <button className="clear-cart" onClick={handleClearCart} type="button">
                Start fresh
              </button>
            )}
          </div>
          {cartItems.length ? (
            <div className="cart-layout">
              <ul className="cart-list">
                {cartItems.map((item) => (
                  <CartLine
                    item={item}
                    key={item.id}
                    onAdd={handleAddToCart}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />
                ))}
              </ul>
              <aside aria-label="Order summary" className="order-summary">
                <span>THE LITTLE TOTAL</span>
                <div><span>Subtotal</span><strong>{currency.format(totalPrice)}</strong></div>
                <p>Shipping and any taxes, sorted at checkout.</p>
                <button className="button button-dark checkout-button" onClick={() => setNotice("Lovely choices. Checkout is just a demo for now.")} type="button">
                  That’s everything <span aria-hidden="true">↗</span>
                </button>
                <span className="summary-note">A little joy, on its way to you.</span>
              </aside>
            </div>
          ) : (
            <div className="cart-empty">
              <span aria-hidden="true" className="empty-bag">♡</span>
              <div>
                <h3>Nothing in your bag just yet.</h3>
                <p>When something feels like you, tuck it in here.</p>
              </div>
              <a className="button button-outline" href="#shop">Have a little look ↗</a>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top">
          <span aria-hidden="true" className="brand-flower">✳</span>
          kindred<span className="wordmark-light">market</span>
        </a>
        <p>For the everyday lovely. <span aria-hidden="true">♡</span></p>
        <span>Made with care, for you.</span>
      </footer>

      <div aria-live="polite" className={`toast${notice ? " visible" : ""}`} role="status">
        <span aria-hidden="true">✳</span>{notice}
        {notice && <button aria-label="Dismiss notification" onClick={() => setNotice("")} type="button">×</button>}
      </div>
    </div>
  );
}

export default App;
