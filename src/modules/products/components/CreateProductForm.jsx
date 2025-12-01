import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { frontendErrorMessage } from '../helpers/backendError';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      internalCode: '', // IMPORTANTE: Se llama internalCode
      name: '',
      description: '',
      currentUnitPrice: 0, // IMPORTANTE: Se llama currentUnitPrice
      stockQuantity: 0,    // IMPORTANTE: Se llama stockQuantity
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      // Convertimos los textos a números para que el backend no falle
      const payload = {
        ...formData,
        currentUnitPrice: Number(formData.currentUnitPrice),
        stockQuantity: Number(formData.stockQuantity)
      };
      
      console.log("ENVIANDO AL BACKEND:", payload); // <--- MIRA ESTO EN LA CONSOLA (F12)

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
    <Card>
      <form className='flex flex-col gap-6 p-8' onSubmit={handleSubmit(onValid)}>
        <h2 className="text-xl font-bold">Nuevo Producto</h2>

        {/* SKU */}
        <Input 
            label='SKU' 
            error={errors.sku?.message} 
            {...register('sku', { required: 'SKU es requerido' })} 
        />
        
        {/* CÓDIGO ÚNICO - ¡FÍJATE QUE DIGA internalCode! */}
        <Input 
            label='Código Único' 
            error={errors.internalCode?.message} 
            {...register('internalCode', { required: 'Requerido' })} 
        />

        {/* NOMBRE */}
        <Input 
            label='Nombre' 
            error={errors.name?.message} 
            {...register('name', { required: 'Requerido' })} 
        />
        
        {/* DESCRIPCIÓN */}
        <Input label='Descripción' {...register('description')} />

        {/* PRECIO - ¡FÍJATE QUE DIGA currentUnitPrice! */}
        <Input 
            label='Precio' 
            type="number" 
            step="0.01" 
            error={errors.currentUnitPrice?.message} 
            {...register('currentUnitPrice', { required: 'Requerido', min: { value: 0.01, message: '> 0' } })} 
        />

        {/* STOCK - ¡FÍJATE QUE DIGA stockQuantity! */}
        <Input 
            label='Stock' 
            type="number" 
            error={errors.stockQuantity?.message} 
            {...register('stockQuantity', { required: 'Requerido', min: { value: 0, message: '>= 0' } })} 
        />

        <div className='mt-4 text-right'>
          <Button type='submit'>Crear Producto</Button>
        </div>
        
        {errorBackendMessage && <p className='text-red-500 text-center mt-2'>{errorBackendMessage}</p>}
      </form>
    </Card>
  );
}

export default CreateProductForm;