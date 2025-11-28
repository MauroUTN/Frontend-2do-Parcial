import { useState } from 'react';
import useCart from '../../cart/hooks/useCart';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

function ProductCardClient({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity <= 0) return;

    addItem(
      {
        productId: product.id, // o product.productId según tu backend
        name: product.name,
        unitPrice: product.currentUnitPrice,
      },
      quantity
    );
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (Number.isNaN(value)) return;
    setQuantity(value < 1 ? 1 : value); // mínimo 1
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
      {/* Imagen placeholder */}
      <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 text-sm">
        Imagen de producto
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 mb-3">
        <h3 className="font-semibold text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description || 'Sin descripción.'}
        </p>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-900">
            ${product.currentUnitPrice?.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">
            Stock: {product.stockQuantity}
          </span>
        </div>
      </div>

      {/* Cantidad + botón */}
      <div className="mt-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Cantidad</span>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 text-center"
          />
        </div>

        <Button
          variant="default"
          className="px-4 py-2 text-sm rounded-full whitespace-nowrap"
          onClick={handleAddToCart}
        >
          Agregar
        </Button>
      </div>
    </div>
  );
}

export default ProductCardClient;
