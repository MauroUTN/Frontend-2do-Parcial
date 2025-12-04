import { instance } from '../../shared/api/axiosInstance';

export const createProduct = async (productData) => {
  
  const response = await instance.post('/products', productData);
  
  console.log("RESPUESTA DEL SERVIDOR:", response.data); 
  return response.data;
};