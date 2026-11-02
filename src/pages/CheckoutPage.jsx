/**
 * @file CheckoutPage.jsx
 * @description Checkout page with shipping address and payment form.
 * Performs rigorous client-side validation (name, email, phone, address, city, payment method).
 * On valid submission, transitions to the order confirmation view and clears the cart state.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { addOrder } from '../services/adminService';
import '../styles/checkout.css';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalItems, subtotal, shipping, tax, total, clearCart } = useCart();

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: 'cod', // 'cod' | 'card' | 'paypal'
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  // Validation Errors State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, prompt user to add items first
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart-view animate-fade-in">
            <div className="empty-cart-icon">🛒</div>
            <h2>No Items To Check Out</h2>
            <p>
              Your shopping cart is currently empty. Please add items to your cart before proceeding
              to checkout.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Return to Catalog →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Form Validation Logic
  const validateForm = () => {
    const newErrors = {};

    // 1. Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter at least 3 characters.';
    }

    // 2. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    // 3. Phone Number
    const phoneRegex = /^[+0-9\s\-()]{7,18}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for delivery coordination.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 digits).';
    }

    // 4. Street Address
    if (!formData.address.trim()) {
      newErrors.address = 'Street address is required.';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Please enter a detailed physical address.';
    }

    // 5. City
    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    // 6. Postal Code
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal / ZIP code is required.';
    }

    // 7. Credit Card details (if card payment selected)
    if (formData.paymentMethod === 'card') {
      const sanitizedCard = formData.cardNumber.replace(/\s+/g, '');
      if (!sanitizedCard) {
        newErrors.cardNumber = 'Card number is required.';
      } else if (!/^\d{16}$/.test(sanitizedCard)) {
        newErrors.cardNumber = 'Card number must be 16 digits.';
      }

      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry (MM/YY) is required.';
      } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.cardExpiry.trim())) {
        newErrors.cardExpiry = 'Format must be MM/YY.';
      }

      if (!formData.cardCvc.trim()) {
        newErrors.cardCvc = 'CVC is required.';
      } else if (!/^\d{3,4}$/.test(formData.cardCvc.trim())) {
        newErrors.cardCvc = '3 or 4 digits.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Generate Order Record
    const orderNumber = 'NX-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleString();

    const orderData = {
      orderNumber,
      orderDate,
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      items: [...cartItems],
      subtotal,
      shipping,
      tax,
      total,
      status: 'Processing',
    };

    // Save order in localStorage so it appears in Admin Orders management
    addOrder(orderData);

    // Simulate order placement network delay
    setTimeout(() => {
      // Clear Cart state and persist confirmation state
      clearCart();
      setIsSubmitting(false);

      // Navigate to order confirmation page with order details in route state
      navigate('/order-confirmation', {
        state: { order: orderData },
        replace: true,
      });
    }, 900);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Checkout</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Enter your shipping and payment information to complete your gaming order.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="checkout-layout">
            {/* Left Column: Input Forms */}
            <div className="checkout-form-card">
              {/* Shipping Address */}
              <h2 className="checkout-section-title">
                <span>📍</span> 1. Shipping Address
              </h2>

              <div className="form-group">
                <label className="form-label required" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="e.g. Alex Morgan"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label required" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="alex@nexusplay.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label required" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+1 (555) 234-5678"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <div className="form-error">{errors.phone}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="address">
                  Street Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <div className="form-error">{errors.address}</div>}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label required" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    placeholder="San Francisco"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <div className="form-error">{errors.city}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label required" htmlFor="postalCode">
                    Postal / ZIP Code
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    className={`form-input ${errors.postalCode ? 'error' : ''}`}
                    placeholder="94103"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                  {errors.postalCode && <div className="form-error">{errors.postalCode}</div>}
                </div>
              </div>

              {/* Payment Method */}
              <h2 className="checkout-section-title" style={{ marginTop: '2.5rem' }}>
                <span>💳</span> 2. Payment Method
              </h2>

              <div className="payment-methods-grid">
                <label
                  className={`payment-method-label ${
                    formData.paymentMethod === 'cod' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <div>
                    <div className="payment-method-text">💵 Cash on Delivery</div>
                    <small style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      Pay at your doorstep
                    </small>
                  </div>
                </label>

                <label
                  className={`payment-method-label ${
                    formData.paymentMethod === 'card' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <div>
                    <div className="payment-method-text">💳 Credit / Debit Card</div>
                    <small style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      Visa, MasterCard, Amex
                    </small>
                  </div>
                </label>

                <label
                  className={`payment-method-label ${
                    formData.paymentMethod === 'paypal' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                  />
                  <div>
                    <div className="payment-method-text">🅿️ PayPal Express</div>
                    <small style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      Fast and secure wallet
                    </small>
                  </div>
                </label>
              </div>

              {/* Simulated Card Fields when 'card' is selected */}
              {formData.paymentMethod === 'card' && (
                <div className="card-fields-box">
                  <div className="form-group">
                    <label className="form-label required" htmlFor="cardNumber">
                      Card Number (16 Digits)
                    </label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      maxLength={19}
                      className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                      placeholder="4000 1234 5678 9010"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                    {errors.cardNumber && (
                      <div className="form-error">{errors.cardNumber}</div>
                    )}
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label required" htmlFor="cardExpiry">
                        Expiration (MM/YY)
                      </label>
                      <input
                        id="cardExpiry"
                        name="cardExpiry"
                        type="text"
                        maxLength={5}
                        className={`form-input ${errors.cardExpiry ? 'error' : ''}`}
                        placeholder="12/28"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                      />
                      {errors.cardExpiry && (
                        <div className="form-error">{errors.cardExpiry}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label required" htmlFor="cardCvc">
                        Security Code (CVC)
                      </label>
                      <input
                        id="cardCvc"
                        name="cardCvc"
                        type="password"
                        maxLength={4}
                        className={`form-input ${errors.cardCvc ? 'error' : ''}`}
                        placeholder="789"
                        value={formData.cardCvc}
                        onChange={handleChange}
                      />
                      {errors.cardCvc && <div className="form-error">{errors.cardCvc}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div style={{ marginTop: '2rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>⏳ Processing Order...</>
                  ) : (
                    <>🚀 Place Order (${total.toFixed(2)})</>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary Review */}
            <aside className="checkout-summary-card">
              <h2 className="summary-title">Order Review ({totalItems} items)</h2>

              {/* Items List Preview */}
              <div className="checkout-items-preview">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item-row">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="checkout-item-thumb"
                    />
                    <div className="checkout-item-details">
                      <div className="checkout-item-name">{item.title}</div>
                      <div className="checkout-item-meta">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="checkout-item-price">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial breakdown */}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <strong style={{ color: '#6ee7b7' }}>FREE</strong>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Estimated Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-row total-row">
                <span>Grand Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/cart" className="btn btn-secondary btn-sm btn-block">
                  ← Edit Cart Items
                </Link>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
