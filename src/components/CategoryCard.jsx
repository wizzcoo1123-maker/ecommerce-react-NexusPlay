/**
 * @file CategoryCard.jsx
 * @description Card component displaying a product category shortcut on the Home page.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export function CategoryCard({ title, icon, description, count, categorySlug }) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(categorySlug)}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        transition: 'all var(--transition-normal)',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="category-card"
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(139, 92, 246, 0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          marginBottom: '1.25rem',
          border: '1px solid rgba(0, 242, 254, 0.3)',
        }}
      >
        {icon}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>
          {title}
        </h3>
        {count && <span className="badge badge-cyan">{count} Items</span>}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
        {description}
      </p>

      <span
        style={{
          marginTop: 'auto',
          color: 'var(--accent-cyan)',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}
      >
        Explore Collection →
      </span>
    </Link>
  );
}

export default CategoryCard;
