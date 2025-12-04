import { createBrowserRouter, Outlet, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import CatalogPage from './modules/home/pages/CatalogPage'; 
import SignUpPage from './modules/auth/pages/SignUpPage';
import CartPage from './modules/cart/pages/CartPage';

import ClientLayout from './modules/templates/components/ClientLayout';
import { ProductProvider } from './modules/products/context/ProductProvider';
import { CardProvider } from './modules/shared/context/CardProvider'; 

function App() {
  const router = createBrowserRouter([
    
    {
      path: '/',
     element: <ClientLayout />, 
      children: [
        {
          path: '/',
          element: <CatalogPage />,
        },
        {
          path: '/cart',
          element: <CartPage/>,
        },
      ],
    },
    
   
    {
      path: '/login',
      element: <LoginPage />,
    },
    
    {
      path: '/register', 
      element: <SignUpPage />,
    },

 {
    path: '/admin',
      element: 
          <ProtectedRoute allowedRoles={['Admin']}>
              <Dashboard />
          </ProtectedRoute>,
      children: [
        {
          index: true, 
          element: <Navigate to="/admin/home" replace />, 
        },
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