import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  // 1. CORRECCIÓN: Verificamos que el nombre coincida con tu hook (signout vs singout)
  const { signout } = useAuth();

  // 2. CORRECCIÓN: Función asíncrona para esperar a que termine el proceso
  const logout = async () => {
    try {
      if (signout) {
        await signout();
      }
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block pt-4 pb-4 rounded-4xl transition hover:bg-gray-100
      ${isActive
      ? 'bg-purple-200 hover:bg-purple-100 '
      : ''
    }
    `
  );

  const renderLogoutButton = (mobile = false) => (
    // Asegúrate de que tu componente Button tenga la prop onClick={onClick} dentro
    <Button 
      className={`${mobile ? 'block w-full sm:hidden' :  'hidden sm:block' }`} 
      onClick={logout}
    >
      Cerrar sesión
    </Button>
  );

  return (
    <div
      className="
        h-full
        grid
        grid-cols-1
        grid-rows-[auto_1fr]

        sm:gap-3
        sm:grid-cols-[256px_1fr]
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          p-4
          shadow
          rounded
          bg-white

          sm:col-span-2
        "
      >
        <span> 
          <div className="flex-1 flex items-center gap-8 h-full">
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
               {/* Nota: He mantenido tus estilos, asegura que el texto sea el deseado */}
               <div className="w-13 h-13 flex items-center justify-center bg-black rounded-full text-white font-bold text-xl pb-1">Ni</div>
               <span className="font-bold text-xl tracking-tight text-gray-900">Shop</span>
            </div>
          </div>
        </span>
        
        {renderLogoutButton()}
        
        <button
          className="
            bg-transparent
            border-none
            shadow-none

            sm:hidden
          "
          onClick={() => setOpenMenu(!openMenu)}
        >{ openMenu ? <span>&#215;</span> : <span>&#9776;</span>}</button>
      </header>

      <aside
        className={`
          absolute
          top-0
          bottom-0
          bg-white
          w-64
          p-6
          ${openMenu ? 'left-0' : 'left-[-256px]'}
          rounded
          shadow
          flex
          flex-col
          justify-between

          sm:relative
          sm:left-0
        `}
      >
        <nav>
          <ul className='flex flex-col'>
            <li>
              <NavLink
                to='/admin/home'
                className={getLinkStyles}
              >Principal</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/products'
                className={getLinkStyles}
              >Productos</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/orders'
                className={getLinkStyles}
              >Ordenes</NavLink>
            </li>
          </ul>
          <hr className='opacity-15 mt-4' />
        </nav>
        {renderLogoutButton(true)}
      </aside>

      <main
        className="
          p-5
          overflow-y-scroll
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;