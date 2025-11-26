import { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await getOrders(searchTerm, status);
      if (data) {
  setOrders(data.items || []); // <--- Agrega el "|| []" aquí
  setTotal(data.total || 0);
} else {
  setOrders([]); // <--- Y si no hay data, setea vacío
}
    };

    fetchData();
  }, [searchTerm, status]); // Se recarga cuando cambian los filtros

  return {
    orders,
    loading,
    setSearchTerm,
    setStatus
  };
};

export default useOrders;