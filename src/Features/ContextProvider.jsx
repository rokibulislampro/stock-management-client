import React, { createContext, useReducer, useEffect } from 'react';
import CartReducer from './CartReducer';

export const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem('cart')) || [];

const ContextProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(CartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default ContextProvider;
