import { useDispatch, useSelector } from 'react-redux'
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../features/cart/cartSlice.js'

function ShoppingCart({ onClose, onRequestLogin, onCheckoutComplete }) {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const user = useSelector((state) => state.auth.user)
  const count = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  function handleCheckout() {
    if (!user) {
      onRequestLogin()
      return
    }
    dispatch(clearCart())
    onCheckoutComplete()
  }

  return (
    <div className="drawer-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <aside className="cart-drawer" aria-label="Shopping bag">
        <div className="drawer-header">
          <div>
            <p className="modal-kicker">YOUR SELECTION</p>
            <h2>Your bag <span>({count})</span></h2>
          </div>
          <button className="close-button" type="button" aria-label="Close bag" onClick={onClose}>×</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="empty-bag" aria-hidden="true">○</span>
            <p>Your bag is taking a quiet moment.</p>
            <button className="continue-button" type="button" onClick={onClose}>Explore the collection</button>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {items.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div className="cart-thumb"><img src={item.image} alt="" /></div>
                  <div className="cart-item-info">
                    <h3>{item.title}</h3>
                    <p>${item.price.toFixed(2)}</p>
                    <div className="quantity-control" aria-label={`Quantity for ${item.title}`}>
                      <button type="button" aria-label={`Decrease ${item.title}`} onClick={() => dispatch(decrementQuantity(item.id))}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label={`Increase ${item.title}`} onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    type="button"
                    aria-label={`Remove ${item.title}`}
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-summary">
              <div className="subtotal"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
              <p>Shipping and taxes calculated at checkout.</p>
              <button className="checkout-button" type="button" onClick={handleCheckout}>
                {user ? 'Place demo order' : 'Sign in to checkout'}
                <span aria-hidden="true">↗</span>
              </button>
              <button className="continue-button" type="button" onClick={onClose}>Continue browsing</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default ShoppingCart
