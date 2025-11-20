// src/modules/auth/components/SignupForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { frontendErrorMessage } from '../helpers/backendError';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function SignupForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      role: 'User', // por defecto usuario normal
    },
  });

  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });

      // Si todo salió bien, lo mando al login
      navigate('/login');
    } catch (error) {
      // mismo manejo de error que en login
      if (error?.response?.data?.code) {
        const code = error.response.data.code;
        setErrorMessage(
          frontendErrorMessage[code] ?? 'Error en el registro. Llame a soporte'
        );
      } else {
        setErrorMessage('Error inesperado. Llame a soporte');
      }
    }
  };

  return (
    <form
      className='
        flex
        flex-col
        gap-4
        bg-white
        p-8
        sm:w-md
        sm:rounded-lg
        sm:shadow-lg
      '
      onSubmit={handleSubmit(onValid)}
    >
      <h1 className='text-xl font-semibold mb-2'>Registrar Usuario</h1>

      <Input
        label='Usuario'
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />

      <Input
        label='Contraseña'
        type='password'
        {...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: {
            value: 6,
            message: 'Debe tener al menos 6 caracteres',
          },
        })}
        error={errors.password?.message}
      />

      {/* Si querés que el admin pueda elegir rol: */}
      <div className='flex flex-col gap-1'>
        <label className='text-sm font-medium'>Rol</label>
        <select
          className='border rounded px-3 py-2 text-sm'
          {...register('role', { required: true })}
        >
          <option value='User'>User</option>
          <option value='Admin'>Admin</option>
        </select>
      </div>

      <Button type='submit'>Crear usuario</Button>

      <Button
        type='button'
        variant='secondary'
        onClick={() => navigate('/login')}
      >
        Volver al login
      </Button>

      {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
    </form>
  );
}

export default SignupForm;
