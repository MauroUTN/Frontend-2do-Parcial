import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// Componentes UI
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Modal from '../../shared/components/Modal';

// Formularios de Cliente
import ClientLoginForm from '../../home/components/ClientLoginForm';
import ClientRegisterForm from '../../home/components/ClientRegisterForm';

const ClientLayout = () => {
  const navigate = useNavigate();
  
  // Estado para controlar qué modal se muestra ('login', 'register' o null)
  const [activeModal, setActiveModal] = useState(null);
  
  // Estado para saber si el usuario ya inició sesión (cambia la UI del header)
  const [isLogged, setIsLogged] = useState(false);

  // Al cargar, verificamos si existe el token
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, []);

  const closeModal = () => setActiveModal(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Si guardabas el rol
    setIsLogged(false);
    window.location.reload(); // Recargamos para limpiar estados
  };

  const handleLoginSuccess = () => {
    closeModal();
    setIsLogged(true);
    // Opcional: window.location.reload() si necesitas refrescar datos
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* --- ZONA DE MODALES --- */}
      {/* Modal de Login */}
      <Modal 
        isOpen={activeModal === 'login'} 
        onClose={closeModal}
        title="Bienvenido de nuevo"
      >
        <ClientLoginForm 
          onSuccess={handleLoginSuccess} 
          onSwitchToRegister={() => setActiveModal('register')} 
        />
      </Modal>

      {/* Modal de Registro */}
      <Modal 
        isOpen={activeModal === 'register'} 
        onClose={closeModal}
        title="Crear una cuenta"
      >
        <ClientRegisterForm 
          onSuccess={closeModal} 
          onSwitchToLogin={() => setActiveModal('login')}
        />
      </Modal>


      {/* --- NAVBAR --- */}
      <header className="sticky top-0 bg-white z-20 shadow-sm border-b border-gray-200 h-20 px-6 flex items-center justify-between">
        
        {/* IZQUIERDA */}
        <div className="flex-1 flex items-center gap-8 h-full">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-13 h-13 flex items-center justify-center bg-black rounded-full text-white font-bold text-xl pb-1">Nigga</div>
             <span className="font-bold text-xl tracking-tight text-gray-900">Shop</span>
          </div>
          <nav className="hidden lg:flex gap-4 items-center">
            <span className="text-black cursor-pointer bg-gray-100 px-4 py-2 rounded-full font-semibold text-sm" onClick={() => navigate('/')}>
              Productos
            </span>
            <span className="cursor-pointer hover:text-black transition-colors px-4 py-2 font-semibold text-sm text-gray-500" onClick={() => navigate('/cart')}>
              Carrito de compras
            </span>
          </nav>
        </div>

        {/* CENTRO */}
        <div className="w-[500px] flex justify-center">
           <Input 
             placeholder="Buscar productos..." 
             className="bg-white border-gray-300"
             // Nota: La lógica de búsqueda (onChange) idealmente va en un contexto
             // para que funcione aquí, pero por ahora es visual.
           />
        </div>

        {/* DERECHA (Lógica Condicional) */}
        <div className="flex-1 flex items-center justify-end gap-3 h-full">
          
          {isLogged ? (
            // Si está logueado, mostramos Salir
            <div className="flex items-center gap-4">
               <span className="text-sm font-semibold text-gray-600 hidden sm:block">¡Hola!</span>
               <Button 
                 onClick={handleLogout} 
                 variant="secondary" 
                 className="w-auto px-6 whitespace-nowrap"
               >
                 Cerrar Sesión
               </Button>
            </div>
          ) : (
            // Si NO está logueado, mostramos los botones que abren Modales
            <>
              <Button 
                onClick={() => setActiveModal('login')} // <--- Abre Modal Login
                variant="default" 
                className="w-auto px-6 whitespace-nowrap"
              >
                Iniciar Sesión
              </Button>
              
              <Button 
                onClick={() => setActiveModal('register')} // <--- Abre Modal Registro
                variant="secondary" 
                className="w-auto px-6 whitespace-nowrap"
              >
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