import { createContext, useEffect, useState } from 'react';
import { login } from '../services/login'; 

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (data) {
      localStorage.setItem('token', data); 
      setIsAuthenticated(true);
      return { success: true, error: null };
    } 
    
    return { success: false, error: { frontendErrorMessage: error } };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const signout = logout;

  return (
    <AuthContext.Provider value={{ isAuthenticated, singin, logout, signout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };