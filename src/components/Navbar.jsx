/**
 * @file Navbar.jsx
 * @description Main site header and navigation bar.
 * Displays brand logo, category routing links, mobile menu, and live cart badge.
 */

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/navbar.css';

export function Navbar() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <div className="brand-icon">🎮</div>
          <span className="brand-name">NexusPlay</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                All Products
              </NavLink>
            </li>
            <li>
              <Link to="/products?category=Home Consoles" className="nav-link">
                Consoles
              </Link>
            </li>
            <li>
              <Link to="/products?category=Handhelds" className="nav-link">
                Handhelds
              </Link>
            </li>
            <li>
              <Link to="/products?category=Accessories" className="nav-link">
                Accessories
              </Link>
            </li>
          </ul>
        </nav>

        {/* Navbar Right Actions (Cart & Mobile Button) */}
        <div className="navbar-actions">
          {/* Shopping Cart Button */}
          <Link to="/cart" className="cart-button" aria-label="View Shopping Cart">
            <svg
              className="cart-icon-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="cart-badge" title={`${totalItems} items in cart`}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu open">
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            Home
          </Link>
          <Link to="/products" className="nav-link" onClick={closeMobileMenu}>
            All Products
          </Link>
          <Link
            to="/products?category=Home Consoles"
            className="nav-link"
            onClick={closeMobileMenu}
          >
            Consoles
          </Link>
          <Link
            to="/products?category=Handhelds"
            className="nav-link"
            onClick={closeMobileMenu}
          >
            Handhelds
          </Link>
          <Link
            to="/products?category=Accessories"
            className="nav-link"
            onClick={closeMobileMenu}
          >
            Accessories
          </Link>
          <Link to="/cart" className="nav-link" onClick={closeMobileMenu}>
            Cart ({totalItems})
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
