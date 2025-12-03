import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', 
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
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      if (window.location.pathname.includes('/admin/')) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      } else {
        localStorage.removeItem('token');
      }
    }

    return Promise.reject(error);
  },
);

export { instance };