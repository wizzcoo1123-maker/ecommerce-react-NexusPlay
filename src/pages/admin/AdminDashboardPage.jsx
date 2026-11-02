/**
 * @file AdminDashboardPage.jsx
 * @description Main Administrator Dashboard view (/admin).
 * Comprehensive control panel containing metrics analytics, full product catalog CRUD,
 * order tracking & status management, and system administration.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getStoredProducts,
  deleteProduct,
  getStoredOrders,
  updateOrderStatus,
  deleteOrder,
  getAdminMetrics,
  resetToDefaultData,
} from '../../services/adminService';
import ProductModal from '../../components/admin/ProductModal';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import '../../styles/admin.css';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();

  // Active view tab: 'overview' | 'products' | 'orders' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Products and Orders State
  const [products, setProducts] = useState(() => getStoredProducts());
  const [orders, setOrders] = useState(() => getStoredOrders());
  const [metrics, setMetrics] = useState(() => getAdminMetrics());

  // Products tab filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  // Orders tab filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Success toast/notification
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  }, []);

  const refreshAllData = useCallback(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setMetrics(getAdminMetrics());
  }, []);

  // Sync with events when products or orders change
  useEffect(() => {
    const handleProductsUpdate = () => refreshAllData();
    const handleOrdersUpdate = () => refreshAllData();

    window.addEventListener('nexusplay_products_updated', handleProductsUpdate);
    window.addEventListener('nexusplay_orders_updated', handleOrdersUpdate);

    return () => {
      window.removeEventListener('nexusplay_products_updated', handleProductsUpdate);
      window.removeEventListener('nexusplay_orders_updated', handleOrdersUpdate);
    };
  }, [refreshAllData]);

  // Product CRUD actions
  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      deleteProduct(product.id);
      showToast(`Product "${product.title}" was removed.`);
      refreshAllData();
    }
  };

  // Order status actions
  const handleOpenOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleStatusChange = (orderNumber, newStatus) => {
    updateOrderStatus(orderNumber, newStatus);
    showToast(`Order #${orderNumber} status changed to ${newStatus}.`);
    refreshAllData();
    if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteOrder = (orderNumber) => {
    if (window.confirm(`Are you sure you want to delete Order #${orderNumber}?`)) {
      deleteOrder(orderNumber);
      showToast(`Order #${orderNumber} deleted.`);
      refreshAllData();
    }
  };

  // Factory reset
  const handleResetData = () => {
    if (
      window.confirm(
        'Warning: This will restore the factory default 12 gaming products and sample orders. Continue?'
      )
    ) {
      resetToDefaultData();
      showToast('System data successfully reset to defaults.');
      refreshAllData();
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory =
        productCategoryFilter === 'All' || p.category === productCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = orderSearch.toLowerCase();
      const matchesSearch =
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q);
      const matchesStatus =
        orderStatusFilter === 'All' || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const uniqueCategories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  return (
    <div className="admin-page-container">
      {/* Admin Sticky Top Bar */}
      <header className="admin-topbar">
        <div className="container admin-topbar-inner">
          <div className="admin-topbar-brand">
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>NexusPlay Admin</span>
                <span className="admin-topbar-badge">SUPER ADMIN</span>
              </div>
              <small style={{ color: 'var(--text-muted)' }}>
                Session Active: <strong>{adminUser?.username || 'anasrahim111'}</strong>
              </small>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="admin-nav-tabs">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span>📊</span> Overview
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <span>🎮</span> Products ({products.length})
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span>📦</span> Orders ({orders.length})
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span>⚙️</span> Settings
            </button>
          </nav>

          {/* Right User Actions */}
          <div className="admin-topbar-user">
            <Link
              to="/"
              className="btn btn-outline btn-sm"
              title="Return to public customer store"
            >
              🏪 Storefront
            </Link>
            <div className="admin-user-pill">
              <div className="admin-avatar">AR</div>
              <span>{adminUser?.name || 'Anas Rahim'}</span>
            </div>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              title="End admin session"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className="animate-fade-in"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--accent-cyan)',
              border: '1px solid var(--accent-cyan)',
              boxShadow: '0 8px 24px rgba(0, 242, 254, 0.25)',
              padding: '0.85rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600,
            }}
          >
            <span>✓</span> {toastMessage}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD                                         */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Metric Cards */}
            <div className="admin-metrics-grid">
              <div className="metric-card revenue">
                <div className="metric-card-header">
                  <span className="metric-card-title">Total Gross Revenue</span>
                  <div className="metric-card-icon">💰</div>
                </div>
                <div className="metric-card-value">
                  ${metrics.totalRevenue.toFixed(2)}
                </div>
                <div className="metric-card-footer">
                  <span>Across {metrics.totalOrders} recorded orders</span>
                </div>
              </div>

              <div className="metric-card orders">
                <div className="metric-card-header">
                  <span className="metric-card-title">Customer Orders</span>
                  <div className="metric-card-icon">📦</div>
                </div>
                <div className="metric-card-value">{metrics.totalOrders}</div>
                <div className="metric-card-footer">
                  <span style={{ color: metrics.pendingOrders > 0 ? '#fcd34d' : 'var(--text-dim)' }}>
                    ● {metrics.pendingOrders} pending fulfillment
                  </span>
                </div>
              </div>

              <div className="metric-card products">
                <div className="metric-card-header">
                  <span className="metric-card-title">Catalog Inventory</span>
                  <div className="metric-card-icon">🎮</div>
                </div>
                <div className="metric-card-value">{metrics.totalProducts}</div>
                <div className="metric-card-footer">
                  <span>Active hardware SKUs</span>
                </div>
              </div>

              <div className="metric-card stock">
                <div className="metric-card-header">
                  <span className="metric-card-title">Low Stock Alert</span>
                  <div className="metric-card-icon">⚠️</div>
                </div>
                <div className="metric-card-value">{metrics.lowStockProducts}</div>
                <div className="metric-card-footer">
                  <span>Items with ≤ 5 units in stock</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '2rem',
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleOpenAddProduct}
              >
                ➕ Add New Hardware
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveTab('orders')}
              >
                📦 Review Customer Orders ({orders.length})
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setActiveTab('products')}
              >
                🎮 Manage Catalog ({products.length})
              </button>
            </div>

            {/* Recent Orders Overview */}
            <div className="admin-card-container">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Recent Customer Orders</h3>
                  <small style={{ color: 'var(--text-muted)' }}>
                    Latest transactions placed through the storefront
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setActiveTab('orders')}
                >
                  View All Orders →
                </button>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.orderNumber}>
                        <td>
                          <strong>#{order.orderNumber}</strong>
                        </td>
                        <td>
                          <div>{order.customer.name}</div>
                          <small style={{ color: 'var(--text-dim)' }}>
                            {order.customer.email}
                          </small>
                        </td>
                        <td>{order.orderDate}</td>
                        <td style={{ fontWeight: 700 }}>
                          ${Number(order.total).toFixed(2)}
                        </td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="table-btn view"
                            onClick={() => handleOpenOrderDetail(order)}
                          >
                            👁️ View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PRODUCTS MANAGEMENT                                        */}
        {/* ================================================================= */}
        {activeTab === 'products' && (
          <div className="admin-card-container">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Catalog Inventory Management</h3>
                <small style={{ color: 'var(--text-muted)' }}>
                  Create, edit, or delete gaming hardware displayed on the storefront
                </small>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleOpenAddProduct}
              >
                ➕ Add New Product
              </button>
            </div>

            {/* Search and Filters */}
            <div className="admin-actions-bar" style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search products by title or brand..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />

              <select
                className="admin-filter-select"
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
              >
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>

              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>

            {/* Products Table */}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const stock = Number(p.stock) || 0;
                    let stockClass = 'in-stock';
                    let stockLabel = `${stock} in stock`;
                    if (stock === 0) {
                      stockClass = 'out-of-stock';
                      stockLabel = 'Out of Stock';
                    } else if (stock <= 5) {
                      stockClass = 'low-stock';
                      stockLabel = `Low (${stock})`;
                    }

                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={p.image}
                              alt={p.title}
                              className="table-product-thumb"
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 600 }}>{p.title}</div>
                              <small style={{ color: 'var(--text-dim)' }}>
                                {p.brand || 'NexusPlay'} • ID: #{p.id}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-purple">{p.category}</span>
                        </td>
                        <td style={{ fontWeight: 700 }}>
                          ${Number(p.price).toFixed(2)}
                        </td>
                        <td>
                          <span className={`status-badge ${stockClass}`}>
                            {stockLabel}
                          </span>
                        </td>
                        <td>★ {p.rating?.rate || 4.5} ({p.rating?.count || 0})</td>
                        <td>
                          {p.featured ? (
                            <span className="badge badge-cyan">Featured</span>
                          ) : (
                            <span style={{ color: 'var(--text-dim)' }}>—</span>
                          )}
                        </td>
                        <td>
                          <div className="table-action-btns">
                            <button
                              type="button"
                              className="table-btn edit"
                              onClick={() => handleOpenEditProduct(p)}
                              title="Edit product specs"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="table-btn delete"
                              onClick={() => handleDeleteProduct(p)}
                              title="Delete from catalog"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: ORDERS MANAGEMENT                                          */}
        {/* ================================================================= */}
        {activeTab === 'orders' && (
          <div className="admin-card-container">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Customer Orders Management</h3>
                <small style={{ color: 'var(--text-muted)' }}>
                  Monitor orders, update dispatch statuses, and inspect buyer receipts
                </small>
              </div>
            </div>

            {/* Search and Status Filters */}
            <div className="admin-actions-bar" style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search by order #, customer name, email..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />

              <select
                className="admin-filter-select"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Showing {filteredOrders.length} of {orders.length} orders
              </span>
            </div>

            {/* Orders Table */}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                        <p style={{ color: 'var(--text-muted)' }}>No orders match your filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.orderNumber}>
                        <td>
                          <strong>#{o.orderNumber}</strong>
                        </td>
                        <td>
                          <div>{o.customer.name}</div>
                          <small style={{ color: 'var(--text-dim)' }}>
                            {o.customer.email}
                          </small>
                        </td>
                        <td>{o.orderDate}</td>
                        <td>
                          {o.items.reduce((s, i) => s + (Number(i.quantity) || 1), 0)} items
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          ${Number(o.total).toFixed(2)}
                        </td>
                        <td>
                          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td>
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.orderNumber, e.target.value)}
                            className="status-dropdown"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div className="table-action-btns">
                            <button
                              type="button"
                              className="table-btn view"
                              onClick={() => handleOpenOrderDetail(o)}
                              title="View invoice breakdown"
                            >
                              👁️ Invoice
                            </button>
                            <button
                              type="button"
                              className="table-btn delete"
                              onClick={() => handleDeleteOrder(o.orderNumber)}
                              title="Delete order"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SETTINGS & SYSTEM INFO                                     */}
        {/* ================================================================= */}
        {activeTab === 'settings' && (
          <div className="admin-card-container">
            <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>
              System & Administrator Settings
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              {/* Account Card */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                }}
              >
                <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                  👤 Administrator Account
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Username: </span>
                    <strong>anasrahim111</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Access Role: </span>
                    <span className="admin-topbar-badge">SUPER ADMIN</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Name: </span>
                    <span>Anas Rahim</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Session Security: </span>
                    <span style={{ color: '#6ee7b7' }}>● Verified & Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Data Storage Card */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                }}
              >
                <h4 style={{ color: 'var(--accent-purple)', marginBottom: '1rem' }}>
                  💾 Persistence Storage
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Products Key: </span>
                    <code>nexusplay_products</code>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Orders Key: </span>
                    <code>nexusplay_orders</code>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Cart Session: </span>
                    <code>nexusplay_cart_data</code>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Auth Session: </span>
                    <code>nexusplay_admin_session</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
              }}
            >
              <h4 style={{ color: '#fca5a5', marginBottom: '0.5rem' }}>
                ⚠️ Danger Zone: Restore Factory Demo Data
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Resetting will restore the default 12 gaming consoles and reset test order records.
                Useful for demonstrations and viva presentations.
              </p>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleResetData}
              >
                🔄 Restore Factory Default Catalog & Orders
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
        onSaved={() => {
          showToast(
            productToEdit
              ? 'Product updated successfully.'
              : 'New product added to catalog!'
          );
          refreshAllData();
        }}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
        onStatusChange={() => {
          refreshAllData();
        }}
      />
    </div>
  );
}

export default AdminDashboardPage;
