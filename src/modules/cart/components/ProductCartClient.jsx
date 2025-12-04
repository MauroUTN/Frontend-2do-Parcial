import Button from '../../shared/components/Button';

function ProductCartClient({ item, onUpdateQuantity, onRemove }) {
  
  const subtotal = item.unitPrice * item.quantity;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
      
      {/* Imagen Placeholder */}
      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 flex-shrink-0">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>

      {/* Información */}
      <div className="flex-1 w-full text-center sm:text-left">
        <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
        
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-1 text-sm text-gray-500">
          <span>Cantidad: <span className="font-medium text-gray-900">{item.quantity}</span></span>
          <span className="hidden sm:inline">|</span>
          <span>Sub Total: <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span></span>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-3">
        
        {/* Selector Cantidad Responsive */}
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
          <button 
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            // AQUÍ EL CAMBIO: Pequeño en móvil, normal en PC
            className="w-8 h-8 sm:w-auto sm:px-3 sm:py-1 text-gray-600 hover:bg-gray-200 rounded-l-lg font-bold transition-colors flex items-center justify-center"
          >
            -
          </button>
          
          <span className="w-8 text-center font-medium text-gray-800 text-sm sm:text-base">
            {item.quantity}
          </span>
          
          <button 
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            // AQUÍ EL CAMBIO: Pequeño en móvil, normal en PC
            className="w-8 h-8 sm:w-auto sm:px-3 sm:py-1 text-gray-600 hover:bg-gray-200 rounded-r-lg font-bold transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>

        <Button 
          variant="secondary"
          className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-none text-xs sm:text-sm px-3 py-1.5 h-8 sm:h-auto"
          onClick={() => onRemove(item.productId)} 
        >
          Borrar
        </Button>
      </div>
    </div>
  );
}

export default ProductCartClient;