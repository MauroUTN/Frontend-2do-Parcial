import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../../auth/services/login'; // Reusamos el servicio
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

const ClientLoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const [errorBackend, setErrorBackend] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setErrorBackend('');
    const { data: token, error } = await login(data.username, data.password);

    if (error) {
      setErrorBackend(error);
    } else {
      localStorage.setItem('token', token);
      // AQUÍ LA DIFERENCIA: No navegamos, solo avisamos que fue éxito
      onSuccess(); 
      window.location.reload(); // Recarga simple para actualizar estado (opcional, mejor usar contexto)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Usuario"
        placeholder="Tu usuario"
        error={errors.username?.message}
        {...register("username", { required: "Requerido" })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="******"
        error={errors.password?.message}
        {...register("password", { required: "Requerido" })}
      />

      {errorBackend && <p className="text-red-500 text-sm">{errorBackend}</p>}

      <div className="mt-4 flex flex-col gap-3">
        <Button type="submit" variant="default">
          Iniciar Sesión
        </Button>
        
        {/* Opción para cambiar a Registro */}
        <p className="text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <button 
            type="button" 
            onClick={onSwitchToRegister}
            className="text-gray-500 font-bold hover:underline"
          >
            Registrarse
          </button>
        </p>
      </div>
    </form>
  );
};

export default ClientLoginForm;