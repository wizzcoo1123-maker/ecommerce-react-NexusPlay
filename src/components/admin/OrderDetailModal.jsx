/**
 * @file OrderDetailModal.jsx
 * @description Modal dialog for viewing full customer order details and updating fulfillment status.
 */

import React from 'react';
import { updateOrderStatus } from '../../services/adminService';

export function OrderDetailModal({ isOpen, onClose, order, onStatusChange }) {
  if (!isOpen || !order) return null;

  const handleStatusSelect = (e) => {
    const newStatus = e.target.value;
    updateOrderStatus(order.orderNumber, newStatus);
    if (onStatusChange) {
      onStatusChange(order.orderNumber, newStatus);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const paymentLabels = {
    cod: '💵 Cash on Delivery',
    card: '💳 Credit / Debit Card',
    paypal: '🅿️ PayPal Express',
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-box animate-fade-in"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📦</span>
            <div>
              <h2 className="admin-modal-title">
                Order #{order.orderNumber}
              </h2>
              <small style={{ color: 'var(--text-muted)' }}>
                Placed on {order.orderDate}
              </small>
            </div>
          </div>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="admin-modal-body">
          {/* Status Control Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Fulfillment Status:
              </span>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="modal-status-select" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Change Status:
              </label>
              <select
                id="modal-status-select"
                value={order.status}
                onChange={handleStatusSelect}
                className="status-dropdown"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                📍 Shipping Destination
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
                <strong>{order.customer.name}</strong>
                <br />
                {order.customer.address}
                <br />
                {order.customer.city}, {order.customer.postalCode}
                <br />
                {order.customer.country}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <h4 style={{ color: 'var(--accent-purple)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                💳 Payment & Contact
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
                <strong>Method:</strong> {paymentLabels[order.paymentMethod] || order.paymentMethod}
                <br />
                <strong>Email:</strong> {order.customer.email}
                <br />
                <strong>Phone:</strong> {order.customer.phone}
              </p>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              Purchased Items ({order.items.reduce((s, i) => s + (Number(i.quantity) || 1), 0)})
            </h4>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="table-product-thumb"
                          />
                          <span style={{ fontWeight: 600 }}>{item.title}</span>
                        </div>
                      </td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td style={{ fontWeight: 700 }}>
                        ${(Number(item.price) * (Number(item.quantity) || 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>Subtotal:</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>Shipping:</span>
              <span>{order.shipping === 0 ? 'FREE' : `$${Number(order.shipping).toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>Estimated Tax (5%):</span>
              <span>${Number(order.tax).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px solid var(--border-light)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              <span>Grand Total:</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handlePrint}
          >
            🖨️ Print Invoice
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
