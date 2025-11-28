import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import useProducts from '../hook/useProducts'; // Importamos el Hook

function ListProductsPage() {
  const navigate = useNavigate();

  // Extraemos todo del Hook
  const {
    products,
    loading,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    totalPages,
    handleSearch,
    productStatus 
  } = useProducts();

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Productos</h1>
          {/* Botón Mobile */}
          <Button className='h-11 w-11 rounded-2xl sm:hidden'>
             <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path> <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path></svg>
          </Button>

          {/* Botón Desktop */}
          <Button
            className='hidden sm:block'
            onClick={() => navigate('/admin/products/create')}
          >
            Crear Producto
          </Button>
        </div>

        {/* Filtros */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex items-center gap-3'>
            <input
              value={searchTerm}
              onChange={(evt) => setSearchTerm(evt.target.value)}
              type="text"
              placeholder='Buscar'
              className='text-[1.3rem] w-full'
            />
            <Button className='h-11 w-11' onClick={handleSearch}>
               <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </Button>
          </div>
          <select
            value={status}
            onChange={(evt) => setStatus(evt.target.value)}
            className='text-[1.3rem]'
          >
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>
      </Card>

      {/* --- AQUÍ ESTÁ LA PROTECCIÓN Y DEPURACIÓN --- */}
      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
          <p className="text-center p-4">Buscando datos...</p>
        ) : (
          // SI ES UN ARRAY REAL, LO MOSTRAMOS
          Array.isArray(products) ? (
             products.length > 0 ? (
                products.map((product) => (
                  <Card key={product.sku || product.id}>
                    <h1>{product.sku} - {product.name}</h1>
                    <p className='text-base'>
                      Stock: {product.stockQuantity} - ${product.currentUnitPrice} -{' '}
                      {product.isActive ? 'Activado' : 'Desactivado'}
                    </p>
                  </Card>
                ))
             ) : (
                <p className="text-center text-gray-500">No se encontraron productos.</p>
             )
          ) : (
             // SI NO ES ARRAY, MOSTRAMOS ESTE CUADRO ROJO PARA DEPURAR
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error de formato! </strong>
                <span className="block sm:inline">El backend no envió una lista. Esto es lo que llegó:</span>
                <pre className="mt-2 bg-white p-2 text-xs overflow-auto max-h-40 border border-red-200">
                   {JSON.stringify(products, null, 2)}
                </pre>
             </div>
          )
        )}
      </div>

      {/* Paginación */}
      <div className='flex justify-center items-center mt-3'>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='bg-gray-200 disabled:bg-gray-100 px-3 py-1 rounded'
        >
          Atras
        </button>
        <span className="mx-3">
          {pageNumber} / {totalPages || 1}
        </span>
        <button
          disabled={pageNumber >= totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className='bg-gray-200 disabled:bg-gray-100 px-3 py-1 rounded'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(evt) => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className='ml-3'
        >
          <option value="2">2</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default ListProductsPage;