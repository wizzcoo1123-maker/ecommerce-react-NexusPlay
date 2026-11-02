/**
 * @file HomePage.jsx
 * @description Storefront home page featuring hero promotion, value propositions,
 * interactive category links, and featured gaming hardware highlights.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/home.css';

export function HomePage() {
  const { products, loading, error, refetch } = useProducts('gaming');

  // Filter 4 top featured products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-tag">
              🚀 Next-Gen Gaming Has Arrived
            </span>
            <h1 className="hero-title">
              Power Your Play With <span className="gradient-text">Elite Consoles</span> & Gear
            </h1>
            <p className="hero-subtitle">
              Discover cutting-edge PlayStation 5, Xbox Series X, Nintendo Switch OLED,
              and premier handhelds. Built for speed, 4K ray tracing, and uncompromised immersion.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore All Consoles →
              </Link>
              <Link to="/products?category=Handhelds" className="btn btn-secondary btn-lg">
                Handheld Systems
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <h4>4K 120Hz</h4>
                <p>Ultra-High Fidelity</p>
              </div>
              <div className="stat-item">
                <h4>100% Genuine</h4>
                <p>Official Warranty</p>
              </div>
              <div className="stat-item">
                <h4>24/7</h4>
                <p>Player Support</p>
              </div>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-card-preview">
              <span className="badge badge-cyan" style={{ marginBottom: '1rem' }}>
                ⭐ Spotlight Hardware
              </span>
              <img
                src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
                alt="PlayStation 5 Console"
                className="hero-image"
              />
              <div className="hero-card-info">
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                    PlayStation 5 Slim 1TB
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Ultra High-Speed SSD • Tempest 3D Audio
                  </p>
                </div>
                <Link to="/product/101" className="btn btn-outline btn-sm">
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h3>1-Year Manufacturer Warranty</h3>
              <p>Every console is 100% authentic, brand-sealed, and backed with a full 12-month guarantee.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Express Priority Delivery</h3>
              <p>Free tracked courier shipping on all orders over $150 with protective anti-shock packaging.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💳</div>
              <h3>Safe & Flexible Payments</h3>
              <p>Pay with Credit Card, PayPal, or Cash on Delivery at your doorstep without hidden fees.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎮</div>
              <h3>Pro-Gamer Assistance</h3>
              <p>Need setup advice or controller pairing help? Our support team is available around the clock.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Links */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Platform Categories</span>
            <h2>Choose Your Battlefield</h2>
            <p>From living room 4K powerhouses to portable handheld beasts and pro accessories.</p>
          </div>

          <div className="categories-grid">
            <CategoryCard
              title="Home Consoles"
              icon="📺"
              description="PlayStation 5, Xbox Series X, and Nintendo Switch for maximum living room entertainment."
              categorySlug="Home Consoles"
              count="4+"
            />
            <CategoryCard
              title="Handhelds"
              icon="🕹️"
              description="Steam Deck OLED, ROG Ally, and portable champions to play your full library anywhere."
              categorySlug="Handhelds"
              count="3+"
            />
            <CategoryCard
              title="Controllers & Gear"
              icon="🎮"
              description="DualSense, Xbox Elite 2, pro gamepads, mice, and responsive gaming mechanical gear."
              categorySlug="Accessories"
              count="5+"
            />
            <CategoryCard
              title="VR & Audio"
              icon="🥽"
              description="Meta Quest 3, PS VR2, and audiophile gaming wireless headsets for full spatial immersion."
              categorySlug="VR & Audio"
              count="3+"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Curated Highlights</span>
            <h2>Top Rated Hardware</h2>
            <p>Our most popular consoles and flagship accessories loved by competitive gamers.</p>
          </div>

          {loading && <LoadingSpinner message="Loading featured consoles..." />}

          {error && (
            <ErrorMessage
              message={error}
              onRetry={refetch}
              fallbackNotice="Displaying offline cached product catalog."
            />
          )}

          {!loading && displayProducts.length > 0 && (
            <div className="products-grid">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="featured-actions">
            <Link to="/products" className="btn btn-outline btn-lg">
              View All Hardware Catalog ({products.length} Items) →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
