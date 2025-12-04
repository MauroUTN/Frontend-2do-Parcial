import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import { getUserRoleFromToken } from '../../shared/helpers/jwtHelper'; // <--- Importamos el helper nuevo

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">
      Cargando sesión...
    </div>; 
  }

  
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

 
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = getUserRoleFromToken();
    
   
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to='/' replace />;
    }
  }

  return children;
};

export default ProtectedRoute;