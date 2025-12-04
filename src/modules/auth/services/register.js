import { instance } from '../../shared/api/axiosInstance';

export const registerUser = async (userData) => {
  try {
    
    const response = await instance.post('/auth/register', userData);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error en registro:", error);
    return { 
      data: null, 
      
      error: error.response?.data?.detail || error.response?.data?.[0]?.description || 'Error al registrar usuario' 
    };
  }
};