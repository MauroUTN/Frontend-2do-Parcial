import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../auth/services/register';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

const ClientRegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [errorBackend, setErrorBackend] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Nuevo estado para mensaje verde
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setErrorBackend('');
    setSuccessMessage('');

    // Payload con Mayúsculas para que C# lo entienda bien
    const payload = {
      Username: data.username,
      Email: data.email,
      Password: data.password,
      Rol: 'User', // Rol de cliente
      Name: data.username
    };

    const { error } = await registerUser(payload);

    if (error) {
      // Si falla, mostramos error rojo
      setErrorBackend(typeof error === 'object' ? JSON.stringify(error) : error);
    } else {
      // SI ES EXITOSO:
      // 1. Mostramos mensaje verde
      setSuccessMessage("¡Cuenta creada con éxito! Redirigiendo al login...");
      
      // 2. Esperamos 1.5 segundos y cambiamos al Login automáticamente
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input
        label="Usuario"
        error={errors.username?.message}
        {...register("username", { required: "Requerido" })}
      />
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email", { required: "Requerido" })}
      />
      <Input
        label="Contraseña"
        type="password"
        error={errors.password?.message}
        {...register("password", { 
           required: "Requerido", 
           minLength: { value: 8, message: "Mínimo 8 caracteres" } 
        })}
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", { 
           validate: v => v === password || "No coinciden" 
        })}
      />

      {/* MENSAJES DE ESTADO */}
      
      {/* Error Rojo */}
      {errorBackend && (
        <div className="p-2 bg-red-50 text-red-600 text-sm rounded text-center border border-red-200">
          {errorBackend}
        </div>
      )}

      {/* Éxito Verde */}
      {successMessage && (
        <div className="p-2 bg-green-50 text-green-700 text-sm rounded text-center border border-green-200 font-medium">
          {successMessage}
        </div>
      )}

      <div className="mt-2 flex flex-col gap-3">
        <Button type="submit" variant="default">
          Registrar Usuario
        </Button>
        
        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            className="text-gray-500 font-bold hover:underline"
          >
            Inicia Sesión
          </button>
        </p>
      </div>
    </form>
  );
};

export default ClientRegisterForm;