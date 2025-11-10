import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartContextType, CartItem } from '../types/Cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'lvlup-cart';

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        typeof item?.id === 'string' &&
        typeof item?.precio === 'number' &&
        typeof item?.cantidad === 'number'
    );
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [items]);

  const addItem: CartContextType['addItem'] = (item, cantidad = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          cantidad: updated[existingIndex].cantidad + cantidad
        };
        return updated;
      }
      return [...prev, { ...item, cantidad }];
    });
  };

  const removeItem: CartContextType['removeItem'] = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity: CartContextType['updateQuantity'] = (id, cantidad) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: Math.max(1, cantidad) } : item
      )
    );
  };

  const increment: CartContextType['increment'] = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item))
    );
  };

  const decrement: CartContextType['decrement'] = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad - 1) } : item
      )
    );
  };

  const clearCart: CartContextType['clearCart'] = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.cantidad, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [items]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      increment,
      decrement,
      clearCart
    }),
    [items, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
