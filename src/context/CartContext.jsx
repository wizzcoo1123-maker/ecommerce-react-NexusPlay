/**
 * @file CartContext.jsx
 * @description React Context Provider managing global shopping cart state.
 * Uses useReducer for predictable state updates and persists data in localStorage.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartReducer, CART_ACTIONS } from './cartReducer';

const CART_STORAGE_KEY = 'nexusplay_cart_data';

// Helper to safely load initial cart state from localStorage
const loadInitialState = () => {
  try {
    const rawData = localStorage.getItem(CART_STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return { items: parsed };
      }
    }
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
  }
  return { items: [] };
};

// Create the Context
const CartContext = createContext(null);

/**
 * CartProvider component wrapping the application
 */
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, loadInitialState);

  // Synchronize cart with localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  // Action dispatchers
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: { product, quantity },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: productId,
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity },
    });
  };

  const increaseQuantity = (productId) => {
    dispatch({
      type: CART_ACTIONS.INCREASE_QUANTITY,
      payload: productId,
    });
  };

  const decreaseQuantity = (productId) => {
    dispatch({
      type: CART_ACTIONS.DECREASE_QUANTITY,
      payload: productId,
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Calculated values
  const totalItems = state.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const subtotal = state.items.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }, 0);

  // Free shipping on orders over $150, otherwise $15 flat
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.0;

  // 5% standard tax
  const tax = subtotal * 0.05;

  const total = subtotal + shipping + tax;

  const value = {
    cartItems: state.items,
    totalItems,
    subtotal,
    shipping,
    tax,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Custom hook to consume the CartContext easily
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
