import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'; 
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Modal from '../../shared/components/Modal';
import ClientLoginForm from '../../home/components/ClientLoginForm';
import ClientRegisterForm from '../../home/components/ClientRegisterForm';
import useCard from '../../shared/hook/useCard'; // <--- 1. IMPORTAMOS EL HOOK DEL CARRITO

const ClientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { items } = useCard(); // <--- 2. EXTRAEMOS LOS ÍTEMS DEL CARRITO

  const [activeModal, setActiveModal] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  
  // Estado para controlar la animación
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, []);

  // 3. EFECTO DE ANIMACIÓN: Se dispara cada vez que 'items' cambia
  useEffect(() => {
    if (items.length === 0) return;

    setIsAnimating(true);
    
    // Quitamos la animación después de 300ms
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [items]); // Escucha cambios en el carrito

  // Calcular cantidad total de productos para el badge
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const closeModal = () => setActiveModal(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLogged(false);
    window.location.reload();
  };

  const handleLoginSuccess = () => {
    closeModal();
    setIsLogged(true);
  };

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    // Base de clases
    let classes = "cursor-pointer px-4 py-2 font-semibold text-sm transition-all duration-300 flex items-center gap-2 ";
    
    if (isActive) {
        classes += "text-black bg-gray-100 rounded-full ";
    } else {
        classes += "text-gray-500 hover:text-black ";
    }

    // 4. SI ES EL CARRITO Y ESTÁ ANIMANDO, AGREGAMOS EFECTO
    if (path === '/cart' && isAnimating) {
        classes += " scale-110 text-purple-600 font-bold"; // Efecto de "Zoom" y cambio de color
    }

    return classes;
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* MODALES */}
      <Modal isOpen={activeModal === 'login'} onClose={closeModal} title="Inicia sesión">
        <ClientLoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setActiveModal('register')} />
      </Modal>

      <Modal isOpen={activeModal === 'register'} onClose={closeModal} title="Crear cuenta">
        <ClientRegisterForm onSuccess={closeModal} onSwitchToLogin={() => setActiveModal('login')} />
      </Modal>

      {/* NAVBAR */}
      <header className="sticky top-0 bg-white z-20 shadow-sm border-b border-gray-200 h-20 px-6 flex items-center justify-between">
        
        {/* IZQUIERDA */}
        <div className="flex-1 flex items-center gap-8 h-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white font-bold text-xl pb-1">J</div>
             <span className="font-bold text-xl tracking-tight text-gray-900">Store</span>
          </div>
          
          <nav className="hidden lg:flex gap-4 items-center">
            <span 
              className={getNavLinkClass('/')} 
              onClick={() => navigate('/')}
            >
              Productos
            </span>
            
            {/* BOTÓN CARRITO CON BADGE */}
            <span 
              className={getNavLinkClass('/cart')} 
              onClick={() => navigate('/cart')}
            >
              Carrito
              {/* Badge contador */}
              {totalItems > 0 && (
                  <span className={`
                    ml-1 px-2 py-0.5 text-xs rounded-full 
                    ${isAnimating ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}
                    transition-colors duration-300
                  `}>
                    {totalItems}
                  </span>
              )}
            </span>
          </nav>
        </div>

        {/* DERECHA */}
        <div className="flex-1 flex items-center justify-end gap-3 h-full">
          {isLogged ? (
            <div className="flex items-center gap-4">
               <span className="text-sm font-semibold text-purple-400 hidden sm:block">¡Hola!</span>
               <Button onClick={handleLogout} variant="secondary" className="w-auto px-6 whitespace-nowrap">
                 Cerrar Sesión
               </Button>
            </div>
          ) : (
            <>
              <Button onClick={() => setActiveModal('login')} variant="default" className="w-auto px-6 whitespace-nowrap">
                Iniciar Sesión
              </Button>
              <Button onClick={() => setActiveModal('register')} variant="secondary" className="w-auto px-6 whitespace-nowrap">
                Registrar Usuario
              </Button>
            </>
          )}
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6">
        <Outlet /> 
      </main>

    </div>
  );
};

export default ClientLayout;