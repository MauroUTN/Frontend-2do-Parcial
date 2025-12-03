import { useEffect, useState } from 'react';
import useProducts from '../../products/hook/useProducts'; 
import ProductCardClient from '../components/ProductCardClient'; 
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import ClientLoginForm from '../components/ClientLoginForm';
import ClientRegisterForm from '../components/ClientRegisterForm';

function CatalogPage() {
  const { products, loading, setStatus, searchTerm, onChangeBusqueda, handleSearch } = useProducts();

  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    setStatus('true');
  }, []);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {/* MODALES */}
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

      {/* INPUT DE BUSQUEDA (ENTER + BOTÓN) */}
      <div className="w-[500px] flex justify-center gap-2 mb-5">
        <Input 
          value={searchTerm}
          onChange={onChangeBusqueda}
          placeholder="Buscar productos..."
          className="bg-white border-gray-300"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <Button onClick={handleSearch}>
          Buscar
        </Button>
      </div>

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
              onRequireLogin={() => setActiveModal('login')}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default CatalogPage;
