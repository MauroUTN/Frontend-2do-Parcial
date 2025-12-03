import { useState, useEffect } from 'react';
import { listOrders } from '../services/listServices';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState(''); // 🔥 Solo busca cuando se confirma (ENTER)

  const [status, setStatus] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await listOrders(appliedSearch, status, pageNumber, pageSize);

      if (error) throw new Error(error);

      if (data) {
        setOrders(data.items || data.Items || []);
        setTotal(data.totalPages || 0);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta cuando cambia algo que sí dispara una búsqueda
  useEffect(() => {
    console.log("Estoy buscando")
    fetchOrders();
  }, [appliedSearch, status, pageNumber, pageSize]);

  // Se ejecuta solo cuando presiono ENTER
  const confirmSearch = () => {
    setAppliedSearch(searchTerm);
    setPageNumber(1);
  };

  const handleInputChange = (e) => {
    console.log(e.target.value)
    setSearchTerm(e.target.value);
  };

  return {
    orders, total, loading,
    searchTerm, appliedSearch,
    status, setStatus,
    handleInputChange,
    confirmSearch,
    pageNumber, setPageNumber,
    pageSize, setPageSize,
  };
};
