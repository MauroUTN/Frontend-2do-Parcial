import { useContext } from 'react';
// Asumimos que crearás este contexto
import { CardContext } from '../context/CardProvider'; 

const useCard = () => {
  const context = useContext(CardContext);

  if (!context) {
    throw new Error('useCard no debe ser usado por fuera de CardProvider');
  }

  return {
    items: context.items,             // Items dentro de la card/carrito
    total: context.total,             // Precio total o estado
    addItem: context.addItem,         // Función para agregar
    removeItem: context.removeItem,   // Función para quitar
  };
};

export default useCard;