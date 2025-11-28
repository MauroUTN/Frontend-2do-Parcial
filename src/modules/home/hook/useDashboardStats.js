import { useState, useEffect } from 'react';
// Importamos tus servicios existentes basándonos en tu foto
import { getProducts } from '../../products/services/list'; 
// OJO: Si en orders usas 'listServices.js', cambia la importación aquí abajo:
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

        // Hacemos las dos peticiones en paralelo.
        // Pedimos pageSize: 1 porque solo nos interesa el dato 'total' del backend, no la lista entera.
        const [productsRes, ordersRes] = await Promise.all([
          getProducts('', 'all', 1, 1), // Search vacío, status all, pág 1, tamaño 1
          getOrders('', 'all', 1, 1)
        ]);

        setStats({
          // Accedemos a .data.total (o totalCount, según como responda tu backend)
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