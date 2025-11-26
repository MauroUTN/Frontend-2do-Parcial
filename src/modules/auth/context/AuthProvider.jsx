import { createContext, useEffect, useState } from 'react';
import { login } from '../services/login'; // 1. Importamos el servicio que creamos antes

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // 2. Creamos la función singin que usa tu formulario
  const singin = async (username, password) => {
    // Llamamos al servicio real (Paso 3)
    const { data, error } = await login(username, password);

    if (data) {
      // Si hay data (token), guardamos y autenticamos
      localStorage.setItem('token', data); 
      setIsAuthenticated(true);
      return { success: true, error: null };
    } 
    
    // Si hubo error, lo devolvemos para que el formulario lo muestre
    return { success: false, error: { frontendErrorMessage: error } };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, singin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
