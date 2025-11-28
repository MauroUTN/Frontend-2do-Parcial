// src/modules/home/pages/CatalogPage.jsx
import { useEffect } from 'react';
import useProducts from '../../products/hook/useProducts'; 
import ProductCardClient from '../components/ProductCardClient'; 

function CatalogPage() {
  const { products, loading, setStatus } = useProducts(); // setSearchTerm se maneja diferente ahora

  useEffect(() => {
    setStatus('enabled'); 
  }, []);

  return (
    <> 
      {/* Ya no hay <header> aquí, está en el Layout */}
      
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
    </>
  );
}

export default CatalogPage;