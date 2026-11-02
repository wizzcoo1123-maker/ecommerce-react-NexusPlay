/**
 * @file cartReducer.js
 * @description Reducer function managing cart state transformations.
 * Handles adding, removing, updating quantities, and clearing items.
 */

export const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  INCREASE_QUANTITY: 'INCREASE_QUANTITY',
  DECREASE_QUANTITY: 'DECREASE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
};

/**
 * Cart Reducer
 * @param {Object} state - { items: Array }
 * @param {Object} action - { type: string, payload: any }
 * @returns {Object} next state
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Product already in cart, increment quantity
        const updatedItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            return {
              ...item,
              quantity: item.quantity + Number(quantity),
            };
          }
          return item;
        });
        return { ...state, items: updatedItems };
      }

      // New product added to cart
      return {
        ...state,
        items: [...state.items, { ...product, quantity: Math.max(1, Number(quantity)) }],
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const productId = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== productId),
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity: parsedQty } : item
        ),
      };
    }

    case CART_ACTIONS.INCREASE_QUANTITY: {
      const productId = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }

    case CART_ACTIONS.DECREASE_QUANTITY: {
      const productId = action.payload;
      return {
        ...state,
        items: state.items
          .map((item) => {
            if (item.id === productId) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          })
          .filter((item) => item.quantity > 0),
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
      };
    }

    default:
      return state;
  }
}
