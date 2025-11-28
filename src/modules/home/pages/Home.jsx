import useDashboardStats from '../hook/useDashboardStats'; 

const Home = () => {
  const { stats, loading } = useDashboardStats();

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* --- TARJETA DE PRODUCTOS --- */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos</h2>
        
        <div className="text-gray-500 text-lg font-medium">
          Cantidad de <br />
          Productos: <span className="font-bold text-gray-900 ml-1">
            {loading ? '...' : stats.productCount}
          </span>
        </div>
      </div>

      {/* --- TARJETA DE ÓRDENES --- */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ordenes</h2>
        
        <div className="text-gray-500 text-lg font-medium">
          Cantidad de <br />
          Ordenes: <span className="font-bold text-gray-900 ml-1">
            {loading ? '...' : stats.orderCount}
          </span>
        </div>
      </div>

    </div>
  );
};

export default Home;