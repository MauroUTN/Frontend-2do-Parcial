import { useEffect, useState } from 'react';
import useProducts from '../../products/hook/useProducts'; 
import ProductCardClient from '../components/ProductCardClient'; 
import Modal from '../../shared/components/Modal';
import ClientLoginForm from '../components/ClientLoginForm';
import ClientRegisterForm from '../components/ClientRegisterForm';
import { Navigate } from 'react-router-dom';

function CatalogPage() {
  const { products, loading, setStatus } = useProducts();
  
  // Estado local para modales (independiente del navbar por ahora)
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    setStatus('true');
  }, []);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {/* MODALES LOCALES PARA EL FLUJO DE COMPRA */}
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

      {/* GRILLA */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Cargando productos...</p>
      ) : (products || []).length === 0 ? (
        <div className="text-center py-20 text-gray-400 flex flex-col items-center">
           <p>No se encontraron productos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(products || []).map((product) => (
            <ProductCardClient 
              key={product.id || product.sku} 
              product={product} 
              // PASAMOS LA FUNCIÓN PARA ABRIR EL MODAL
              onRequireLogin={() => setActiveModal('login')}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default CatalogPage;