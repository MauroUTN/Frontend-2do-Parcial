import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useOrders } from '../hook/useOrders';

// Asegúrate de que estos valores coincidan EXACTAMENTE con lo que devuelve tu Backend (C#)
const orderStatus = {
  ALL: 'all',
  PENDING: 'Pending',
  COMPLETED: 'Delivered', 
  CANCELLED: 'Cancelled',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
};

function ListOrdersPage() {
  const { 
    orders, loading, total, 
    pageNumber, setPageNumber, 
    pageSize, setPageSize, 
    status, setStatus,
    searchTerm,
    handleInputChange,
    confirmSearch
  } = useOrders();

  const totalPages = total || 1;

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Órdenes</h1>

          {/* FIX: refreshOrders NO EXISTE */}
          <Button onClick={confirmSearch} className='hidden sm:block'>
            Refrescar
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex items-center gap-3 w-full'>
            <input 
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  confirmSearch();
                }
              }}
              type="text" 
              placeholder='Buscar por ID...' 
              className='text-[1.3rem] w-full border p-1 rounded' 
            />

            {/* Botón de buscar (faltaba) */}
            <Button onClick={confirmSearch}>
              Buscar
            </Button>
          </div>

          <select 
            onChange={evt => setStatus(evt.target.value)} 
            className='text-[1.3rem] border p-1 rounded bg-white'
          >
            <option value={orderStatus.ALL}>Todos</option>
            <option value={orderStatus.PENDING}>Pendientes</option>
            <option value={orderStatus.PROCESSING}>Procesando</option>
            <option value={orderStatus.SHIPPED}>Enviados</option>
            <option value={orderStatus.COMPLETED}>Entregados</option>
            <option value={orderStatus.CANCELLED}>Cancelados</option>
          </select>
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
          <p className="text-center text-gray-500">Cargando órdenes...</p>
        ) : orders.length === 0 ? (
           <p className="text-center text-gray-500">No se encontraron órdenes.</p>
        ) : (
          orders.map(order => (
            <Card key={order.id}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-xl">
                    #{order.id} - {order.customerName || order.clientName || "Cliente"}
                  </h2>
                  
                  <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>

                  <span className="ml-3 text-gray-500">
                    Total: ${order.totalAmount || order.total || 0}
                  </span>
                </div>
                <Button variant="secondary">Ver</Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className='flex justify-center items-center mt-3 gap-4'>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='bg-gray-200 px-3 py-1 rounded disabled:opacity-50'
        >
          Atrás
        </button>

        <span>Página {pageNumber} de {totalPages}</span>

        <button
          disabled={pageNumber >= totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className='bg-gray-200 px-3 py-1 rounded disabled:opacity-50'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
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

export default ListOrdersPage;
