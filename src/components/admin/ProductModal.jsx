/**
 * @file ProductModal.jsx
 * @description Modal dialog for Adding and Editing products in the Admin catalog.
 */

import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../../services/adminService';

const DEFAULT_CATEGORIES = [
  'Home Consoles',
  'Handhelds',
  'Accessories',
  'VR & Audio',
];

export function ProductModal({ isOpen, onClose, productToEdit, onSaved }) {
  const isEditing = Boolean(productToEdit);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Home Consoles',
    price: '',
    brand: '',
    stock: 10,
    image: '',
    description: '',
    featured: false,
    ratingRate: 4.8,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || '',
        category: productToEdit.category || 'Home Consoles',
        price: productToEdit.price !== undefined ? productToEdit.price : '',
        brand: productToEdit.brand || '',
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 10,
        image: productToEdit.image || '',
        description: productToEdit.description || '',
        featured: Boolean(productToEdit.featured),
        ratingRate: productToEdit.rating?.rate || 4.8,
      });
    } else {
      setFormData({
        title: '',
        category: 'Home Consoles',
        price: '',
        brand: '',
        stock: 10,
        image: '',
        description: '',
        featured: false,
        ratingRate: 4.8,
      });
    }
    setError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Product title is required.');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price greater than $0.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a product description.');
      return;
    }

    try {
      if (isEditing) {
        updateProduct(productToEdit.id, formData);
      } else {
        addProduct(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-box animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            <span>{isEditing ? '✏️ Edit Hardware' : '➕ Add New Hardware'}</span>
          </h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label required" htmlFor="modal-title">
                Product Title
              </label>
              <input
                id="modal-title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. Sony PlayStation 5 Pro"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label required" htmlFor="modal-category">
                  Category
                </label>
                <select
                  id="modal-category"
                  name="category"
                  className="form-input"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="modal-brand">
                  Manufacturer / Brand
                </label>
                <input
                  id="modal-brand"
                  name="brand"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sony, Microsoft, Valve"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label required" htmlFor="modal-price">
                  Price ($ USD)
                </label>
                <input
                  id="modal-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="1"
                  className="form-input"
                  placeholder="499.99"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="modal-stock">
                  Stock Units
                </label>
                <input
                  id="modal-stock"
                  name="stock"
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="15"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-image">
                Image URL
              </label>
              <input
                id="modal-image"
                name="image"
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={handleChange}
              />
              {formData.image && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#fff',
                      padding: '4px',
                      border: '1px solid var(--border-light)',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <small style={{ color: 'var(--text-muted)' }}>Image thumbnail preview</small>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="modal-description">
                Description & Hardware Specs
              </label>
              <textarea
                id="modal-description"
                name="description"
                rows={3}
                className="form-input"
                placeholder="Enter console hardware specifications, resolution, storage capacity, etc."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <input
                id="modal-featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="modal-featured" style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                ⭐ Mark as Spotlight / Featured Product on Storefront
              </label>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
