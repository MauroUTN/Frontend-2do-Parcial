import { createContext, useState, useEffect } from 'react';

export const CardContext = createContext();

export function CardProvider({ children }) {
  // 1. SOLUCIÓN: Inicialización perezosa (Lazy State)
  // Lee localStorage al inicio, evitando que se sobrescriba con [] al recargar
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      return [];
    }
  });

  const [total, setTotal] = useState(0);

  const getId = (product) => product.id || product.Id || product.productId;

  // 2. Efecto solo para GUARDAR y Calcular Total
  // (Ya no necesitamos el efecto de lectura porque lo hicimos en el useState)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    const newTotal = items.reduce((acc, item) => {
        const price = item.unitPrice || item.unitPrice || item.price || 0;
        return acc + (Number(price) * item.quantity);
    }, 0);
    
    setTotal(newTotal);
  }, [items]);

  const addItem = (product, quantity = 1) => {
    const targetId = getId(product);
    
    if (!targetId) {
        console.error("Producto sin ID válido:", product);
        return;
    }

    setItems(prev => {
      const existing = prev.find(x => getId(x) === targetId);
      
      if (existing) {
        return prev.map(x => 
            getId(x) === targetId 
            ? { ...x, quantity: x.quantity + quantity } 
            : x
        );
      }
      return [...prev, { ...product, id: targetId, quantity }];
    });
  };

  const updateQuantity = (id, q) => {
    if (q < 1) {
        removeItem(id);
        return;
    }
    setItems(prev => prev.map(x => getId(x) === id ? { ...x, quantity: q } : x));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(x => getId(x) !== id));
  };
  
  const clearCart = () => setItems([]);

  return (
    <CardContext.Provider value={{ items, total, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CardContext.Provider>
  );
}

export default CardProvider;