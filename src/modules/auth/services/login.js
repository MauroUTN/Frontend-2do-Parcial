import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await instance.post('/auth/login', { username, password });

    // --- CORRECCIÓN FINAL ---
    // El backend devuelve { token: "..." }, así que accedemos a .token
    return { data: response.data.token, error: null }; 
    
  } catch (error) {
    if (error.response) {
       return { data: null, error: error.response.data.detail || 'Error de credenciales' };
    }
    return { data: null, error: 'No se pudo conectar con el servidor' };
  }
};