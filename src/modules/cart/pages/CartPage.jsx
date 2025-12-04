import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hook/useCart';
import ProductCartClient from '../components/ProductCartClient';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import ClientLoginForm from '../../home/components/ClientLoginForm';
import ClientRegisterForm from '../../home/components/ClientRegisterForm';

import { createOrder } from '../../orders/services/orderService';
import { getUserIdFromToken } from '../../shared/helpers/jwtHelper';

function CartPage() {
  const navigate = useNavigate();
  
  const {
    items,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [activeModal, setActiveModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  
  const [checkoutForm, setCheckoutForm] = useState({
    shippingAddress: '',
    billingAddress: '',
    notes: ''
  });

  const hasItems = items.length > 0;

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
  };

  const submitOrder = async () => {
    if (!checkoutForm.shippingAddress.trim() || !checkoutForm.billingAddress.trim()) {
        alert("Por favor completa las direcciones de envío y facturación.");
        return;
    }

    setIsProcessing(true);
    
    const customerId = getUserIdFromToken();
    if (!customerId) {
        alert("Sesión inválida. Por favor inicia sesión nuevamente.");
        setIsProcessing(false);
        setActiveModal('login');
        return;
    }

    try {
      const orderData = {
        OrderDate: new Date().toISOString(),
        ShippingAddress: checkoutForm.shippingAddress,
        BillingAddress: checkoutForm.billingAddress,
        Notes: checkoutForm.notes,
        CustomerId: customerId,
        Status: 1, 
        OrderItems: items.map(item => ({
          ProductId: item.productId || item.id, 
          Quantity: item.quantity
        }))
      };

      const { error } = await createOrder(orderData);

      if (error) {
        const errorMessage = typeof error === 'object' ? JSON.stringify(error) : error;
        alert(`No se pudo crear la orden: ${errorMessage}`);
      } else {
        clearCart();
        setShowCheckoutModal(false);
        setShowSuccessModal(true);
      }

    } catch (err) {
      console.error("Error crítico:", err);
      alert("Ocurrió un error inesperado al procesar la compra.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizePurchase = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setShowCheckoutModal(true); 
    } else {
      setActiveModal('login'); 
    }
  };

  const handleLoginSuccess = () => {
    setActiveModal(null);
    setTimeout(() => setShowCheckoutModal(true), 500);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate('/'); 
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* MODALES LOGIN/REGISTRO */}
      <Modal isOpen={activeModal === 'login'} onClose={() => setActiveModal(null)} title="Inicia sesión">
        <ClientLoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setActiveModal('register')} />
      </Modal>
      <Modal isOpen={activeModal === 'register'} onClose={() => setActiveModal(null)} title="Crear cuenta">
        <ClientRegisterForm onSuccess={() => setActiveModal(null)} onSwitchToLogin={() => setActiveModal('login')} />
      </Modal>

      {/* MODAL VACIAR CARRITO */}
      <Modal isOpen={showClearCartModal} onClose={() => setShowClearCartModal(false)} title="¿Vaciar carrito?">
        <div className="flex flex-col gap-4">
          <p className="text-gray-600">¿Estás seguro de vaciar el carrito?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowClearCartModal(false)}>Cancelar</Button>
            <Button variant="default" onClick={() => { clearCart(); setShowClearCartModal(false); }} className="bg-red-100 text-red-700 hover:bg-red-200">Sí, vaciar</Button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE ÉXITO */}
      <Modal isOpen={showSuccessModal} onClose={handleCloseSuccess} title="¡Compra Exitosa!">
        <div className="flex flex-col items-center gap-6 text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl">✓</div>
            <div>
              <p className="text-lg font-bold text-gray-800">Tu orden ha sido registrada.</p>
              <p className="text-sm text-gray-500">Ya estamos preparando tu pedido.</p>
            </div>
            {/* Botón estandarizado */}
            <Button 
                variant="default" 
                className="w-full"
                onClick={handleCloseSuccess}
            >
                Volver a la tienda
            </Button>
        </div>
      </Modal>

      {/* MODAL CHECKOUT */}
      <Modal 
        isOpen={showCheckoutModal} 
        onClose={() => !isProcessing && setShowCheckoutModal(false)} 
        title="Datos de Envío"
      >
        <div className="flex flex-col gap-4 min-w-[300px]">
            <Input 
                label="Dirección de Envío"
                name="shippingAddress"
                placeholder="Ej: Av. Roca 123"
                value={checkoutForm.shippingAddress}
                onChange={handleCheckoutChange}
            />
            <Input 
                label="Dirección de Facturación"
                name="billingAddress"
                placeholder="Ej: Misma que envío"
                value={checkoutForm.billingAddress}
                onChange={handleCheckoutChange}
            />
            <Input 
                label="Notas (Opcional)"
                name="notes"
                placeholder="Ej: Dejar en portería"
                value={checkoutForm.notes}
                onChange={handleCheckoutChange}
            />
            
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <Button variant="secondary" onClick={() => setShowCheckoutModal(false)} disabled={isProcessing} className="w-full justify-center">
                    Cancelar
                </Button>
                {/* Botón estandarizado */}
                <Button 
                    variant="default" 
                    onClick={submitOrder} 
                    disabled={isProcessing} 
                    className="w-full justify-center"
                >
                    {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
                </Button>
            </div>
        </div>
      </Modal>

      {/* LISTA DE PRODUCTOS */}
      <section className="flex-1 bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-xl font-bold text-gray-800">Carrito de compras</h1>
           {hasItems && (
             <button onClick={() => setShowClearCartModal(true)} className="text-sm text-red-500 hover:underline cursor-pointer">
               Vaciar carrito
             </button>
           )}
        </div>

        {!hasItems && (
          // --- CENTRADO PERFECTO ---
          <div className="text-gray-400 py-20 flex flex-col items-center justify-center gap-6">
            <p className="text-lg">Tu carrito está vacío.</p>
            <Button 
                variant="secondary" 
                onClick={() => navigate('/')}
                className="w-auto px-8"
            >
                Volver al catálogo
            </Button>
          </div>
        )}

        {items.map((item) => (
          <ProductCartClient 
            key={item.productId} 
            item={item} 
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </section>

      {/* RESUMEN */}
      <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-sm p-6 h-fit border border-gray-100 sticky top-24">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen</h2>
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Productos</span>
          <span className="font-medium">{items.reduce((acc, x) => acc + x.quantity, 0)}</span>
        </div>
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
          <span className="text-base font-bold text-gray-800">Total</span>
          <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <Button
          className="w-full"
          variant="default"
          disabled={!hasItems || isProcessing}
          onClick={handleFinalizePurchase}
        >
          Finalizar Compra
        </Button>
      </aside>
    </div>
  );
}

export default CartPage;