/**
 * @file api.js
 * @description Product API service layer.
 * Fetches product catalog from the free Fake Store API (https://fakestoreapi.com/products)
 * with automatic fallback to persistent local catalog in case of network issues, rate limits, or offline mode.
 * Synchronizes with admin-managed product inventory in localStorage.
 */

import { getStoredProducts } from './adminService';

const FAKE_STORE_URL = 'https://fakestoreapi.com/products';

/**
 * Fetches all products.
 * Tries the live Fake Store API first. If it fails, falls back gracefully to local catalog.
 * @param {string} mode - 'auto' | 'fakestore' | 'gaming'
 * @returns {Promise<{ products: Array, isFallback: boolean, error: string | null }>}
 */
export async function fetchAllProducts(mode = 'gaming') {
  const currentCatalog = getStoredProducts();

  // If user specifically requested the curated gaming console catalog
  if (mode === 'gaming') {
    return {
      products: currentCatalog,
      isFallback: false,
      source: 'Gaming Consoles (Live Store Catalog)',
      error: null,
    };
  }

  // Attempt to fetch from Fake Store API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(FAKE_STORE_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Fake Store API returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Fake Store API returned empty or invalid data');
    }

    return {
      products: data,
      isFallback: false,
      source: 'Fake Store API (Live)',
      error: null,
    };
  } catch (err) {
    console.warn('Fake Store API fetch failed. Using local fallback dataset:', err.message);
    return {
      products: currentCatalog,
      isFallback: true,
      source: 'Local Fallback (Offline Mode)',
      error: `Could not load Fake Store API (${err.message}). Displaying local catalog.`,
    };
  }
}

/**
 * Fetches a single product by ID.
 * Checks both local catalog and Fake Store API.
 * @param {number|string} id 
 * @returns {Promise<{ product: Object | null, isFallback: boolean, error: string | null }>}
 */
export async function fetchProductById(id) {
  const currentCatalog = getStoredProducts();

  // Check if it exists in local gaming products first (numerical or string ID match)
  const localProduct = currentCatalog.find((p) => String(p.id) === String(id));
  if (localProduct) {
    return {
      product: localProduct,
      isFallback: false,
      error: null,
    };
  }

  // Otherwise, attempt to fetch from Fake Store API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const numericId = Number(id);
    const response = await fetch(`${FAKE_STORE_URL}/${numericId}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Product #${numericId} not found on Fake Store API`);
    }

    const data = await response.json();
    return {
      product: data,
      isFallback: false,
      error: null,
    };
  } catch (err) {
    // If not found on API, try local catalog as a last resort
    const fallbackMatch = currentCatalog.find((p) => String(p.id) === String(id));
    if (fallbackMatch) {
      return {
        product: fallbackMatch,
        isFallback: true,
        error: null,
      };
    }

    return {
      product: null,
      isFallback: true,
      error: err.message || 'Product not found',
    };
  }
}
