import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (name = '', status = 'todos', page = 1, pageSize, searchSku = false) => { 
  try {
    const params = new URLSearchParams();

    params.append('pageNumber', page);
    params.append('pageSize', pageSize);

    if (name) params.append('name', name);
    if (status && status !== 'todos') params.append('status', status);
    
    params.append('searchSku', searchSku); 

    const response = await instance.get(`/products/paged?${params.toString()}`);

    return { 
      data: {
        productItems: response.data.items || response.data.Items || [], 
        total: response.data.totalCount || response.data.totalCount || 0 
      }, 
      error: null 
    };

  } catch (error) {
    console.error("Error en getProducts:", error);
    return { data: null, error: error };
  }
};