/**
 * @file adminService.js
 * @description Admin service layer managing authentication credentials,
 * product catalog CRUD operations, and order lifecycle management via localStorage.
 */

import fallbackData from '../data/fallbackProducts.json';

export const ADMIN_CREDENTIALS = {
  username: 'anasrahim111',
  password: '12344',
  name: 'Anas Rahim',
  role: 'Super Administrator',
  email: 'anasrahim111@nexusplay.com',
};

const PRODUCTS_STORAGE_KEY = 'nexusplay_products';
const ORDERS_STORAGE_KEY = 'nexusplay_orders';
const ADMIN_AUTH_KEY = 'nexusplay_admin_session';

// Sample Seed Orders for immediate realistic dashboard metrics
const SEED_ORDERS = [
  {
    orderNumber: 'NX-842109',
    orderDate: new Date(Date.now() - 3600000 * 5).toLocaleString(),
    customer: {
      name: 'Ethan Walker',
      email: 'ethan.walker@example.com',
      phone: '+1 (555) 349-8821',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      country: 'United States',
    },
    paymentMethod: 'card',
    items: [
      {
        id: 101,
        title: 'Sony PlayStation 5 Slim Console',
        price: 499.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 107,
        title: 'PlayStation DualSense Wireless Controller',
        price: 69.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80',
      },
    ],
    subtotal: 569.98,
    shipping: 0,
    tax: 28.5,
    total: 598.48,
    status: 'Delivered',
  },
  {
    orderNumber: 'NX-731920',
    orderDate: new Date(Date.now() - 3600000 * 24).toLocaleString(),
    customer: {
      name: 'Marcus Vance',
      email: 'm.vance@gaminghub.io',
      phone: '+1 (555) 781-9942',
      address: '104 Silicon Parkway, Suite 400',
      city: 'Austin',
      postalCode: '78701',
      country: 'United States',
    },
    paymentMethod: 'paypal',
    items: [
      {
        id: 104,
        title: 'Valve Steam Deck OLED 512GB Handheld',
        price: 549.0,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      },
    ],
    subtotal: 549.0,
    shipping: 0,
    tax: 27.45,
    total: 576.45,
    status: 'Shipped',
  },
  {
    orderNumber: 'NX-621845',
    orderDate: new Date(Date.now() - 3600000 * 48).toLocaleString(),
    customer: {
      name: 'Elena Rostova',
      email: 'elena.rostova@cybermail.net',
      phone: '+1 (555) 912-3341',
      address: '22 Baker St, Apt 4B',
      city: 'Seattle',
      postalCode: '98101',
      country: 'United States',
    },
    paymentMethod: 'cod',
    items: [
      {
        id: 108,
        title: 'Xbox Elite Wireless Controller Series 2',
        price: 179.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
      },
    ],
    subtotal: 179.99,
    shipping: 0,
    tax: 9.0,
    total: 188.99,
    status: 'Processing',
  },
];

/* -------------------------------------------------------------------------- */
/*                          AUTHENTICATION HELPERS                            */
/* -------------------------------------------------------------------------- */

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading admin session:', err);
  }
  return null;
}

export function setAdminSession(user) {
  try {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Error saving admin session:', err);
  }
}

export function clearAdminSession() {
  try {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  } catch (err) {
    console.error('Error clearing admin session:', err);
  }
}

/* -------------------------------------------------------------------------- */
/*                            PRODUCTS CRUD                                   */
/* -------------------------------------------------------------------------- */

export function getStoredProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Seed initial products if storage is empty
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(fallbackData));
  } catch (err) {
    console.error('Error reading products from localStorage:', err);
  }
  return fallbackData;
}

export function saveStoredProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('nexusplay_products_updated'));
  } catch (err) {
    console.error('Error saving products to localStorage:', err);
  }
}

export function addProduct(productData) {
  const products = getStoredProducts();
  const nextId = products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 101;

  const newProduct = {
    id: nextId,
    title: productData.title.trim(),
    price: parseFloat(productData.price) || 0,
    description: productData.description.trim(),
    category: productData.category.trim() || 'Home Consoles',
    brand: productData.brand?.trim() || 'NexusPlay',
    image:
      productData.image?.trim() ||
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    stock: parseInt(productData.stock, 10) >= 0 ? parseInt(productData.stock, 10) : 10,
    featured: Boolean(productData.featured),
    rating: {
      rate: parseFloat(productData.ratingRate) || 4.8,
      count: parseInt(productData.ratingCount, 10) || 1,
    },
  };

  const updated = [newProduct, ...products];
  saveStoredProducts(updated);
  return newProduct;
}

export function updateProduct(id, productData) {
  const products = getStoredProducts();
  const numericId = Number(id);

  const updated = products.map((p) => {
    if (p.id === numericId) {
      return {
        ...p,
        title: productData.title !== undefined ? productData.title.trim() : p.title,
        price: productData.price !== undefined ? parseFloat(productData.price) : p.price,
        description: productData.description !== undefined ? productData.description.trim() : p.description,
        category: productData.category !== undefined ? productData.category.trim() : p.category,
        brand: productData.brand !== undefined ? productData.brand.trim() : p.brand,
        image: productData.image !== undefined ? productData.image.trim() : p.image,
        stock: productData.stock !== undefined ? parseInt(productData.stock, 10) : p.stock,
        featured: productData.featured !== undefined ? Boolean(productData.featured) : p.featured,
        rating: {
          rate: productData.ratingRate !== undefined ? parseFloat(productData.ratingRate) : p.rating?.rate || 4.5,
          count: productData.ratingCount !== undefined ? parseInt(productData.ratingCount, 10) : p.rating?.count || 10,
        },
      };
    }
    return p;
  });

  saveStoredProducts(updated);
  return updated.find((p) => p.id === numericId);
}

export function deleteProduct(id) {
  const products = getStoredProducts();
  const numericId = Number(id);
  const updated = products.filter((p) => p.id !== numericId);
  saveStoredProducts(updated);
  return true;
}

/* -------------------------------------------------------------------------- */
/*                             ORDERS MANAGEMENT                              */
/* -------------------------------------------------------------------------- */

export function getStoredOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    // Seed initial orders if empty
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SEED_ORDERS));
    return SEED_ORDERS;
  } catch (err) {
    console.error('Error reading orders from localStorage:', err);
  }
  return SEED_ORDERS;
}

export function saveStoredOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('nexusplay_orders_updated'));
  } catch (err) {
    console.error('Error saving orders to localStorage:', err);
  }
}

export function addOrder(orderData) {
  const orders = getStoredOrders();
  const newOrder = {
    ...orderData,
    status: orderData.status || 'Processing',
  };
  const updated = [newOrder, ...orders];
  saveStoredOrders(updated);
  return newOrder;
}

export function updateOrderStatus(orderNumber, newStatus) {
  const orders = getStoredOrders();
  const updated = orders.map((o) => {
    if (o.orderNumber === orderNumber) {
      return { ...o, status: newStatus };
    }
    return o;
  });
  saveStoredOrders(updated);
  return updated.find((o) => o.orderNumber === orderNumber);
}

export function deleteOrder(orderNumber) {
  const orders = getStoredOrders();
  const updated = orders.filter((o) => o.orderNumber !== orderNumber);
  saveStoredOrders(updated);
  return true;
}

/* -------------------------------------------------------------------------- */
/*                            METRICS & RESET                                 */
/* -------------------------------------------------------------------------- */

export function getAdminMetrics() {
  const products = getStoredProducts();
  const orders = getStoredOrders();

  const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => (Number(p.stock) || 0) <= 5).length;
  const pendingOrders = orders.filter((o) => o.status === 'Processing' || o.status === 'Pending').length;

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    lowStockProducts,
    pendingOrders,
  };
}

export function resetToDefaultData() {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(fallbackData));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SEED_ORDERS));
    window.dispatchEvent(new Event('nexusplay_products_updated'));
    window.dispatchEvent(new Event('nexusplay_orders_updated'));
    return true;
  } catch (err) {
    console.error('Error resetting store data:', err);
    return false;
  }
}
