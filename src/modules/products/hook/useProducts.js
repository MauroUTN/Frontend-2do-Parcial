import { useContext } from 'react';
import { ProductContext } from '../context/ProductProvider';

const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }

  return context;
};

export default useProducts;