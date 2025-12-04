import { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import useProducts from '../hook/useProducts';
import SearchBar from '../../shared/components/SearchBar';

function ListProductsPage() {
  const navigate = useNavigate();
  const {
    products, loading, totalPages,
    searchTerm, setSearchTerm,
    status, setStatus,
    pageNumber, pageSize, setPageSize,
    handleSearch, handlePageChange,
    productStatus,
    setSearchSku // <--- 1. Importamos la función para controlar el modo de búsqueda
  } = useProducts();

  // 2. EFECTO: Al montar esta página (Admin), activamos la búsqueda por SKU.
  // Al desmontarla (return), la desactivamos para volver al modo normal (Cliente).
  useEffect(() => {
    setSearchSku(true);
    return () => setSearchSku(false);
  }, []);

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Productos</h1>
          <Button onClick={() => navigate('/admin/products/create')}>
            Crear Producto
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          {/* BUSCADOR */}
          <div className='flex-1'>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              placeholder='Buscar por nombre o SKU...' // Placeholder actualizado
              className='w-full'
            />
          </div>

          {/* FILTRO DE ESTADO */}
          <select
            value={status}
            onChange={(e) => {
                setStatus(e.target.value);
                handlePageChange(1);
            }}
            className='text-[1.3rem] border border-gray-300 p-2 rounded-lg h-full bg-white outline-none focus:ring-2 focus:ring-purple-200'
          >
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>
      </Card>

      {/* LISTADO DE PRODUCTOS */}
      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
          <p className="text-center text-gray-500 py-10">Cargando...</p>
        ) : (
          (products || []).map((product) => (
            <Card key={product.id || product.sku}>
              <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-bold text-lg">{product.name}</h2>
                    <p className="text-sm text-gray-500 font-mono">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${product.currentUnitPrice}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Habilitado' : 'Inhabilitado'}
                    </span>
                  </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* PAGINACIÓN */}
      <div className='flex justify-center items-center mt-6 gap-4'>
        <button
          disabled={pageNumber === 1}
          onClick={() => handlePageChange(pageNumber - 1)}
          className='bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition'
        >
          Anterior
        </button>
        
        <span className="font-medium text-gray-700">Página {pageNumber} de {totalPages || 1}</span>
        
        <button
          disabled={pageNumber >= totalPages}
          onClick={() => handlePageChange(pageNumber + 1)}
          className='bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            handlePageChange(1);
          }}
          className='border border-gray-300 p-2 rounded-lg bg-white'
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default ListProductsPage;