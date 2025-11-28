import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  try {
    // Axios lanza una excepción si el status no es 2xx (ej: 400, 401, 500)
    const response = await instance.post('/auth/login', { username, password });

    // Si llegamos aquí, es porque todo salió bien (Status 200-299)
    // Asegúrate si tu backend devuelve { token: "..." } o directo el token
    // Aquí asumo que response.data es el objeto { token: "..." }
    return { data: response.data, error: null }; 
    
  } catch (error) {
    // Aquí capturamos el error si falla (400, 401, etc.)
    
    // 1. Si el servidor respondió con un error (ej: credenciales malas)
    if (error.response) {
       // El backend suele mandar el mensaje en 'detail' o 'message'
       // Ajusta 'detail' según lo que devuelva tu C#
       return { data: null, error: error.response.data.detail || 'Error de credenciales' };
    }
    
    // 2. Si no hubo respuesta (servidor apagado o sin internet)
    return { data: null, error: 'No se pudo conectar con el servidor' };
  }
};