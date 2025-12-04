import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import SearchBar from '../../shared/components/SearchBar'; // 1. Importar
import { useOrders } from '../hook/useOrders';

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

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleDetails = (id) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const totalPages = total || 1;

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Órdenes</h1>
          <Button onClick={confirmSearch} className='hidden sm:block'>
            Refrescar
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <SearchBar 
              value={searchTerm}
              onChange={(val) => handleInputChange({ target: { value: val } })}
              onSearch={confirmSearch}
              placeholder='Buscar por cliente...'  // <--- Cambio estético
              className='w-full'
            />
          </div>

          <select 
            onChange={evt => setStatus(evt.target.value)} 
            className='text-[1.3rem] border border-gray-300 p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-200'
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

      {/* RESTO DEL COMPONENTE IGUAL (Listado y Paginación) */}
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
                  <h2 className="font-bold text-xl text-gray-800">
                    {order.customerName}
                  </h2>
                  <p className="text-xs text-gray-400 mb-2">Orden #{order.id}</p>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {order.status}
                    </span>

                    <span className="text-gray-700 font-semibold">
                        Total: ${order.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button variant="secondary" onClick={() => toggleDetails(order.id)}>
                    {expandedOrderId === order.id ? 'Ocultar' : 'Ver Detalles'}
                </Button>
              </div>

              {expandedOrderId === order.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                        <p><strong>Fecha:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                        <p><strong>Cliente ID:</strong> {order.customerId}</p>
                        <p><strong>Envío:</strong> {order.shippingAddress}</p>
                        <p><strong>Facturación:</strong> {order.billingAddress}</p>
                        {order.notes && <p className="md:col-span-2"><strong>Notas:</strong> {order.notes}</p>}
                    </div>
                </div>
              )}
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