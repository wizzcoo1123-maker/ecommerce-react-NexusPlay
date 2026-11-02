/**
 * @file ProductsPage.jsx
 * @description Catalog browsing page.
 * Implements category filtering, live text search, sorting by price/rating,
 * data source switching (Fake Store API vs Local Gaming Catalog), and responsive grid.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/products.css';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') || 'All';

  // State
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Custom hook fetching products with fallback
  const {
    products,
    loading,
    error,
    source,
    isFallback,
    mode,
    switchMode,
    refetch,
  } = useProducts('gaming');

  // Sync category state when URL search parameter changes
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  // Extract unique categories from current product list
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
    return ['All', ...unique];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Search Box Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // default order
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('default');
    setSearchParams({});
  };

  return (
    <div className="products-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '1.75rem' }}>
          <span className="subtitle">Official Catalog</span>
          <h2>Explore Gaming Systems & Hardware</h2>
          <p>
            Browse high-performance home consoles, handhelds, pro controllers, and audio gear.
          </p>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="products-toolbar">
          {/* Top Row: Search & Sort */}
          <div className="toolbar-top-row">
            {/* Search Box */}
            <div className="search-box-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search consoles, headsets, controllers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="sort-select-wrapper">
              <label htmlFor="sort-select" className="sort-label">
                Sort By:
              </label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Featured / Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="name-asc">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="category-pills">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-pill ${
                  selectedCategory.toLowerCase() === category.toLowerCase() ? 'active' : ''
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Data Source Bar / Viva Demonstration Switcher */}
          <div className="catalog-source-bar">
            <div className="source-status">
              <span className={`source-indicator-dot ${isFallback ? 'fallback' : ''}`} />
              <span>
                <strong>Data Source:</strong> {source || 'Loading...'}
              </span>
              {isFallback && (
                <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                  Fallback Active
                </span>
              )}
            </div>

            <div className="source-toggle-buttons">
              <button
                type="button"
                className={`btn btn-sm ${mode === 'gaming' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => switchMode('gaming')}
                title="Switch to Curated Gaming Consoles local dataset"
              >
                🎮 Gaming Consoles
              </button>
              <button
                type="button"
                className={`btn btn-sm ${mode === 'fakestore' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => switchMode('fakestore')}
                title="Fetch live products from Fake Store API"
              >
                🌐 Fake Store API Live
              </button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && <LoadingSpinner message="Fetching console inventory..." />}

        {/* Error Alert */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={refetch}
            fallbackNotice="Local fallback dataset automatically loaded so your shopping is uninterrupted."
          />
        )}

        {/* Product Grid */}
        {!loading && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
              }}
            >
              <span>
                Showing <strong>{filteredProducts.length}</strong> of{' '}
                <strong>{products.length}</strong> items
              </span>
              {selectedCategory !== 'All' && (
                <span>
                  Filtering by: <strong>{selectedCategory}</strong>
                </span>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-results-box">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮🔍</div>
                <h3>No Products Found</h3>
                <p>
                  We couldn't find any gaming hardware matching your current search or category
                  filter.
                </p>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleResetFilters}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
