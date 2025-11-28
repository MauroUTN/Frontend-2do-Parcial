import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (searchTerm = '', status = '', page = 1, pageSize = 10) => {
  try {
    // Construimos los parámetros para la URL (query params)
    const params = new URLSearchParams();
    params.append('pageNumber', page);
    params.append('pageSize', pageSize);
    
    if (searchTerm) params.append('name', searchTerm); // El backend suele filtrar por 'name'
    if (status && status !== 'all') params.append('status', status);

    // Hacemos la petición GET al backend: /api/products?pageNumber=1...
    const response = await instance.get(`/products?${params.toString()}`);

    // El backend suele devolver la lista y el total para la paginación
    // Si tu backend devuelve directo el array, ajustamos aquí.
    // Asumimos estructura típica de paginación:
    return { 
      data: {
        productItems: response.data.items || response.data, // Lista de productos
        total: response.data.totalCount || response.data.length || 0 // Cantidad total
      }, 
      error: null 
    };

  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return { data: null, error: error.message };
  }
};