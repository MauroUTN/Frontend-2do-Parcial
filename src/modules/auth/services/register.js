import { instance } from '../../shared/api/axiosInstance';

export const registerUser = async (userData) => {
  try {
    // Ajusta la URL si tu endpoint es diferente, pero suele ser /auth/register
    const response = await instance.post('/auth/register', userData);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error en registro:", error);
    return { 
      data: null, 
      // Intenta leer el mensaje de error del backend
      error: error.response?.data?.detail || error.response?.data?.[0]?.description || 'Error al registrar usuario' 
    };
  }
};