/**
 * @file RatingStars.jsx
 * @description Reusable star rating component.
 * Displays fractional or full star icons with review count.
 */

import React from 'react';

export function RatingStars({ rate = 0, count = 0, showCount = true }) {
  const rounded = Math.round(rate * 2) / 2; // Round to nearest 0.5

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'flex', color: '#fbbf24', fontSize: '0.9rem' }} aria-label={`Rating: ${rate} out of 5`}>
        {[1, 2, 3, 4, 5].map((starIndex) => {
          if (rounded >= starIndex) {
            // Full star
            return <span key={starIndex}>★</span>;
          } else if (rounded >= starIndex - 0.5) {
            // Half star representation
            return <span key={starIndex} style={{ opacity: 0.85 }}>★</span>;
          } else {
            // Empty star
            return <span key={starIndex} style={{ color: '#475569' }}>☆</span>;
          }
        })}
      </div>
      <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {rate.toFixed(1)}
      </span>
      {showCount && count > 0 && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          ({count})
        </span>
      )}
    </div>
  );
}

export default RatingStars;
