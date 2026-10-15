import { connect } from 'react-redux'

function StoreHeader({ user, itemCount, onOpenCart, onOpenAuth }) {
  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="Form and Field home">
        form <span>&</span> field
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#collection">Shop</a>
        <a href="#story">Our approach</a>
      </nav>
      <div className="header-actions">
        <button className="account-button" type="button" onClick={onOpenAuth}>
          <span className="account-icon" aria-hidden="true">○</span>
          {user ? user.name.split(' ')[0] : 'Account'}
        </button>
        <button className="bag-button" type="button" onClick={onOpenCart}>
          Bag <span className="bag-count">{itemCount}</span>
        </button>
      </div>
    </header>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  itemCount: state.cart.items.reduce((total, item) => total + item.quantity, 0),
})

export default connect(mapStateToProps)(StoreHeader)
