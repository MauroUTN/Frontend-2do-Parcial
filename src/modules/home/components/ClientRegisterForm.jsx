import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../auth/services/register';
import Button from '../../shared/components/Button';

const ClientRegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [errorBackend, setErrorBackend] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setErrorBackend('');
    setSuccessMessage('');

   const payload = {
      Username: data.username,
      Email: data.email,
      Password: data.password,
      Rol: 'User',
      Name: data.name,           
      PhoneNumber: data.phoneNumber 
    };

    const { error } = await registerUser(payload);

    if (error) {
      setErrorBackend(typeof error === 'object' ? JSON.stringify(error) : error);
    } else {
      setSuccessMessage("¡Cuenta creada con éxito!");
      setTimeout(() => {
        onSuccess(); 
        if(onSwitchToLogin) onSwitchToLogin();
      }, 1500);
    }
  };

  // ESTILOS AJUSTADOS: Tamaño normal
  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 text-base";
  const labelClass = "block text-gray-700 font-bold mb-1 text-sm";

   return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

      <div>
        <label className={labelClass}>Usuario</label>
        <input className={inputClass} placeholder="Ej: juanperez" {...register("username", { required: "Requerido" })} />
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Nombre Completo</label>
        <input className={inputClass} placeholder="Nombre y Apellido" {...register("name", { required: "Requerido" })} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Teléfono</label>
        <input className={inputClass} placeholder="+54 9 11 ..." {...register("phoneNumber", { required: "Requerido" })} />
        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input className={inputClass} type="email" placeholder="correo@ej.com" {...register("email", { required: "Requerido" })} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Contraseña</label>
        <input className={inputClass} type="password" placeholder="******" {...register("password", { required: "Requerido", minLength: { value: 8, message: "Min 8 chars" } })} />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Confirmar contraseña</label>
        <input className={inputClass} type="password" placeholder="******" {...register("confirmPassword", { validate: v => v === password || "No coinciden" })} />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>

      {errorBackend && (
        <div className="p-2 bg-red-50 text-red-600 text-sm rounded text-center border border-red-100">
          {errorBackend}
        </div>
      )}
      {successMessage && (
        <div className="p-2 bg-green-50 text-green-700 text-sm rounded text-center border border-green-100 font-bold">
          {successMessage}
        </div>
      )}

      <div className="mt-2 flex flex-col gap-3">
        <Button type="submit" variant="default" className="w-full py-2 text-base font-bold">
          Registrar Usuario
        </Button>
        
        {onSwitchToLogin && (
            <p className="text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={onSwitchToLogin} className="text-purple-600 font-bold hover:underline">
                Inicia Sesión
            </button>
            </p>
        )}
      </div>
    </form>
  );
};

export default ClientRegisterForm;