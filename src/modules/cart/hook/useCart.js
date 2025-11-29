import { useContext } from 'react';
import { CardContext } from '../../shared/context/CardProvider';

const useCart = () => {
  const context = useContext(CardContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de un CardProvider');
  }

  return context;
};

export default useCart;