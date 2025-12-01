import { createContext, useState, useEffect } from 'react';

export const CardContext = createContext();

export function CardProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Cargar del LocalStorage al inicio
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  // Guardar en LocalStorage y Calcular Total
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    // CAMBIO: Usamos 'currentUnitPrice' porque así viene del Backend
    const newTotal = items.reduce((acc, item) => {
        const price = item.currentUnitPrice || 0; // Protección por si viene null
        return acc + (price * item.quantity);
    }, 0);
    
    setTotal(newTotal);
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      // CAMBIO: Usamos 'id' en lugar de 'productId'
      const existing = prev.find(x => x.id === product.id);
      
      if (existing) {
        // Si ya existe, sumamos la cantidad
        return prev.map(x => 
            x.id === product.id 
            ? { ...x, quantity: x.quantity + quantity } 
            : x
        );
      }
      // Si es nuevo, lo agregamos
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (id, q) => {
    if (q < 1) return removeItem(id);
    setItems(prev => prev.map(x => x.id === id ? { ...x, quantity: q } : x));
  };

  const removeItem = (id) => setItems(prev => prev.filter(x => x.id !== id));
  
  const clearCart = () => setItems([]);

  return (
    <CardContext.Provider value={{ items, total, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CardContext.Provider>
  );
}

export default CardProvider;