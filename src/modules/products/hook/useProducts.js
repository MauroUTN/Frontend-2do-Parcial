import { useState, useEffect } from 'react';
import { getProducts } from '../services/list';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState(''); // ejecuta búsqueda solo con enter/botón

  const [status, setStatus] = useState('todos');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts(appliedSearch, status, pageNumber, pageSize);

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

  useEffect(() => {
    loadProducts();
  }, [appliedSearch, status, pageNumber, pageSize]);

  // 🔥 ENTER o botón actualizan appliedSearch
  const handleSearch = () => {
    setPageNumber(1);
    setAppliedSearch(searchTerm);
  };

  const onChangeBusqueda = (e) => {
    if(e.target.value === ""){
       handleSearch();
    }
    setSearchTerm(e.target.value);
  };

  return {
    products,
    total,
    loading,
    searchTerm,
    appliedSearch,
    setStatus,
    onChangeBusqueda,
    handleSearch,
    pageNumber,
    pageSize,
    setPageSize,
    productStatus: { ALL: 'todos', ENABLED: 'true', DISABLED: 'false' }
  };
};

export default useProducts;
