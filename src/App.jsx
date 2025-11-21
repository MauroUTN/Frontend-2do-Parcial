import { createBrowserRouter, Outlet, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';

// 1. IMPORTAR LOS NUEVOS PROVIDERS
import { ProductProvider } from './modules/products/context/ProductProvider';
import { CardProvider } from './modules/shared/context/CardProvider'; 

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Outlet /></>,
      children: [
        {
          path: '/',
          // AQUÍ ESTÁ EL CAMBIO: Redirige a /login automáticamente
          element: <Navigate to="/login" replace />,
        },
        {
          path: '/cart',
          element: <>Carrito de compras</>,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/admin',
      element: 
          <ProtectedRoute>
              <Dashboard />
          </ProtectedRoute>,
      children: [
        {
          path: '/admin/home',
          element: <Home />,
        },
        {
          path: '/admin/products',
          element: <ListProductsPage />,
        },
        {
          path: '/admin/products/create',
          element: <CreateProductPage />,
        },
        {
          path: '/admin/orders',
          element: <ListOrdersPage />,
        },
      ],
    },
  ]);

  // 2. AGREGARLOS EN EL RETURN, ANIDÁNDOLOS
  return (
    <AuthProvider>
      <ProductProvider>
        <CardProvider>
          <RouterProvider router={router} />
        </CardProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;