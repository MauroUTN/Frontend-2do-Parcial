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
  const [openMenu, setOpenMenu] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, []);

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
    setOpenMenu(false); 
    if (location.pathname !== '/') navigate('/'); 
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpenMenu(false);
  };

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `cursor-pointer px-4 py-2 font-medium transition-all duration-200 rounded-lg flex items-center gap-2
      ${isActive ? 'bg-purple-100 text-purple-400' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      <Modal isOpen={activeModal === 'login'} onClose={closeModal} title="Inicia sesión">
        <ClientLoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setActiveModal('register')} />
      </Modal>
      <Modal isOpen={activeModal === 'register'} onClose={closeModal} title="Crear cuenta">
        <ClientRegisterForm onSuccess={closeModal} onSwitchToLogin={() => setActiveModal('login')} />
      </Modal>

      {/* --- NAVBAR FIXED --- */}
      <header className="sticky top-0 bg-white z-30 shadow-sm border-b border-gray-200 h-20">
        <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center justify-between">
            
            {/* IZQUIERDA: Logo */}
            <div className="flex items-center gap-2 cursor-pointer z-40 mr-8" onClick={() => handleNavigation('/')}>
                <div className="font-bold text-2xl text-white leading-none" style={{ WebkitTextStroke: '1.5px gray' }}>JIM's</div>
                <span className="font-bold text-2xl tracking-tight text-gray-900">Store</span>
            </div>

            {/* CENTRO (Desktop): Nav Links (Izquierda) + SearchBar (Derecha) */}
            <div className="hidden lg:flex flex-1 items-center justify-start gap-6">
                 {/* 1. Navegación a la izquierda */}
                 <nav className="flex gap-2 flex-shrink-0">
                    <span className={getNavLinkClass('/')} onClick={() => handleNavigation('/')}>
                        Productos
                    </span>
                    <span className={getNavLinkClass('/cart')} onClick={() => handleNavigation('/cart')}>
                        Carrito
                        {totalItems > 0 && (
                            <span className="bg-purple-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </span>
                 </nav>

                 {/* 2. Barra de búsqueda */}
                 <div className="w-full max-w-md">
                    <SearchBar 
                        value={searchTerm}
                        onChange={(val) => setSearchTerm(val)} 
                        onSearch={onGlobalSearch}
                        placeholder="Buscar productos..."
                        className="w-full bg-gray-50 focus-within:ring-2 focus-within:ring-purple-200"
                    />
                 </div>
            </div>

            {/* DERECHA (Desktop): Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3 ml-4">
                 {isLogged ? (
                    <Button onClick={handleLogout} variant="secondary" className="text-sm">Cerrar Sesión</Button>
                ) : (
                    <>
                        <Button onClick={() => setActiveModal('login')} variant="default" className="text-sm font-bold">Ingresar</Button>
                        <Button onClick={() => setActiveModal('register')} variant="secondary" className="text-sm font-bold">Registrarse</Button>
                    </>
                )}
            </div>

            {/* DERECHA (Móvil): Botón Hamburguesa */}
            <button 
                className="lg:hidden p-2 text-gray-600 z-40 focus:outline-none"
                onClick={() => setOpenMenu(!openMenu)}
            >
                {openMenu ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <div className="relative">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </div>
                )}
            </button>
        </div>
      </header>

      {/* --- MENÚ LATERAL MÓVIL --- */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${openMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpenMenu(false)}
      />

      <aside className={`
          fixed inset-y-0 right-0 z-30 w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col
          ${openMenu ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full gap-6 pt-24">
            <div>
                <label className="text-sm font-bold text-gray-500 mb-2 block uppercase">Buscar</label>
                <SearchBar 
                    value={searchTerm}
                    onChange={(val) => setSearchTerm(val)} 
                    onSearch={onGlobalSearch}
                    placeholder="Buscar..."
                    className="w-full bg-gray-50 border-gray-200 h-12"
                />
            </div>

            <nav className="flex flex-col gap-2">
                <span 
                    className={`text-lg font-medium p-3 rounded-xl flex justify-between items-center ${location.pathname === '/' ? 'bg-purple-50 text-purple-400' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleNavigation('/')}
                >
                    Productos
                    <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
                <span 
                    className={`text-lg font-medium p-3 rounded-xl flex justify-between items-center ${location.pathname === '/cart' ? 'bg-purple-50 text-purple-400' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleNavigation('/cart')}
                >
                    <span className="flex items-center gap-2">
                        Carrito de compras
                        {totalItems > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{totalItems}</span>}
                    </span>
                    <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
            </nav>

            <div className="mt-auto flex flex-col gap-3">
                {isLogged ? (
                    <Button onClick={handleLogout} variant="secondary" className="w-full py-3 justify-center text-lg">
                        Cerrar Sesión
                    </Button>
                ) : (
                    <>
                        <Button onClick={() => { setOpenMenu(false); setActiveModal('login'); }} variant="default" className="w-full py-3 justify-center text-lg">
                            Iniciar Sesión
                        </Button>
                        <Button onClick={() => { setOpenMenu(false); setActiveModal('register'); }} variant="secondary" className="w-full py-3 justify-center text-lg">
                            Registrarse
                        </Button>
                    </>
                )}
            </div>
        </div>
      </aside>

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet /> 
      </main>

    </div>
  );
};

export default ClientLayout;