import { instance } from '../../shared/api/axiosInstance';

export const getOrders = async (searchTerm = '', status = '', page = 1, pageSize = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('pageNumber', page);
    params.append('pageSize', pageSize);
    
    // Si hay búsqueda, la enviamos (ajusta 'customerName' si tu back usa otro nombre)
    if (searchTerm) params.append('customerName', searchTerm);
    
    // Si hay estado y no es 'all', lo enviamos
    if (status && status !== 'all') params.append('status', status);

    const response = await instance.get(`/orders?${params.toString()}`);

    return { 
      data: {
        // Ajustamos por si el backend devuelve "items" o directo el array
        productItems: response.data.items || response.data, 
        total: response.data.totalCount || response.data.length || 0
      }, 
      error: null 
    };

  }
  
   catch (error) {
    console.error("Error obteniendo órdenes:", error);
    return { data: null, error: error.message };
  }
};
export const createOrder = async (orderPayload) => {
  try {
    const response = await instance.post('/orders', orderPayload);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error creando orden:", error);
    // Devolvemos el mensaje de error del backend si existe (ej: "Stock insuficiente")
    const msg = error.response?.data?.detail || error.response?.data || "Error al procesar la orden";
    return { data: null, error: msg };
  }
};