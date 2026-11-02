/**
 * @file ProductCard.jsx
 * @description Product card component representing a single catalog item.
 * Displays image, title, rating, price, and provides quick Add to Cart and detail link.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import RatingStars from './RatingStars';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Fallback image in case the remote image fails to load
  const fallbackImg = 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const formattedPrice = Number(product.price).toFixed(2);
  const ratingRate = product.rating?.rate || 4.5;
  const ratingCount = product.rating?.count || 0;

  return (
    <article className="product-card">
      {product.featured && (
        <span className="badge badge-purple product-card-badge">Featured</span>
      )}

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="product-card-image-wrap">
        <img
          src={product.image || fallbackImg}
          alt={product.title}
          className="product-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg;
          }}
        />
      </Link>

      {/* Body Details */}
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-title" title={product.title}>
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h3>

        <div className="product-card-rating">
          <RatingStars rate={ratingRate} count={ratingCount} />
        </div>

        {/* Footer with Price and Add to Cart */}
        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="currency">$</span>
            {formattedPrice}
          </div>

          <button
            type="button"
            className={`product-card-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdded ? (
              <>
                <span>✓</span> Added
              </>
            ) : (
              <>
                <span>+</span> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
