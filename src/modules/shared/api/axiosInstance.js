import axios from 'axios';

const instance = axios.create({
  // CAMBIO AQUÍ: Usamos '/api' para que Vite intercepte la llamada y la mande al puerto 5142
  baseURL: '/', 
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (config) => { return config; },
  (error) => {
    // Nota: axios a veces devuelve el status dentro de error.response
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      if (window.location.pathname.includes('/admin/')) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        localStorage.removeItem('token');
      }
    }

    return Promise.reject(error);
  },
);

export { instance };