import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth no debe ser usado por fuera de AuthProvider');
  }

  return {
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    singin: context.singin,
    signout: context.signout || context.logout,
    logout: context.logout,
  };

};

export default useAuth;