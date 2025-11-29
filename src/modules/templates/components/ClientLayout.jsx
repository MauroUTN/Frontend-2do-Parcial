import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'; // Agregamos useLocation

import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Modal from '../../shared/components/Modal';
import ClientLoginForm from '../../home/components/ClientLoginForm';
import ClientRegisterForm from '../../home/components/ClientRegisterForm';

const ClientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber en qué página estás
  
  const [activeModal, setActiveModal] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, []);

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

  // Función auxiliar para estilo activo
  const getNavLinkClass = (path) => {
    // Si la ruta actual coincide con el path, devolvemos el estilo activo (fondo gris)
    const isActive = location.pathname === path;
    
    return isActive 
      ? "text-black cursor-pointer bg-gray-100 px-4 py-2 rounded-full font-semibold text-sm" // Activo
      : "cursor-pointer hover:text-black transition-colors px-4 py-2 font-semibold text-sm text-gray-500"; // Inactivo
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
            {/* Botón PRODUCTOS */}
            <span 
              className={getNavLinkClass('/')} 
              onClick={() => navigate('/')}
            >
              Productos
            </span>
            
            {/* Botón CARRITO */}
            <span 
              className={getNavLinkClass('/cart')} 
              onClick={() => navigate('/cart')}
            >
              Carrito de compras
            </span>
          </nav>
        </div>

        {/* CENTRO */}
        <div className="w-[500px] flex justify-center">
           <Input placeholder="Buscar productos..." className="bg-white border-gray-300" />
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