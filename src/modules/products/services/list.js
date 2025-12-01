import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (searchTerm = '', status = '', page = 1, pageSize = 10) => {
  try {
    // Usamos URLSearchParams para armar la query string limpiamente
    const params = new URLSearchParams();
    
    params.append('pageNumber', page);
    params.append('pageSize', pageSize);

    // Solo agregamos el nombre si el usuario escribió algo
    if (searchTerm) {
        params.append('name', searchTerm); 
    }

    // Solo agregamos status si no es 'all'
    if (status && status !== 'all') {
        params.append('status', status === 'enabled'); // Convertimos 'enabled'/'disabled' a true/false si tu back lo pide así, o mandamos el string directo.
        // NOTA: Si tu back espera 'true'/'false' usa la linea de arriba. 
        // Si espera 'enabled'/'disabled', usa: params.append('status', status);
    }

    const response = await instance.get(`/products?${params.toString()}`);

    return { 
      data: {
        productItems: response.data.items || response.data, 
        total: response.data.totalCount || 0 
      }, 
      error: null 
    };
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};