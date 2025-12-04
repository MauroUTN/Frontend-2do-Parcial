import { useEffect, useState } from 'react';
import useProducts from '../../products/hook/useProducts'; 
import ProductCardClient from '../components/ProductCardClient'; 
import Modal from '../../shared/components/Modal';
import ClientLoginForm from '../components/ClientLoginForm';
import ClientRegisterForm from '../components/ClientRegisterForm';
import Button from '../../shared/components/Button';

function CatalogPage() {
  const { 
    products, 
    loading, 
    setStatus, 
    setSearchSku // Traemos esto para configurar el modo cliente
  } = useProducts(); 

  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    // CONFIGURACIÓN INICIAL PARA CLIENTES:
    setStatus('true');      // 1. Solo productos activos
    setSearchSku(false);    // 2. NO buscar por SKU (solo nombre)
  }, []);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {/* --- MODALES --- */}
      <Modal isOpen={activeModal === 'login'} onClose={closeModal} title="Inicia sesión para comprar">
        <ClientLoginForm 
          onSuccess={() => { closeModal(); }} 
          onSwitchToRegister={() => setActiveModal('register')} 
        />
      </Modal>

      <Modal isOpen={activeModal === 'register'} onClose={closeModal} title="Crear cuenta">
        <ClientRegisterForm 
          onSuccess={closeModal} 
          onSwitchToLogin={() => setActiveModal('login')}
        />
      </Modal>

      {/* --- GRILLA DE PRODUCTOS --- */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg animate-pulse">Cargando productos...</p>
        </div>
      ) : (products || []).length === 0 ? (
        <div className="text-center py-20 text-gray-400 flex flex-col items-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-lg font-medium text-gray-600">No encontramos lo que buscas.</p>
          <p className="text-sm text-gray-400">Intenta con otro término.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(products || []).map((product) => (
            <ProductCardClient 
              key={product.id || product.sku} 
              product={product}
              onRequireLogin={() => setActiveModal('login')}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default CatalogPage;