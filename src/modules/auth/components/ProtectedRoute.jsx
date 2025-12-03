import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">
      Cargando sesión...
    </div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return children;
};

export default ProtectedRoute;