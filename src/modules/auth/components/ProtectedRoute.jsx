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

  // 1. Si NO está logueado -> Login
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // 2. NUEVO: Si la ruta pide roles específicos (ej: ['Admin'])
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = getUserRoleFromToken();
    
    // Si el rol del usuario NO está en la lista permitida -> Lo sacamos al inicio
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to='/' replace />;
    }
  }

  return children;
};

export default ProtectedRoute;