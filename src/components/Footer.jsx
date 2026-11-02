/**
 * @file Footer.jsx
 * @description Application footer component.
 * Contains store navigation links, student university project credit, and copyright information.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo">
              <div className="brand-icon">🎮</div>
              <span className="brand-name">NexusPlay</span>
            </Link>
            <p className="footer-desc">
              Next-generation gaming console and accessories e-commerce platform.
              Built with React, Context API, and modern responsive design.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <span className="badge badge-cyan">⚡ Fast Delivery</span>
              <span className="badge badge-purple">🛡️ 1-Yr Warranty</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
              <li><Link to="/admin" style={{ color: 'var(--accent-cyan)' }}>🛡️ Admin Portal</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=Home Consoles">Home Consoles</Link></li>
              <li><Link to="/products?category=Handhelds">Handheld Gaming</Link></li>
              <li><Link to="/products?category=Accessories">Controllers & Gear</Link></li>
              <li><Link to="/products?category=VR & Audio">VR & Audio</Link></li>
            </ul>
          </div>

          {/* Academic / Viva Project Details */}
          <div className="footer-col">
            <h4>Academic Project</h4>
            <div className="project-credit-box">
              <p><strong>Course:</strong> Web Engineering / React</p>
              <p><strong>Instructor:</strong> Ma'am Samra</p>
              <p><strong>Architecture:</strong> React Router + Context + useReducer</p>
              <p><strong>API:</strong> FakeStoreAPI + Local Fallback</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p>© {currentYear} NexusPlay Gaming E-Commerce. Developed for Academic Viva Evaluation.</p>
          <p>Built with React & Vite. Responsive Plain CSS.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
