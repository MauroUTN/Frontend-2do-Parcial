import { useEffect, useState } from 'react';

const CART_KEY = 'cart';

export default function useCart() {
  const [items, setItems] = useState([]);

  // Leer del localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (err) {
      console.error('Error leyendo carrito desde localStorage', err);
    }
  }, []);

  // Persistir en localStorage cada vez que cambian los items
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error guardando carrito en localStorage', err);
    }
  }, [items]);

  const addItem = (product, quantity = 1) => {
    if (quantity <= 0) return; // mínimo 1

    setItems((prev) => {
      const existing = prev.find((x) => x.productId === product.productId);
      if (existing) {
        return prev.map((x) =>
          x.productId === product.productId
            ? { ...x, quantity: x.quantity + quantity }
            : x
        );
      }

      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      return removeItem(productId);
    }

    setItems((prev) =>
      prev.map((x) =>
        x.productId === productId ? { ...x, quantity } : x
      )
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  return {
    items,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
