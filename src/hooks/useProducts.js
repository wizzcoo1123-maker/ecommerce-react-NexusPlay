/**
 * @file useProducts.js
 * @description Custom React hook to fetch and manage product catalog data.
 * Supports switching between the Gaming Consoles catalog and live Fake Store API,
 * with automatic fallback if the API fails, and live synchronization with admin inventory changes.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchAllProducts } from '../services/api';

export function useProducts(initialMode = 'gaming') {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');
  const [isFallback, setIsFallback] = useState(false);
  const [mode, setMode] = useState(initialMode);

  const loadData = useCallback(async (currentMode) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllProducts(currentMode);
      setProducts(result.products || []);
      setSource(result.source || '');
      setIsFallback(result.isFallback || false);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while loading products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(mode);

    // Re-fetch automatically when admin modifies product catalog
    const handleCatalogUpdate = () => {
      loadData(mode);
    };

    window.addEventListener('nexusplay_products_updated', handleCatalogUpdate);
    return () => {
      window.removeEventListener('nexusplay_products_updated', handleCatalogUpdate);
    };
  }, [mode, loadData]);

  const switchMode = (newMode) => {
    setMode(newMode);
  };

  const refetch = () => {
    loadData(mode);
  };

  return {
    products,
    loading,
    error,
    source,
    isFallback,
    mode,
    switchMode,
    refetch,
  };
}

export default useProducts;
