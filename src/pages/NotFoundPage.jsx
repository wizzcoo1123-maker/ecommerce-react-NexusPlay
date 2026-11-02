/**
 * @file NotFoundPage.jsx
 * @description 404 error page displayed when users navigate to a non-existent route.
 * Features a playful gaming theme, diagnostic info, and navigation links.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/notFound.css';

export function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-card animate-fade-in">
          <div className="not-found-glitch-code">404</div>
          <h1 className="not-found-subtitle">⚠️ LEVEL NOT FOUND • GAME OVER</h1>
          <p className="not-found-desc">
            The secret level or hardware item at{' '}
            <code
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-cyan)',
              }}
            >
              {location.pathname}
            </code>{' '}
            could not be rendered. It might have respawned at a different URL or been disconnected.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-lg">
              🏠 Respawn at Home
            </Link>
            <Link to="/products" className="btn btn-secondary btn-lg">
              🎮 Browse Hardware Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
