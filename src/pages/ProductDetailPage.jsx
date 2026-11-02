/**
 * @file ProductDetailPage.jsx
 * @description Single product detail view (/product/:id).
 * Shows high-resolution image, title, rating, stock status, full description,
 * quantity selector (+/-), and Add to Cart action with instant feedback.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { fallbackProducts } from '../data/fallbackProducts';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/productDetail.css';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const fallbackImg =
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setQuantity(1);
    setIsAdded(false);

    async function getProduct() {
      try {
        const result = await fetchProductById(id);
        if (!isMounted) return;

        if (result.product) {
          setProduct(result.product);
        } else {
          setError(result.error || 'Product not found.');
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load product details.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 10) return 10; // Cap single-order quantity
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  // Find related products in same category (excluding current product)
  const relatedProducts = fallbackProducts
    .filter((p) => p.id !== Number(id) && (product ? p.category === product.category : true))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSpinner message="Loading hardware specifications..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <ErrorMessage
          message={error || 'We could not find the requested gaming hardware.'}
          onRetry={() => navigate('/products')}
          fallbackNotice="Click below to return to the full product catalog."
        />
      </div>
    );
  }

  const formattedPrice = Number(product.price).toFixed(2);
  const ratingRate = product.rating?.rate || 4.8;
  const ratingCount = product.rating?.count || 120;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to="/products">Products</Link>
          <span className="separator">/</span>
          {product.category && (
            <>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
                {product.category}
              </Link>
              <span className="separator">/</span>
            </>
          )}
          <span className="current">{product.title}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="product-detail-layout">
          {/* Image Column */}
          <div className="product-detail-image-wrap">
            <img
              src={product.image || fallbackImg}
              alt={product.title}
              className="product-detail-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImg;
              }}
            />
          </div>

          {/* Info Column */}
          <div className="product-detail-info">
            <div className="detail-category-row">
              <span className="badge badge-cyan">{product.category}</span>
              {product.brand && (
                <span className="badge badge-purple">{product.brand}</span>
              )}
            </div>

            <h1 className="product-detail-title">{product.title}</h1>

            <div className="detail-rating-row">
              <RatingStars rate={ratingRate} count={ratingCount} />
              <div className="stock-status">
                <span className="stock-dot" />
                <span>In Stock & Ready to Ship</span>
              </div>
            </div>

            <div className="product-detail-price">
              <span className="currency">$</span>
              <span>{formattedPrice}</span>
            </div>

            <p className="product-detail-description">{product.description}</p>

            {/* Actions: Quantity Selector & Add To Cart */}
            <div className="detail-actions-box">
              <div className="quantity-control" aria-label="Quantity Selector">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-display" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`btn ${isAdded ? 'btn-primary' : 'btn-primary'} btn-lg add-to-cart-large-btn`}
                onClick={handleAddToCart}
                style={
                  isAdded
                    ? { background: 'var(--success)', color: '#fff', borderColor: 'var(--success)' }
                    : {}
                }
              >
                {isAdded ? (
                  <>✓ Added {quantity} to Cart!</>
                ) : (
                  <>🛒 Add to Cart • ${(Number(product.price) * quantity).toFixed(2)}</>
                )}
              </button>

              {isAdded && (
                <Link to="/cart" className="btn btn-secondary btn-lg">
                  View Cart →
                </Link>
              )}
            </div>

            {/* Trust Badges */}
            <ul className="product-perks-list">
              <li className="perk-item">
                <span className="perk-icon">🛡️</span>
                <span>100% Genuine 1-Year Brand Warranty</span>
              </li>
              <li className="perk-item">
                <span className="perk-icon">🚚</span>
                <span>Express Tracked Dispatch within 24h</span>
              </li>
              <li className="perk-item">
                <span className="perk-icon">🔄</span>
                <span>30-Day Hassle-Free Return Policy</span>
              </li>
              <li className="perk-item">
                <span className="perk-icon">🔒</span>
                <span>Safe 256-Bit SSL Encrypted Checkout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Related Hardware Section */}
        {relatedProducts.length > 0 && (
          <section className="related-section">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <span className="subtitle">Similar Hardware</span>
              <h2>You Might Also Like</h2>
            </div>
            <div className="products-grid">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
