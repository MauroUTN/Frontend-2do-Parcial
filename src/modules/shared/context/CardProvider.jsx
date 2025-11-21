import { createContext, useState } from 'react';

// 1. Creas el contexto
const CardContext = createContext();

function CardProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const addItem = (item) => {
    setItems([...items, item]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    // 2. Provees los valores
    <CardContext.Provider value={{ items, total, addItem, removeItem }}>
      {children}
    </CardContext.Provider>
  );
}

// 3. Exportas ambos
export { CardProvider, CardContext };