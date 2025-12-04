import { useState, useEffect } from 'react';
import { getProducts } from '../../products/services/list'; 
import { getOrders } from '../../orders/services/orderService'; 

const useDashboardStats = () => {
  const [stats, setStats] = useState({ 
    productCount: 0, 
    orderCount: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsRes, ordersRes] = await Promise.all([
          getProducts('', 'todos', 1, 1), 
          getOrders('', 'all', 1, 1)
        ]);

        setStats({
        
          productCount: productsRes.data?.total || 0,
          orderCount: ordersRes.data?.total || 0
        });

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, loading };
};

export default useDashboardStats;