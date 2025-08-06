// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id) => {
  setCart((prev) => prev.filter((item) => item.id !== id));
};

const updateQuantity = (id, quantity) => {
  setCart((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, quantity } : item
    )
  );
};

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart,clearCart ,addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

