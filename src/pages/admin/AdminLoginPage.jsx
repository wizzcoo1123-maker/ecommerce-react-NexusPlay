/**
 * @file AdminLoginPage.jsx
 * @description Administrator authentication login view (/admin/login).
 * Authenticates username (anasrahim111) and password (12344).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import '../../styles/admin.css';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated, redirect straight to admin panel
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both administrator username and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      setLoading(false);

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    }, 400);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card animate-fade-in">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-shield-icon">🛡️</div>
          <h1 className="admin-login-title">NexusPlay Admin</h1>
          <p className="admin-login-subtitle">
            Restricted Control Panel & Catalog Management
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label required" htmlFor="admin-username">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              className="form-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label required" htmlFor="admin-password">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: 0,
                  marginBottom: '0.35rem',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="•••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? '🔐 Authenticating...' : 'Sign In as Administrator →'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'color var(--transition-fast)',
            }}
          >
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
