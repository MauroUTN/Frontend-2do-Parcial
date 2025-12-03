import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hook/useCart';
import ProductCartClient from '../components/ProductCartClient';
import Button from '../../shared/components/Button';
import { instance } from '../../shared/api/axiosInstance'; 
import Modal from '../../shared/components/Modal';
import ClientLoginForm from '../../home/components/ClientLoginForm';
import ClientRegisterForm from '../../home/components/ClientRegisterForm';

function CartPage() {
  const navigate = useNavigate();
  
  const {
    items,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [activeModal, setActiveModal] = useState(null); // Para login/registro
  const [isProcessing, setIsProcessing] = useState(false);
  
  // NUEVO ESTADO: Para el modal de borrar carrito
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const hasItems = items.length > 0;

  const submitOrder = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        shippingAddress: "Dirección por defecto",
        billingAddress: "Dirección por defecto",
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      await instance.post('/orders', orderData);
      
      alert("¡Compra realizada con éxito!");
      clearCart();
      navigate('/'); 
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || "Error al procesar la orden";
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizePurchase = () => {
    const token = localStorage.getItem('token');
    if (token) {
      submitOrder();
    } else {
      setActiveModal('login');
    }
  };

  const handleLoginSuccess = () => {
    setActiveModal(null);
    submitOrder(); 
  };

  // Función para confirmar el vaciado
  const handleConfirmClear = () => {
    clearCart();
    setShowClearCartModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* --- MODALES DE LOGIN/REGISTRO --- */}
      <Modal isOpen={activeModal === 'login'} onClose={() => setActiveModal(null)} title="Inicia sesión">
        <ClientLoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setActiveModal('register')} />
      </Modal>
      <Modal isOpen={activeModal === 'register'} onClose={() => setActiveModal(null)} title="Crear cuenta">
        <ClientRegisterForm onSuccess={() => setActiveModal(null)} onSwitchToLogin={() => setActiveModal('login')} />
      </Modal>

      {/* --- NUEVO MODAL: CONFIRMAR VACIAR CARRITO --- */}
      <Modal 
        isOpen={showClearCartModal} 
        onClose={() => setShowClearCartModal(false)} 
        title="¿Vaciar carrito?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar todos los productos del carrito? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 mt-2 justify-end">
            <Button 
              variant="secondary" 
              onClick={() => setShowClearCartModal(false)}
              className="w-auto px-4"
            >
              Cancelar
            </Button>
            <Button 
              variant="default" 
              onClick={handleConfirmClear}
              className="w-auto px-4 bg-red-100 text-red-700 hover:bg-red-200" // Estilo rojo para acción destructiva
            >
              Sí, vaciar
            </Button>
          </div>
        </div>
      </Modal>


      {/* SECCIÓN IZQUIERDA: Lista */}
      <section className="flex-1 bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-xl font-bold text-gray-800">Carrito de compras</h1>
           {hasItems && (
             <button 
               // CAMBIO AQUÍ: Abrimos el modal en lugar del window.confirm
               onClick={() => setShowClearCartModal(true)}
               className="text-sm text-red-500 hover:text-red-700 hover:underline font-medium transition-colors"
             >
               Vaciar carrito
             </button>
           )}
        </div>

        {!hasItems && (
          <div className="text-gray-400 py-10 text-center flex flex-col items-center gap-4">
            <p>Tu carrito está vacío.</p>
            <Button variant="secondary" className="w-auto px-6" onClick={() => navigate('/')}>
              Volver al catálogo
            </Button>
          </div>
        )}

        {hasItems && (
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <ProductCartClient 
                key={item.productId} 
                item={item} 
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN DERECHA: Resumen */}
      <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-sm p-6 h-fit border border-gray-100 sticky top-24">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Detalle de pedido</h2>

        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Cantidad de productos</span>
          <span className="font-medium">{items.reduce((acc, x) => acc + x.quantity, 0)}</span>
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
          <span className="text-base font-bold text-gray-800">Total a pagar</span>
          <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>

        <Button
          className="w-full rounded-lg py-3 font-bold"
          variant="default"
          disabled={!hasItems || isProcessing}
          onClick={handleFinalizePurchase}
        >
          {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
        </Button>
      </aside>
    </div>
  );
}

export default CartPage;