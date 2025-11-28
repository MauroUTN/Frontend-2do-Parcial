import { useState, useEffect } from 'react';
import { getProducts } from '../services/list'; // Importamos el servicio real

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadProducts = async () => {
    setLoading(true);
    try {
        const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);
        
        if (data) {
            // IMPORTANTE: Usamos "|| []" para que no explote si viene vacío
            setProducts(data.productItems || []);
            setTotal(data.total || 0);
        }
    } catch (err) {
        setProducts([]); // Si falla, lista vacía para evitar errores
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm, status, pageNumber, pageSize]);

  // Exponemos todo lo que necesita la página
  return {
    products, total, loading,
    searchTerm, setSearchTerm,
    status, setStatus,
    pageNumber, setPageNumber,
    pageSize, setPageSize,
    // Constantes para el select (si las necesitas)
    productStatus: { ALL: 'all', ENABLED: 'enabled', DISABLED: 'disabled' },
    refresh: loadProducts
  };
};

export default useProducts;