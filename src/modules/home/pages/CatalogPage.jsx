import { useEffect, useState } from 'react';
import useProducts from '../../products/hook/useProducts'; 
import ProductCardClient from '../components/ProductCardClient'; 

// Importa el Layout SOLO si lo necesitas para algo local, 
// pero recuerda que CatalogPage ya se renderiza DENTRO de ClientLayout en el Router.
// Aquí solo necesitamos la lógica de la grilla.

// IMPORTANTE: Como CatalogPage está dentro de ClientLayout, los modales ya están en el Layout.
// PERO, para controlar los modales DESDE AQUÍ (hijo) hacia el Layout (padre), lo ideal sería usar un Contexto de UI.
// SIN EMBARGO, para hacerlo rápido y simple sin crear más contextos, podemos Mover la lógica de modales aquí también o usar una prop.

// PLAN B (Más rápido): Copiar la lógica de modales aquí solo para esta acción, 
// o asumir que ClientLayout maneja el navbar y aquí manejamos el "Agregar".

// Vamos a usar la opción de tener los modales aquí también para el flujo de "Agregar al carrito".
import Modal from '../../shared/components/Modal';
import ClientLoginForm from '../components/ClientLoginForm';
import ClientRegisterForm from '../components/ClientRegisterForm';
import { Navigate } from 'react-router-dom';

function CatalogPage() {
  const { products, loading, setStatus } = useProducts();
  
  // Estado local para modales (independiente del navbar por ahora)
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    setStatus('enabled'); 
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