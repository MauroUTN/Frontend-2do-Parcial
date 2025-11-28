import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../products/hook/useProducts'; 
import ProductCardClient from '../components/ProductCardClient'; 

import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

function CatalogPage() {
  const navigate = useNavigate();
  const { 
    products, 
    loading, 
    setSearchTerm, 
    setStatus 
  } = useProducts();

  useEffect(() => {
    setStatus('enabled'); 
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* NAVBAR */}
      <header className="sticky top-0 bg-white z-20 shadow-sm border-b border-gray-200 h-20 px-6 flex items-center justify-between">
        
        {/* IZQUIERDA (Logo + Menu) - Flex-1 para empujar */}
        <div className="flex-1 flex items-center gap-8 h-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white font-bold text-xl pb-1">
               J
             </div>
             <span className="font-bold text-xl tracking-tight text-gray-900">
               Store
             </span>
          </div>

          <nav className="hidden lg:flex gap-4 items-center">
            <span className="text-black cursor-pointer bg-gray-100 px-4 py-2 rounded-full font-semibold text-sm">
              Productos
            </span>
            <span 
              className="cursor-pointer hover:text-black transition-colors px-4 py-2 font-semibold text-sm text-gray-500"
              onClick={() => navigate('/cart')}
            >
              Carrito de compras
            </span>
          </nav>
        </div>

        {/* CENTRO (Buscador) - Sin flex-1, ancho fijo centrado */}
        <div className="w-[500px] flex justify-center">
           {/* Al quitarle la altura fija al Input.jsx, esto ahora sí se centra verticalmente */}
           <Input 
             placeholder="Buscar productos..." 
             onChange={(e) => setSearchTerm(e.target.value)}
             className="bg-white border-gray-300"
           />
        </div>

        {/* DERECHA (Botones) - Flex-1 para empujar al otro lado */}
        <div className="flex-1 flex items-center justify-end gap-3 h-full">
          <Button 
            onClick={() => navigate('/login')}
            variant="default"
            className="w-auto px-6 whitespace-nowrap"
          >
            Iniciar Sesión
          </Button>
          
          <Button 
            onClick={() => navigate("/register")} 
            variant="secondary"
            className="w-auto px-6 whitespace-nowrap"
          >
            Registrar Usuario
          </Button>
        </div>
      </header>

      {/* GRILLA DE PRODUCTOS */}
      <main className="max-w-[1400px] mx-auto p-6 bg-gray-50 min-h-[calc(100vh-80px)]">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Cargando productos...</p>
        ) : (products || []).length === 0 ? (
          <div className="text-center py-20 text-gray-400">
             No se encontraron productos.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(products || []).map((product) => (
              <ProductCardClient 
                key={product.id || product.sku} 
                product={product} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CatalogPage;