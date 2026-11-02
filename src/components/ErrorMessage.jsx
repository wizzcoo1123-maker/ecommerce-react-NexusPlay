/**
 * @file ErrorMessage.jsx
 * @description Error display component with retry action and fallback messaging.
 */

import React from 'react';

export function ErrorMessage({
  message = 'Failed to load products.',
  onRetry = null,
  fallbackNotice = null,
}) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '2rem auto',
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
      <h3 style={{ color: '#fca5a5', marginBottom: '0.5rem' }}>Something Went Wrong</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
        {message}
      </p>

      {fallbackNotice && (
        <p
          style={{
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            color: 'var(--accent-cyan)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}
        >
          {fallbackNotice}
        </p>
      )}

      {onRetry && (
        <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
          ↻ Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
