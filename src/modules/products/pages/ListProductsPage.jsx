import { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import useProducts from '../hook/useProducts';
import SearchBar from '../../shared/components/SearchBar';

function ListProductsPage() {
  const navigate = useNavigate();
  
  // 1. Desestructuración corregida: Quitamos handlePageChange y usamos setPageNumber
  const {
    products, 
    loading, 
    totalPages,
    searchTerm, 
    setSearchTerm,
    status, 
    setStatus,
    pageNumber, 
    setPageNumber, // <--- Usamos esto para cambiar de página
    pageSize, 
    setPageSize,
    handleSearch,
    productStatus,
    setSearchSku 
  } = useProducts();

  useEffect(() => {
    setSearchSku(true);
    return () => setSearchSku(false);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-5 mb-6">
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>Productos</h1>
          <Button onClick={() => navigate('/admin/products/create')} className="text-sm h-10 px-4">
            <span className="sm:hidden">+ Crear</span>
            <span className="hidden sm:inline">Crear Producto</span>
          </Button>
        </div>

        <Card className="p-4 shadow-sm border border-gray-200">
            <div className='flex flex-col sm:flex-row gap-3'>
                <div className='flex-1'>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSearch={handleSearch}
                        placeholder='Buscar por nombre o SKU...'
                        className='w-full bg-gray-50 border-gray-200 h-10'
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => { 
                      setStatus(e.target.value); 
                      setPageNumber(1); // Reset a pág 1 al filtrar
                    }}
                    className='h-10 border border-gray-200 rounded-lg bg-gray-50 text-sm px-3 outline-none focus:ring-2 focus:ring-purple-200 w-full sm:w-48 text-gray-700'
                >
                    <option value={productStatus.ALL}>Todos</option>
                    <option value={productStatus.ENABLED}>Habilitados</option>
                    <option value={productStatus.DISABLED}>Inhabilitados</option>
                </select>
            </div>
        </Card>
      </div>

      <div className='grid gap-3'>
        {loading ? (
          <p className="text-center text-gray-500 py-12">Cargando...</p>
        ) : (
          (products || []).map((product) => (
            <div key={product.id || product.sku} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-3 transition-shadow hover:shadow-md">
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                            {product.sku}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <h2 className="font-bold text-gray-800 text-base sm:text-lg truncate">{product.name}</h2>
                    <p className="text-sm text-gray-500">Stock: <span className="font-medium text-gray-800">{product.stockQuantity}</span></p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-none pt-3 sm:pt-0 border-gray-100 mt-1 sm:mt-0">
                    <span className="font-bold text-lg text-gray-900">${product.currentUnitPrice}</span>
                </div>
            </div>
          ))
        )}
      </div>

      {/* --- PAGINACIÓN CORREGIDA Y CON NUEVO ESTILO --- */}
      <div className='flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 border-t border-gray-200 pt-4'>
        
        {/* Botones (Izquierda) */}
        <div className="flex items-center gap-3">
            <button 
              disabled={pageNumber === 1} 
              onClick={() => setPageNumber(pageNumber - 1)} 
              className='px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium'
            >
              Anterior
            </button>
            
            <span className="text-sm text-gray-600 font-semibold px-2">
              Pág {pageNumber} de {totalPages || 1}
            </span>
            
            <button 
              disabled={pageNumber >= totalPages} 
              onClick={() => setPageNumber(pageNumber + 1)} 
              className='px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium'
            >
              Siguiente
            </button>
        </div>

        {/* Selector (Derecha) */}
        <div className="flex items-center">
            <select
              value={pageSize}
              onChange={(e) => { 
                setPageSize(Number(e.target.value)); 
                setPageNumber(1); 
              }}
              className='cursor-pointer bg-white border border-gray-300 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-200 shadow-sm hover:border-gray-400 transition-colors'
            >
              <option value="5">5 filas</option>
              <option value="10">10 filas</option>
              <option value="20">20 filas</option>
              <option value="50">50 filas</option>
            </select>
        </div>
      </div>
    </div>
  );
}

export default ListProductsPage;