import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hook/useCart';
import ProductCartClient from '../components/ProductCartClient';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import ClientLoginForm from '../../home/components/ClientLoginForm';
import ClientRegisterForm from '../../home/components/ClientRegisterForm';
import { createOrder } from '../../orders/services/orderService';
import { getUserIdFromToken } from '../../shared/helpers/jwtHelper';

function CartPage() {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  const [activeModal, setActiveModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  
  const [checkoutForm, setCheckoutForm] = useState({ shippingAddress: '', billingAddress: '', notes: '' });
  const hasItems = items.length > 0;

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
  };

  const submitOrder = async () => {
    if (!checkoutForm.shippingAddress.trim() || !checkoutForm.billingAddress.trim()) {
        alert("Por favor completa las direcciones.");
        return;
    }
    setIsProcessing(true);
    const customerId = getUserIdFromToken();
    
    try {
      const orderData = {
        OrderDate: new Date().toISOString(),
        ShippingAddress: checkoutForm.shippingAddress,
        BillingAddress: checkoutForm.billingAddress,
        Notes: checkoutForm.notes,
        CustomerId: customerId,
        Status: 1, 
        OrderItems: items.map(item => ({ ProductId: item.productId, Quantity: item.quantity }))
      };

      const { error } = await createOrder(orderData);
      if (error) alert(`Error: ${JSON.stringify(error)}`);
      else {
        clearCart();
        setShowCheckoutModal(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizePurchase = () => {
    if (localStorage.getItem('token')) setShowCheckoutModal(true);
    else setActiveModal('login'); 
  };

  // Estilos Inputs normales
  const labelStyle = "block text-gray-700 font-bold text-sm mb-1";
  const inputStyle = "w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200";

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-20 lg:pb-0">
      
      {/* --- MODALES --- */}
      <Modal isOpen={activeModal === 'login'} onClose={() => setActiveModal(null)} title="Inicia sesión">
        <ClientLoginForm onSuccess={() => { setActiveModal(null); setTimeout(() => setShowCheckoutModal(true), 500); }} onSwitchToRegister={() => setActiveModal('register')} />
      </Modal>
      <Modal isOpen={activeModal === 'register'} onClose={() => setActiveModal(null)} title="Crear cuenta">
        <ClientRegisterForm onSuccess={() => setActiveModal(null)} onSwitchToLogin={() => setActiveModal('login')} />
      </Modal>

      {/* Checkout Modal */}
      <Modal isOpen={showCheckoutModal} onClose={() => !isProcessing && setShowCheckoutModal(false)} title="Dirección de Envío">
        <div className="flex flex-col gap-4">
            <div>
                <label className={labelStyle}>Dirección de Envío</label>
                <input className={inputStyle} name="shippingAddress" placeholder="Ej: Av. Roca 123" value={checkoutForm.shippingAddress} onChange={handleCheckoutChange} />
            </div>
            <div>
                <label className={labelStyle}>Dirección de Facturación</label>
                <input className={inputStyle} name="billingAddress" placeholder="Ej: Misma que envío" value={checkoutForm.billingAddress} onChange={handleCheckoutChange} />
            </div>
            <div>
                <label className={labelStyle}>Notas (Opcional)</label>
                <input className={inputStyle} name="notes" placeholder="Ej: Dejar en portería" value={checkoutForm.notes} onChange={handleCheckoutChange} />
            </div>
            
            <div className="flex gap-3 mt-4">
                <Button 
                    variant="secondary" 
                    onClick={() => setShowCheckoutModal(false)} 
                    disabled={isProcessing} 
                    className="flex-1 py-2 text-base bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    Cancelar
                </Button>
                <Button 
                    variant="default" 
                    onClick={submitOrder} 
                    disabled={isProcessing} 
                    className="flex-1 py-2 text-base bg-purple-200 text-purple-800 hover:bg-purple-300 font-bold"
                >
                    {isProcessing ? '...' : 'Confirmar'}
                </Button>
            </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={() => { setShowSuccessModal(false); navigate('/'); }} title="¡Compra Exitosa!">
        <div className="flex flex-col items-center gap-6 py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl">✓</div>
            <p className="text-lg font-medium text-center text-gray-700">Tu orden ha sido registrada correctamente.</p>
            <Button variant="default" className="w-full py-2" onClick={() => { setShowSuccessModal(false); navigate('/'); }}>Volver a la tienda</Button>
        </div>
      </Modal>

      {/* Clear Cart Modal */}
      <Modal isOpen={showClearCartModal} onClose={() => setShowClearCartModal(false)} title="¿Vaciar carrito?">
         <div className="flex gap-3 justify-end mt-4">
            <Button variant="secondary" onClick={() => setShowClearCartModal(false)}>No</Button>
            <Button variant="default" onClick={() => { clearCart(); setShowClearCartModal(false); }} className="bg-red-100 text-red-700">Sí, vaciar</Button>
         </div>
      </Modal>

      {/* --- SECCIÓN PRINCIPAL (LISTA) --- */}
      <section className="flex-1 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        
        {/* Header Carrito (Sin botón volver) */}
        <div className="flex flex-row justify-between items-center mb-4 gap-2">
           <h1 className="text-xl font-bold text-gray-800">Carrito</h1>
           
           {hasItems && (
             <button 
                onClick={() => setShowClearCartModal(true)} 
                className="text-red-500 text-sm font-medium hover:underline"
             >
                Vaciar carrito
             </button>
           )}
        </div>

        {!hasItems ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="mb-4 text-lg">Tu carrito está vacío.</p>
            <Button 
                variant="secondary" 
                onClick={() => navigate('/')}
                className="w-auto px-8"
            >
                Ir al catálogo
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <ProductCartClient key={item.productId} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
            ))}
          </div>
        )}
      </section>

      {/* --- RESUMEN (SIDEBAR) --- */}
      <aside className="w-full lg:w-80 bg-white rounded-xl shadow-sm p-5 h-fit border border-gray-100 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen</h2>
        <div className="flex justify-between mb-2 text-gray-600 text-sm">
          <span>Productos ({items.reduce((a,b)=>a+b.quantity,0)})</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between items-center mb-6">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-purple-700">${total.toFixed(2)}</span>
        </div>
        <Button 
            className="w-full py-3 text-base font-bold shadow-md shadow-purple-100" 
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