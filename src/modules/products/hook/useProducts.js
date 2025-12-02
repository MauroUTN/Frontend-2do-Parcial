import { useState, useEffect } from 'react';
import { getProducts } from '../services/list';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState(''); // Lo que escribes en el input
  const [appliedSearch, setAppliedSearch] = useState(''); // Lo que realmente se busca al dar click
  const [status, setStatus] = useState('todos');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Usamos 'appliedSearch' (lo confirmado) en lugar de 'searchTerm' (lo que se está escribiendo)
      const { data } = await getProducts(appliedSearch, status, pageNumber, pageSize);
      console.log("Datos recibidos en useProducts:", data);
      if (data) {
        setProducts(data.productItems || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 1. Recargar cuando cambie Página, Tamaño o Estado (Filtro)
  useEffect(() => {
    loadProducts();
  }, [pageNumber, pageSize, status, appliedSearch]); 

  // Función para el botón "Buscar"
  const handleSearch = () => {
    setPageNumber(1); // Reseteamos a la página 1 al buscar
    setAppliedSearch(searchTerm); // Confirmamos el término de búsqueda
  };

  // Función para manejar cambio de página
  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  return {
    products, total, loading,
    searchTerm, setSearchTerm,
    status, setStatus,
    pageNumber, pageSize, setPageSize,
    handleSearch,
    handlePageChange,
    totalPages: Math.ceil(total / pageSize),
    productStatus: { ALL: 'todos', ENABLED: 'true', DISABLED: 'false' }
  };
};

export default useProducts;