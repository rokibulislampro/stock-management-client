export const totalItem = cart => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const totalPrice = cart => {
  return cart.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0
  );
};

const CartReducer = (state, action) => {
  switch (action.type) {
    case 'Add':
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

    case 'Increase':
      return state.map(item =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
      );

    case 'Decrease':
      return state.map(item =>
        item.id === action.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

    case 'Remove':
      return state.filter(item => item.id !== action.id);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export default CartReducer;
