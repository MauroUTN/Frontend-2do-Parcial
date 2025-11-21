import { useContext } from 'react';
import { ProductContext } from '../context/ProductProvider';

const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProducts no debe ser usado por fuera de ProductProvider');
  }

  return context; // Devuelve todo lo que pusimos en el "value" del Provider
};

export default useProducts;