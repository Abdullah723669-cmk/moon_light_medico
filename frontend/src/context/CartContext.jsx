import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (medicine, quantity) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === medicine.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === medicine.id ? { ...item, quantity: item.quantity + parseInt(quantity) } : item
        );
      }
      return [...prevCart, { ...medicine, quantity: parseInt(quantity) }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) => prevCart.map(item => item.id === id ? { ...item, quantity: parseInt(quantity) } : item));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
