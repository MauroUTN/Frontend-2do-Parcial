import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import useProducts from '../hook/useProducts';

function ListProductsPage() {
  const navigate = useNavigate();
  const {
    products, loading, totalPages,
    searchTerm, setSearchTerm,
    status, setStatus,
    pageNumber, pageSize, setPageSize,
    handleSearch, handlePageChange, // Importamos las funciones nuevas
    productStatus 
  } = useProducts();

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
          <div className='flex items-center gap-3 w-full'>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Opcional: buscar al presionar Enter
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              type="text"
              placeholder='Buscar por nombre...'
              className='text-[1.3rem] w-full border p-2 rounded'
            />
            <Button className='h-11 w-11' onClick={handleSearch}>
               🔍
            </Button>
          </div>

          {/* FILTRO DE ESTADO */}
          {/* Al cambiar esto, el useEffect del hook dispara la búsqueda solo */}
          <select
            value={status}
            onChange={(e) => {
                setStatus(e.target.value);
                handlePageChange(1); // Volver a pag 1 al filtrar
            }}
            className='text-[1.3rem] border p-2 rounded'
          >
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>
      </Card>

      {/* LISTADO */}
      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          (products || []).map((product) => (
            <Card key={product.id || product.sku}>
              <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold">{product.name}</h2>
                    <p className="text-sm text-gray-600">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${product.currentUnitPrice}</p>
                    <span className={`text-xs px-2 py-1 rounded ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* PAGINACIÓN */}
      <div className='flex justify-center items-center mt-4 gap-4'>
        <button
          disabled={pageNumber === 1}
          onClick={() => handlePageChange(pageNumber - 1)}
          className='bg-gray-200 px-3 py-1 rounded disabled:opacity-50'
        >
          Anterior
        </button>
        
        <span>Página {pageNumber} de {totalPages || 1}</span>
        
        <button
          disabled={pageNumber >= totalPages}
          onClick={() => handlePageChange(pageNumber + 1)}
          className='bg-gray-200 px-3 py-1 rounded disabled:opacity-50'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            handlePageChange(1);
          }}
          className='border p-1 rounded'
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