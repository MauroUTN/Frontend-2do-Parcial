import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hook/useCart';
import ProductCartClient from '../components/ProductCartClient';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import ClientLoginForm from '../../home/components/ClientLoginForm';
import ClientRegisterForm from '../../home/components/ClientRegisterForm';

// --- NUEVAS IMPORTACIONES ---
import { createOrder } from '../../orders/services/orderService';
import { getUserIdFromToken } from '../../shared/helpers/jwtHelper'; // Asegúrate de haber creado este archivo

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
  const [showClearCartModal, setShowClearCartModal] = useState(false); // Modal vaciar carrito

  const hasItems = items.length > 0;

  // --- LÓGICA PRINCIPAL DE CREACIÓN DE ORDEN ---
  const submitOrder = async () => {
    setIsProcessing(true);
    
    // 1. Validar que tengamos usuario (extraer ID del token)
    const customerId = getUserIdFromToken();
    
    if (!customerId) {
        alert("Sesión expirada o inválida. Por favor, inicie sesión nuevamente.");
        setIsProcessing(false);
        setActiveModal('login');
        return;
    }

    try {
      // 2. Armar el objeto tal cual lo pide tu Backend (.NET RequestOrderModel)
      const orderData = {
        OrderDate: new Date().toISOString(),
        ShippingAddress: "Calle Falsa 123, Tucumán", // Aquí podrías poner un input real
        BillingAddress: "Calle Falsa 123, Tucumán",
        Notes: "Compra realizada desde la web",
        CustomerId: customerId, // El GUID del usuario extraído del token
        Status: 1, // 1 = PENDING (según tu Enum OrderStatus)
        OrderItems: items.map(item => ({
          ProductId: item.productId || item.id, // Aseguramos enviar el GUID del producto
          Quantity: item.quantity
        }))
      };

      console.log("Enviando orden al backend:", orderData);

      // 3. Llamar al servicio
      const { error } = await createOrder(orderData);

      if (error) {
        // Si hay error (ej: Stock insuficiente), lo mostramos
        const errorMessage = typeof error === 'object' ? JSON.stringify(error) : error;
        alert(`No se pudo procesar la orden: ${errorMessage}`);
      } else {
        // Éxito
        alert("¡Compra realizada con éxito! Gracias por tu pedido.");
        clearCart();
        navigate('/admin/orders'); // Redirigimos a mis órdenes (o al home)
      }

    } catch (err) {
      console.error("Error inesperado en submitOrder:", err);
      alert("Ocurrió un error inesperado al procesar la compra.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Botón "Finalizar Compra"
  const handleFinalizePurchase = () => {
    const token = localStorage.getItem('token');
    if (token) {
      submitOrder(); // Si ya tiene token, intenta crear la orden
    } else {
      setActiveModal('login'); // Si no, pide login
    }
  };

  // Callback cuando el login es exitoso
  const handleLoginSuccess = () => {
    setActiveModal(null);
    // Esperamos un poco para asegurar que el token se guardó en localStorage
    setTimeout(() => {
        submitOrder();
    }, 500);
  };

  // Confirmación de vaciar carrito
  const handleConfirmClear = () => {
    clearCart();
    setShowClearCartModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* --- MODALES --- */}
      <Modal isOpen={activeModal === 'login'} onClose={() => setActiveModal(null)} title="Inicia sesión">
        <ClientLoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setActiveModal('register')} />
      </Modal>

      <Modal isOpen={activeModal === 'register'} onClose={() => setActiveModal(null)} title="Crear cuenta">
        <ClientRegisterForm onSuccess={() => setActiveModal(null)} onSwitchToLogin={() => setActiveModal('login')} />
      </Modal>

      <Modal isOpen={showClearCartModal} onClose={() => setShowClearCartModal(false)} title="¿Vaciar carrito?">
        <div className="flex flex-col gap-4">
          <p className="text-gray-600">¿Estás seguro de eliminar todos los productos?</p>
          <div className="flex gap-3 mt-2 justify-end">
            <Button variant="secondary" onClick={() => setShowClearCartModal(false)}>Cancelar</Button>
            <Button variant="default" onClick={handleConfirmClear} className="bg-red-100 text-red-700 hover:bg-red-200">Sí, vaciar</Button>
          </div>
        </div>
      </Modal>

      {/* --- LISTA DE PRODUCTOS (IZQUIERDA) --- */}
      <section className="flex-1 bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-xl font-bold text-gray-800">Carrito de compras</h1>
           {hasItems && (
             <button 
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

      {/* --- RESUMEN DE PEDIDO (DERECHA) --- */}
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

        {/* BOTÓN FINALIZAR COMPRA */}
        <Button
          className="w-full rounded-lg py-3 font-bold bg-purple-200 text-purple-900 hover:bg-purple-300"
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