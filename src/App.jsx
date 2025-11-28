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

// 1. IMPORTAR LOS PROVIDERS
import { ProductProvider } from './modules/products/context/ProductProvider';
import { CardProvider } from './modules/shared/context/CardProvider'; 

function App() {
  const router = createBrowserRouter([
    // --- ZONA PÚBLICA (CLIENTES) ---
    {
      path: '/',
      element: <><Outlet /></>, // Aquí podrías agregar un <Navbar /> público más adelante
      children: [
        {
          path: '/',
          // CAMBIO REALIZADO: Ahora muestra el catálogo en lugar de ir al login
          element: <CatalogPage />, 
        },
        {
          path: '/cart',
          element: <>Carrito de compras</>,
        },
      ],
    },
    
    // --- LOGIN ---
    {
      path: '/login',
      element: <LoginPage />,
    },
    // --- SIGNUP ---
    {
      path: '/register', 
      element: <SignUpPage />,
    },

    // --- ZONA PRIVADA (ADMINISTRADOR) ---
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