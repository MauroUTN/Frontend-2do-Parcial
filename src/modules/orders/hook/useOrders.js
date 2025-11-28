import { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await getOrders(searchTerm, status, pageNumber, pageSize);
      
      if (error) throw new Error(error);

      if (data) {
        setOrders(data.productItems || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error(err);
      setOrders([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, status, pageNumber, pageSize]);

  return {
    orders, total, loading,
    searchTerm, setSearchTerm,
    status, setStatus,
    pageNumber, setPageNumber,
    pageSize, setPageSize,
    refreshOrders: fetchOrders
  };
};