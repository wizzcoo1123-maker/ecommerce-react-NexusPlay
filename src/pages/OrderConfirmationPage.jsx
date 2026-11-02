/**
 * @file OrderConfirmationPage.jsx
 * @description Order confirmation and receipt receipt view.
 * Shown after a successful checkout submission.
 * Displays order number, customer shipping details, itemized breakdown, and print action.
 */

import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import '../styles/confirmation.css';

export function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  // If user tries to visit /order-confirmation directly with no order state, redirect home
  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  const paymentLabels = {
    cod: 'Cash on Delivery (Pay at Door)',
    card: 'Credit / Debit Card (Processed)',
    paypal: 'PayPal Express',
  };

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-card animate-fade-in">
          {/* Header */}
          <div className="confirmation-hero">
            <div className="confirmation-icon-wrap">✓</div>
            <h1>Order Confirmed!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Thank you for choosing NexusPlay, <strong>{order.customer.name}</strong>!
              Your gaming hardware is being prepared for express dispatch.
            </p>
            <div className="order-badge-pill">
              <span>Order Reference:</span>
              <span>#{order.orderNumber}</span>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="order-info-grid">
            <div className="info-block">
              <h4>Shipping Destination</h4>
              <p>
                <strong>{order.customer.name}</strong>
                <br />
                {order.customer.address}
                <br />
                {order.customer.city}, {order.customer.postalCode}
                <br />
                {order.customer.country}
              </p>
            </div>

            <div className="info-block">
              <h4>Order & Payment</h4>
              <p>
                <strong>Date:</strong> {order.orderDate}
                <br />
                <strong>Method:</strong> {paymentLabels[order.paymentMethod] || order.paymentMethod}
                <br />
                <strong>Contact:</strong> {order.customer.email}
                <br />
                <strong>Phone:</strong> {order.customer.phone}
              </p>
            </div>
          </div>

          {/* Itemized Order Breakdown */}
          <div className="order-items-table">
            <h3>Purchased Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</h3>

            {order.items.map((item) => (
              <div key={item.id} className="order-item-line">
                <div className="order-item-left">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="order-item-img"
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            {/* Financial Summary */}
            <div className="order-financials-summary">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Estimated Tax (5%):</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-light)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: 'var(--accent-cyan)',
                }}
              >
                <span>Total Paid:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="confirmation-actions">
            <button type="button" className="btn btn-secondary" onClick={handlePrint}>
              🖨️ Print Receipt
            </button>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
