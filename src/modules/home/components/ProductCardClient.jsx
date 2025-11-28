import { useState } from 'react';

const ProductCardClient = ({ product }) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    // Aquí podrías validar stock si quisieras: if (quantity < product.stockQuantity) ...
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleAddToCart = () => {
    // REQUISITO PDF: "no puede agregar 0 productos"
    if (quantity < 1) return;

    // 1. Leer el carrito actual del localStorage
    const storedCart = localStorage.getItem('cart');
    let cart = storedCart ? JSON.parse(storedCart) : [];

    // 2. Buscar si el producto ya existe para sumar cantidad
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Agregamos el producto nuevo con la cantidad seleccionada
      // Guardamos id, nombre, precio y cantidad
      cart.push({ 
        id: product.id,
        name: product.name,
        price: product.currentUnitPrice || product.price,
        quantity 
      });
    }

    // 3. Guardar en localStorage (Key: 'cart')
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`Se agregaron ${quantity} unidades de ${product.name} al carrito`);
    setQuantity(0); // Reseteamos el contador visual
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-3">
      {/* Imagen Gris */}
      <div className="bg-gray-200 rounded-md h-40 w-full flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Título */}
      <h3 className="text-gray-700 font-medium text-sm line-clamp-2 min-h-[40px]">
        {product.name}
      </h3>

      {/* Precio y Controles */}
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold text-gray-900">
          ${product.currentUnitPrice || product.price}
        </span>

        <div className="flex items-center gap-2">
          {/* Contador (- 0 +) */}
          <div className="flex items-center">
            <button 
              onClick={handleDecrement}
              className="text-gray-500 hover:text-gray-700 font-bold px-2 py-1"
            >
              -
            </button>
            <span className="text-gray-700 w-6 text-center text-sm font-medium">
              {quantity}
            </span>
            <button 
              onClick={handleIncrement}
              className="text-gray-500 hover:text-gray-700 font-bold px-2 py-1"
            >
              +
            </button>
          </div>

          {/* Botón Agregar */}
          <button
            onClick={handleAddToCart}
            disabled={quantity === 0} 
            className={`
              px-3 py-1 rounded-md text-sm font-medium transition-colors
              ${quantity > 0 
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardClient;