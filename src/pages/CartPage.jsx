/**
 * @file CartPage.jsx
 * @description Shopping cart overview page.
 * Displays all selected hardware items, allows dynamic quantity changes (+/-),
 * item removal, subtotal / tax / shipping calculations, and Proceed to Checkout button.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

export function CartPage() {
  const {
    cartItems,
    totalItems,
    subtotal,
    shipping,
    tax,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const fallbackImg =
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80';

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart-view animate-fade-in">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>
              Looks like you haven't added any consoles or gaming accessories to your cart yet.
              Explore our catalog and power up your setup today!
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Explore Hardware Catalog →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review your selected gaming items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </p>
        </div>

        <div className="cart-layout">
          {/* Left Column: Cart Items List */}
          <div className="cart-items-wrapper">
            <div className="cart-header-row">
              <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ITEMS IN CART
              </span>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={clearCart}
                title="Remove all items from cart"
              >
                Clear Cart
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="shipping-meter-box">
              {remainingForFreeShipping > 0 ? (
                <>
                  <span>🚚</span>
                  <span>
                    Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more to unlock{' '}
                    <strong style={{ color: 'var(--accent-cyan)' }}>FREE Express Shipping</strong>!
                  </span>
                </>
              ) : (
                <>
                  <span>🎉</span>
                  <span style={{ color: '#6ee7b7' }}>
                    Congratulations! Your order qualifies for <strong>FREE Express Shipping</strong>.
                  </span>
                </>
              )}
            </div>

            {/* Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const itemTotal = Number(item.price) * item.quantity;

                return (
                  <div key={item.id} className="cart-item">
                    {/* Image */}
                    <div className="cart-item-image-box">
                      <img
                        src={item.image || fallbackImg}
                        alt={item.title}
                        className="cart-item-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImg;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="cart-item-info">
                      <span className="cart-item-category">{item.category}</span>
                      <h3 className="cart-item-title">
                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                      </h3>
                      <div className="cart-item-unit-price">
                        ${Number(item.price).toFixed(2)} each
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="cart-item-controls">
                      <div className="quantity-control" style={{ transform: 'scale(0.9)' }}>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Item Total & Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="cart-item-subtotal">${itemTotal.toFixed(2)}</div>
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <aside className="order-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-row">
              <span>Items Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span>{shipping === 0 ? <strong style={{ color: '#6ee7b7' }}>FREE</strong> : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="summary-actions">
              <Link to="/checkout" className="btn btn-primary btn-lg btn-block">
                Proceed to Checkout →
              </Link>
              <Link to="/products" className="btn btn-secondary btn-block">
                Continue Shopping
              </Link>
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
                lineHeight: 1.5,
              }}
            >
              🔒 <strong>Safe Checkout:</strong> All orders are protected with 256-bit encryption.
              Cash on delivery, PayPal, and credit cards supported.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
