import { instance } from '../../shared/api/axiosInstance';

export const createProduct = async (productData) => {
  // DEBE ESTAR ASÍ: Pasando productData directo
  const response = await instance.post('/products', productData);
  
  console.log("RESPUESTA DEL SERVIDOR:", response.data); // <--- Agregamos esto para ver qué dice
  return response.data;
};