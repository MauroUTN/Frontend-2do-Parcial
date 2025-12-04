import { useContext } from 'react';
import { CardContext } from '../context/CardProvider'; 

const useCard = () => {
  const context = useContext(CardContext);

  if (!context) {
    throw new Error('useCard no debe ser usado por fuera de CardProvider');
  }

  return {
    items: context.items,             
    total: context.total,             
    addItem: context.addItem,         
    removeItem: context.removeItem,   
  };
};

export default useCard;