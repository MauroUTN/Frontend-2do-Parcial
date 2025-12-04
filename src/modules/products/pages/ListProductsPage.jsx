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
                    onChange={(e) => { setStatus(e.target.value); handlePageChange(1); }}
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
                
                {/* BOTÓN ELIMINADO A PEDIDO DEL USUARIO */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-none pt-3 sm:pt-0 border-gray-100 mt-1 sm:mt-0">
                    <span className="font-bold text-lg text-gray-900">${product.currentUnitPrice}</span>
                </div>
            </div>
          ))
        )}
      </div>

      <div className='flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 text-sm text-gray-600'>
        <div className="flex gap-2">
            <button disabled={pageNumber === 1} onClick={() => handlePageChange(pageNumber - 1)} className='bg-white border px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-gray-50'>Anterior</button>
            <span className="flex items-center px-2 font-medium">Pág {pageNumber} de {totalPages || 1}</span>
            <button disabled={pageNumber >= totalPages} onClick={() => handlePageChange(pageNumber + 1)} className='bg-white border px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-gray-50'>Siguiente</button>
        </div>
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); handlePageChange(1); }}
          className='border border-gray-300 py-1.5 px-3 rounded-lg bg-white outline-none w-full sm:w-auto text-center'
        >
          <option value="5">5 filas</option>
          <option value="10">10 filas</option>
          <option value="20">20 filas</option>
        </select>
      </div>
    </div>
  );
}

export default ListProductsPage;