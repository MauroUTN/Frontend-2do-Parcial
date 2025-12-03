import { createContext, useState, useEffect } from 'react';

export const CardContext = createContext();

export function CardProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // --- FUNCIÓN MAESTRA PARA OBTENER ID ---
  // Esto arregla el problema de que a veces venga como 'id', 'Id' o 'productId'
  const getId = (product) => product.id || product.Id || product.productId;

  // 1. Cargar del LocalStorage con seguridad (try/catch)
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
        try {
            setItems(JSON.parse(stored));
        } catch (error) {
            console.error("El carrito estaba corrupto, se reinició.");
            localStorage.removeItem('cart');
            setItems([]);
        }
    }
  }, []);

  // 2. Guardar y Calcular Total
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    const newTotal = items.reduce((acc, item) => {
        // Buscamos el precio con varios nombres por seguridad
        const price = item.unitPrice || item.unitPrice || item.price || 0;
        return acc + (Number(price) * item.quantity);
    }, 0);
    
    setTotal(newTotal);
  }, [items]);

  // --- FUNCIONES DEL CARRITO ---

  const addItem = (product, quantity = 1) => {
    const targetId = getId(product);
    
    if (!targetId) {
        console.error("Producto sin ID válido:", product);
        return;
    }

    setItems(prev => {
      // Buscamos si ya existe usando la función segura
      const existing = prev.find(x => getId(x) === targetId);
      
      if (existing) {
        return prev.map(x => 
            getId(x) === targetId 
            ? { ...x, quantity: x.quantity + quantity } 
            : x
        );
      }
      // Al guardar, normalizamos el ID para que siempre tenga la propiedad 'id'
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