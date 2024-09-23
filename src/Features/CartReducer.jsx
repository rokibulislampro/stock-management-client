// Calculate total items in the cart
export const totalItem = cart => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Calculate total price of items in the cart
export const totalPrice = cart => {
  return cart.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0
  );
};

// Cart Reducer function
const CartReducer = (state, action) => {
  switch (action.type) {
    case 'Add': {
      const clothIndex = state.findIndex(item => item.id === action.cloth.id);
      const quantityToAdd = action.cloth.quantity || 1;

      if (clothIndex >= 0) {
        return state.map((item, index) =>
          index === clothIndex
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        return [...state, { ...action.cloth, quantity: quantityToAdd }];
      }
    }

    case 'Increase': {
      return state.map(item =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }

    case 'Decrease': {
      return state.map(item =>
        item.id === action.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    }

    case 'Remove': {
      return state.filter(item => item.id !== action.id);
    }

    case 'CLEAR_CART': {
      return [];
    }

    // New case to handle sale price update
    case 'UpdateSalePrice': {
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, salePrice: action.payload.salePrice }
          : item
      );
    }

    default:
      return state;
  }
};

export default CartReducer;
