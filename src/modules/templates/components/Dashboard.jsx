import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { signout } = useAuth();

  const logout = async () => {
    try {
      if (signout) await signout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getLinkStyles = ({ isActive }) => (
    `pl-4 w-full block py-3 rounded-lg transition duration-200 text-sm font-medium mb-1
    ${isActive ? 'bg-purple-100 text-purple-400' : 'text-gray-600 hover:bg-gray-50'}`
  );

  return (
    <div className="h-screen flex flex-col sm:grid sm:grid-cols-[260px_1fr] bg-gray-50">
      
      {/* --- HEADER MÓVIL --- */}
      <header className="sm:hidden flex items-center justify-between p-4 bg-white shadow-sm z-20 relative h-16">
        <div className="flex items-center gap-1">
           <div className="font-bold text-xl text-white leading-none" style={{ WebkitTextStroke: '1.5px gray' }}>JIM's</div>
           <span className="font-bold text-xl tracking-tight text-gray-900">Store</span>
        </div>
        <button onClick={() => setOpenMenu(!openMenu)} className="text-gray-600 focus:outline-none p-2 rounded-md hover:bg-gray-100">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </header>

      {/* --- SIDEBAR --- */}
      <aside className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
          sm:translate-x-0 sm:static sm:shadow-none sm:border-r sm:border-gray-200
          ${openMenu ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo Desktop */}
          <div className="hidden sm:flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate('/')}>
               <div className="font-bold text-2xl text-white leading-none" style={{ WebkitTextStroke: '1.5px gray' }}>JIM's</div>
               <span className="font-bold text-2xl tracking-tight text-gray-900">Store</span>
          </div>

          {/* Menú - Botón Cerrar en móvil */}
          <div className="flex justify-between items-center sm:hidden mb-6">
             <h2 className="text-xl font-bold text-gray-800">Menú</h2>
             <button onClick={() => setOpenMenu(false)} className="text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          <nav className="flex-1">
            <NavLink to='/admin/home' className={getLinkStyles} onClick={() => setOpenMenu(false)}>Principal</NavLink>
            <NavLink to='/admin/products' className={getLinkStyles} onClick={() => setOpenMenu(false)}>Productos</NavLink>
            <NavLink to='/admin/orders' className={getLinkStyles} onClick={() => setOpenMenu(false)}>Órdenes</NavLink>
          </nav>

          <div className="border-t pt-6 mt-4">
             <Button className="w-full justify-center" onClick={logout} variant="secondary">
                Cerrar Sesión
             </Button>
          </div>
        </div>
      </aside>

      {/* Overlay Móvil */}
      {openMenu && (
        <div className="fixed inset-0 bg-black/50 z-20 sm:hidden backdrop-blur-sm" onClick={() => setOpenMenu(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;