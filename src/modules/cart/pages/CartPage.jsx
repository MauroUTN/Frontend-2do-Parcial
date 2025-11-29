import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import Button from '../../shared/components/Button';

function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const hasItems = items.length > 0;

  const handleDecrease = (item) => {
    const next = item.quantity - 1;
    updateQuantity(item.productId, next);
  };

  const handleIncrease = (item) => {
    const next = item.quantity + 1;
    updateQuantity(item.productId, next);
  };

  const handleCheckout = () => {
    // Acá después enchufás la lógica:
    // - si está logueado -> /api/orders
    // - si no -> abrir modal de login
    console.log('Finalizar compra - por implementar con API');
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR (reutilizamos el estilo del catálogo) */}
      <header className="sticky top-0 bg-white z-20 shadow-sm border-b border-gray-200 h-20 px-6 flex items-center justify-between">
        <div className="flex-1 flex items-center gap-8 h-full">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white font-bold text-xl pb-1">
              J
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Store
            </span>
          </div>

          <nav className="hidden lg:flex gap-4 items-center">
            <span
              className="cursor-pointer hover:text-black transition-colors px-4 py-2 font-semibold text-sm text-gray-500"
              onClick={() => navigate('/')}
            >
              Productos
            </span>
            <span className="text-black cursor-pointer bg-gray-100 px-4 py-2 rounded-full font-semibold text-sm">
              Carrito de compras
            </span>
          </nav>
        </div>

        <div className="flex-1 flex items-center justify-end gap-3 h-full">
          <Button
            onClick={() => navigate('/login')}
            variant="default"
            className="w-auto px-6 whitespace-nowrap"
          >
            Iniciar Sesión
          </Button>

          <Button
            onClick={() => navigate('/register')}
            variant="secondary"
            className="w-auto px-6 whitespace-nowrap"
          >
            Registrar Usuario
          </Button>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-[1400px] mx-auto p-6 bg-gray-50 min-h-[calc(100vh-80px)]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de productos */}
          <section className="flex-1 bg-white rounded-2xl shadow-sm p-5">
            <h1 className="text-xl font-semibold mb-4">
              Carrito de compras
            </h1>

            {!hasItems && (
              <div className="text-gray-400 text-sm py-10 text-center">
                Tu carrito está vacío. Volvé al catálogo para agregar productos.
              </div>
            )}

            {hasItems && (
              <div className="flex flex-col gap-4">
                {items.map((item) => {
                  const subtotal = item.unitPrice * item.quantity;
                  return (
                    <div
                      key={item.productId}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4 gap-4"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Cantidad de productos: {item.quantity}
                        </span>
                        <span className="text-xs text-gray-500">
                          Sub Total: ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 border rounded-full px-3 py-1 bg-gray-50">
                          <button
                            type="button"
                            className="text-lg leading-none px-1"
                            onClick={() => handleDecrease(item)}
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="text-lg leading-none px-1"
                            onClick={() => handleIncrease(item)}
                          >
                            +
                          </button>
                        </div>

                        <Button
                          variant="secondary"
                          className="text-xs px-4 py-1"
                          onClick={() => removeItem(item.productId)}
                        >
                          Borrar
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 flex justify-between">
                  <Button
                    variant="secondary"
                    className="text-xs"
                    onClick={() => {
                      if (window.confirm('¿Vaciar carrito?')) {
                        clearCart();
                      }
                    }}
                  >
                    Vaciar carrito
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Detalle de pedido */}
          <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-sm p-5 h-fit">
            <h2 className="text-lg font-semibold mb-4">
              Detalle de pedido
            </h2>

            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Cantidad de productos</span>
              <span>
                {items.reduce((acc, x) => acc + x.quantity, 0)}
              </span>
            </div>

            <div className="flex justify-between mb-4 text-sm text-gray-600">
              <span>Sub Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Total a pagar
              </span>
              <span className="text-xl font-bold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>

            <Button
              className="mt-5 w-full rounded-full py-2 font-semibold"
              variant="default"
              disabled={!hasItems}
              onClick={handleCheckout}
            >
              Finalizar compra
            </Button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CartPage;
