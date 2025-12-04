import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import SearchBar from '../../shared/components/SearchBar';
import { useOrders } from '../hook/useOrders';

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
  const toggleDetails = (id) => setExpandedOrderId(prev => prev === id ? null : id);
  const totalPages = total || 1;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>Órdenes</h1>
          <button onClick={confirmSearch} className="sm:hidden text-purple-300 font-medium text-sm">Refrescar</button>
      </div>

      <Card className="mb-6 p-4 shadow-sm border border-gray-200">
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='flex-1'>
            <SearchBar 
              value={searchTerm}
              onChange={(val) => handleInputChange({ target: { value: val } })}
              onSearch={confirmSearch}
              placeholder='Buscar por cliente...'
              className='w-full bg-gray-50 border-gray-200 h-10'
            />
          </div>

          <div className="flex gap-2">
            <select 
                onChange={evt => setStatus(evt.target.value)} 
                className='h-10 border border-gray-200 rounded-lg bg-gray-50 text-sm px-3 outline-none focus:ring-2 focus:ring-purple-200 flex-1 sm:w-40 text-gray-700'
            >
                <option value="all">Todos</option>
                <option value="Pending">Pendientes</option>
                <option value="Processing">Procesando</option>
                <option value="Shipped">Enviados</option>
                <option value="Delivered">Entregados</option>
                <option value="Cancelled">Cancelados</option>
            </select>
            <Button onClick={confirmSearch} className='hidden sm:flex h-10 items-center px-4'>Refrescar</Button>
          </div>
        </div>
      </Card>

      <div className='grid gap-3'>
        {loading ? (
          <p className="text-center text-gray-500 py-12">Cargando...</p>
        ) : orders.length === 0 ? (
           <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-500">No se encontraron órdenes.</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Info Principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between sm:justify-start items-center gap-3 mb-1">
                      <span className="font-bold text-gray-800 text-base truncate">{order.customerName}</span>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase flex-shrink-0 ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono flex flex-wrap items-center gap-2">
                    {/* ID COMPLETO */}
                    <span className="break-all">ID: {order.id}</span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Precio y Acción */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-none pt-3 sm:pt-0 border-gray-100 mt-1 sm:mt-0">
                    <span className="text-gray-900 font-bold text-lg">
                        ${order.totalAmount?.toFixed(2)}
                    </span>
                    <Button variant="secondary" onClick={() => toggleDetails(order.id)} className="px-4 py-1.5 text-xs sm:text-sm h-8 sm:h-9">
                        {expandedOrderId === order.id ? 'Ocultar' : 'Ver Detalles'}
                    </Button>
                </div>
              </div>

              {/* Detalles Expandibles */}
              {expandedOrderId === order.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-4 px-4 -mb-4 pb-4 sm:mx-0 sm:px-4 sm:mb-0 sm:pb-4 sm:rounded-b-lg text-sm text-gray-600 animate-in fade-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Envío</p>
                            <p className="bg-white p-2 rounded border border-gray-100">{order.shippingAddress}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Facturación</p>
                            <p className="bg-white p-2 rounded border border-gray-100">{order.billingAddress}</p>
                        </div>
                        {order.notes && (
                            <div className="sm:col-span-2">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Notas</p>
                                <p className="italic text-gray-500">"{order.notes}"</p>
                            </div>
                        )}
                    </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className='flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 border-t border-gray-200 pt-4'>
  
  {/* Botones de navegación (Izquierda) */}
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

  {/* Selector de filas (Derecha) */}
  <div className="flex items-center">
    <select
      value={pageSize}
      onChange={(e) => { 
        setPageSize(Number(e.target.value)); 
        setPageNumber(1); // Resetear a página 1 al cambiar tamaño
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

export default ListOrdersPage;