import { createContext, useState, useEffect } from 'react';

export const CardContext = createContext();

export function CardProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Cargar
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  // Guardar y Calcular Total
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    const newTotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    setTotal(newTotal);
  }, [items]);

  const addItem = (product, quantity) => {
    setItems(prev => {
      const existing = prev.find(x => x.productId === product.productId);
      if (existing) {
        return prev.map(x => x.productId === product.productId ? { ...x, quantity: x.quantity + quantity } : x);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, q) => {
    if (q < 1) return removeItem(productId);
    setItems(prev => prev.map(x => x.productId === productId ? { ...x, quantity: q } : x));
  };

  const removeItem = (id) => setItems(prev => prev.filter(x => x.productId !== id));
  const clearCart = () => setItems([]);

  return (
    <CardContext.Provider value={{ items, total, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CardContext.Provider>
  );
}

export default CardProvider;