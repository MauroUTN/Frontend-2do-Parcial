import { useState } from 'react';
import Button from '../../shared/components/Button';
import useCart from '../../cart/hook/useCart'; 

const ProductCardClient = ({ product, onRequireLogin }) => {
  const [quantity, setQuantity] = useState(0);
  const { addItem } = useCart(); 

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      onRequireLogin();
      return;
    }

    if (quantity < 1) return;

   
    addItem({
      productId: product.id || product.sku,
      name: product.name,
      unitPrice: product.currentUnitPrice || product.price, 
      stock: product.stockQuantity
    }, quantity);

    setQuantity(0); 
  };

  return (
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4 transition-all hover:shadow-md">
  {/* Imagen */}
  <div className="bg-gray-100 rounded-lg h-48 w-full flex items-center justify-center">
    <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>

  {/* Info */}
  <h3 className="text-gray-800 font-semibold text-base line-clamp-2 min-h-[44px]">
    {product.name}
  </h3>

  {/* Precio y cantidad */}
  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
    <span className="font-bold text-gray-900 text-xl">
      ${product.currentUnitPrice || product.price}
    </span>
    <div className="flex items-center">
      <button onClick={handleDecrement} className="text-gray-500 font-bold px-3 py-1.5 hover:bg-gray-100 rounded-l-lg">-</button>
      <span className="text-gray-700 w-8 text-center text-sm font-medium">{quantity}</span>
      <button onClick={handleIncrement} className="text-gray-500 font-bold px-3 py-1.5 hover:bg-gray-100 rounded-r-lg">+</button>
    </div>
  </div>

  {/* Botón Agregar */}
  <div className="mt-4">
    <Button
      onClick={handleAddToCart}
      disabled={quantity === 0}
      variant="default"
      className={`w-full px-4 py-2 text-sm rounded-lg font-semibold ${quantity === 0 ? 'opacity-50' : ''}`}
    >
      Agregar
    </Button>
  </div>
</div>
  );
};

export default ProductCardClient;