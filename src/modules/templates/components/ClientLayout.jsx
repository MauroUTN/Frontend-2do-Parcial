import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'; 
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import ClientLoginForm from '../../home/components/ClientLoginForm';
import ClientRegisterForm from '../../home/components/ClientRegisterForm';
import useCard from '../../shared/hook/useCard';
import useProducts from '../../products/hook/useProducts'; 
import SearchBar from '../../shared/components/SearchBar'; 

const ClientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { items } = useCard();
  
  const { searchTerm, setSearchTerm, handleSearch } = useProducts();

  const [activeModal, setActiveModal] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [items]);

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

  const onGlobalSearch = () => {
    handleSearch(); 
    if (location.pathname !== '/') {
        navigate('/'); 
    }
  };

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    // Estilos base limpios
    let classes = "cursor-pointer px-4 py-2 font-medium text-sm transition-all duration-300 flex items-center gap-2 rounded-lg ";
    
    if (isActive) {
        classes += "text-gray-900 bg-gray-100 ";
    } else {
        classes += "text-gray-500 hover:text-gray-900 hover:bg-gray-50 ";
    }

    if (path === '/cart' && isAnimating) {
        classes += " scale-110 text-purple-600 font-bold"; 
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
      <header className="sticky top-0 bg-white z-20 shadow-sm border-b border-gray-200 h-20 px-6 flex items-center justify-between gap-4">
        
        {/* --- IZQUIERDA: LOGO + NAVEGACIÓN --- */}
        <div className="flex items-center gap-8 flex-shrink-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="font-bold text-xl text-white leading-none"
                style={{ WebkitTextStroke: '1.5px gray' }}>JIM's</div>
                <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">Store</span>
            </div>

            <nav className="hidden lg:flex gap-2 items-center">
                <span className={getNavLinkClass('/')} onClick={() => navigate('/')}>
                    Productos
                </span>
                <span className={getNavLinkClass('/cart')} onClick={() => navigate('/cart')}>
                    Carrito
                    {totalItems > 0 && (
                        <span className={`
                            ml-2 px-2 py-0.5 text-xs rounded-full font-bold
                            ${isAnimating ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}
                            transition-colors duration-300
                        `}>
                            {totalItems}
                        </span>
                    )}
                </span>
            </nav>
        </div>

        {/* --- CENTRO: SEARCHBAR --- */}
        <div className="flex-1 max-w-2xl mx-4">
            <SearchBar 
                value={searchTerm}
                onChange={(val) => setSearchTerm(val)} 
                onSearch={onGlobalSearch}
                placeholder="Buscar productos..."
                className="w-full shadow-none bg-gray-50 border-gray-200 focus-within:ring-2 focus-within:ring-purple-200 focus-within:border-purple-300"
            />
        </div>

        {/* --- DERECHA: AUTH (Botones estandarizados) --- */}
        <div className="flex items-center justify-end gap-3 flex-shrink-0">
            {isLogged ? (
                <div className="flex items-center gap-4">
                   <span className="text-sm font-semibold text-gray-500 hidden xl:block">¡Hola!</span>
                   <Button onClick={handleLogout} variant="secondary" className="w-auto px-4 whitespace-nowrap text-sm">
                     Cerrar Sesión
                   </Button>
                </div>
            ) : (
                <>
                  {/* Usamos el variant="default" (tu violeta standard) */}
                  <Button onClick={() => setActiveModal('login')} variant="default" className="w-auto px-4 whitespace-nowrap text-sm">
                    Ingresar
                  </Button>
                  <Button onClick={() => setActiveModal('register')} variant="secondary" className="w-auto px-4 whitespace-nowrap text-sm">
                    Registrarse
                  </Button>
                </>
            )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6">
        <Outlet /> 
      </main>

    </div>
  );
};

export default ClientLayout;