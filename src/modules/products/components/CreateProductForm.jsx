import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      internalCode: '',
      name: '',
      description: '',
      currentUnitPrice: 0,
      stockQuantity: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      const payload = {
        ...formData,
        currentUnitPrice: Number(formData.currentUnitPrice),
        stockQuantity: Number(formData.stockQuantity)
      };
      
      await createProduct(payload);
      navigate('/admin/products');
    } catch (error) {
      setErrorBackendMessage(error.response?.data?.detail || 'Error al crear el producto.');
    }
  };

  return (
    <Card className="max-w-3xl w-[95%] sm:w-full mx-auto border-none shadow-none sm:shadow-sm sm:border">
      <form className='flex flex-col gap-5 p-2 sm:p-8' onSubmit={handleSubmit(onValid)}>
        
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Nuevo Producto</h2>
            <Button 
                variant="secondary" 
                onClick={() => navigate('/admin/products')} 
                className="bg-gray-200 text-gray-700 px-4 py-1.5 text-sm rounded-lg font-medium"
            >
                Cancelar
            </Button>
        </div>

        {/* INPUTS ESTÁNDAR (py-2, text-base) */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input 
                label='SKU' 
                placeholder="Ej: TEC-001"
                error={errors.sku?.message} 
                {...register('sku', { required: 'SKU es requerido' })} 
            />
            
            <Input 
                label='Código Único' 
                placeholder="Ej: INT-999"
                error={errors.internalCode?.message} 
                {...register('internalCode', { required: 'Requerido' })} 
            />
        </div>

        <Input 
            label='Nombre' 
            placeholder="Nombre del producto"
            error={errors.name?.message} 
            {...register('name', { required: 'Requerido' })} 
        />
        
        <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700">Descripción</label>
            <textarea 
                className="w-full border border-gray-200 rounded-md p-2 hover:shadow outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                rows="3"
                placeholder="Detalles del producto..."
                {...register('description')} 
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input 
                label='Precio ($)' 
                type="number" 
                step="0.01" 
                error={errors.currentUnitPrice?.message} 
                {...register('currentUnitPrice', { required: 'Requerido', min: 0.01 })} 
            />

            <Input 
                label='Stock Inicial' 
                type="number" 
                error={errors.stockQuantity?.message} 
                {...register('stockQuantity', { required: 'Requerido', min: 0 })} 
            />
        </div>

        {errorBackendMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center border border-red-200 mt-2 text-sm">
                {errorBackendMessage}
            </div>
        )}

        <div className='mt-6 flex justify-end'>
          <Button type='submit' className="w-full sm:w-auto px-8 py-2.5 font-bold">Crear Producto</Button>
        </div>
      </form>
    </Card>
  );
}

export default CreateProductForm;