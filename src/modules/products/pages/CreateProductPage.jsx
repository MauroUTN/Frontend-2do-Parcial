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
      if (error.response?.data?.detail) {
        setErrorBackendMessage(error.response.data.detail);
      } else {
        setErrorBackendMessage('Error al crear el producto.');
      }
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <form className='flex flex-col gap-6 p-4 sm:p-8' onSubmit={handleSubmit(onValid)}>
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Nuevo Producto</h2>
            <Button variant="secondary" onClick={() => navigate('/admin/products')} className="text-sm px-3 py-1">Cancelar</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        
        <Input 
            label='Descripción' 
            placeholder="Detalles del producto..."
            {...register('description')} 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input 
                label='Precio ($)' 
                type="number" 
                step="0.01" 
                error={errors.currentUnitPrice?.message} 
                {...register('currentUnitPrice', { required: 'Requerido', min: { value: 0.01, message: '> 0' } })} 
            />

            <Input 
                label='Stock Inicial' 
                type="number" 
                error={errors.stockQuantity?.message} 
                {...register('stockQuantity', { required: 'Requerido', min: { value: 0, message: '>= 0' } })} 
            />
        </div>

        {errorBackendMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                {errorBackendMessage}
            </div>
        )}

        <div className='mt-4 flex justify-end'>
          <Button type='submit' className="w-full sm:w-auto px-8">Crear Producto</Button>
        </div>
      </form>
    </Card>
  );
}

export default CreateProductForm;