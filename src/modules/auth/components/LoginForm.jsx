import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const { singin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await singin(formData.username, formData.password);
      if (error) {
        setErrorMessage(error.frontendErrorMessage);
        return;
      }
      navigate('/admin/home');
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Llame a soporte');
      }
    }
  };

  return (
    <form className='
        flex flex-col gap-5
        bg-white
        p-6 sm:p-8
        w-full max-w-[90%] sm:max-w-md  /* Ajuste responsive: 90% en móvil, max-md en PC */
        rounded-2xl shadow-xl
        mx-auto
      '
    onSubmit={handleSubmit(onValid)}
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
        <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
      </div>

      <Input
        label='Usuario'
        { ...register('username', { required: 'Usuario es obligatorio' }) }
        error={errors.username?.message}
      />
      <Input
        label='Contraseña'
        { ...register('password', { required: 'Contraseña es obligatorio' }) }
        type='password'
        error={errors.password?.message}
      />

      <div className="mt-4 flex flex-col gap-3">
        <Button type='submit' className="w-full justify-center">Iniciar Sesión</Button>
        <Button variant='secondary' onClick={() => navigate('/register')} className="w-full justify-center">Registrar Usuario</Button>
      </div>
      
      {errorMessage && <p className='text-red-500 text-center text-sm'>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;