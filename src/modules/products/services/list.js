import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (name = '', status = 'todos', page = 1, pageSize) => {
  try {
    const params = new URLSearchParams();
/*     if (status.toLowerCase() == 'all')
    {
      status = 'todos';
    }
    else if (status.toLowerCase() == 'enabled')
    {
      status = 'true';
    }
    else (status.toLowerCase() == 'disabled')
    {
      status = 'false';
    } */
    console.log("getProducts - Parámetros:", { name, status, page, pageSize });
    // 1. Parámetros que TU BACKEND SÍ PIDE (según el código que pasaste)
    params.append('pageNumber', page);
    params.append('pageSize', pageSize);

    // 2. Filtros (Los enviamos igual, pero tu backend actual 'GetProductsPaged' los va a ignorar 
    // a menos que modifiques C# para que reciba 'name' y 'status' también)
    if (name) {
        params.append('name', name); 
    }

    if (status && status !== 'todos') {
        // Asumiendo que quieres mandar true/false. Si prefieres texto, quita la comparación.
        params.append('status', status === 'true'); 
    }

    // 3. CAMBIO CRÍTICO: La ruta ahora es '/products/paged'
    // Esto coincide con el [HttpGet("paged")] de tu Controller
    const response = await instance.get(`/products/paged?${params.toString()}`);

    return { 
      data: {
        // Adaptamos la respuesta (C# suele devolver PascalCase: Items, TotalCount)
        productItems: response.data.items || response.data.Items || [], 
        total: response.data.totalPages || response.data.totalPages || 0 
      }, 
      error: null 
    };

  } catch (error) {
    console.error("Error en getProducts:", error);
    return { data: null, error: error };
  }
};