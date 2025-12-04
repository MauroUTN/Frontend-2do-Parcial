import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../../auth/services/login'; 
import Button from '../../shared/components/Button';

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
      onSuccess(); 
      window.location.reload(); 
    }
  };

  // ESTILOS AJUSTADOS: Tamaño normal, no "grande"
  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 text-base";
  const labelClass = "block text-gray-700 font-bold mb-1 text-sm";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      
      <div>
        <label className={labelClass}>Usuario</label>
        <input
            className={inputClass}
            placeholder="Tu usuario"
            {...register("username", { required: "Requerido" })}
        />
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Password</label>
        <input
            className={inputClass}
            type="password"
            placeholder="******"
            {...register("password", { required: "Requerido" })}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {errorBackend && (
        <div className="p-2 bg-red-50 text-red-600 text-sm rounded text-center border border-red-100">
            {errorBackend}
        </div>
      )}

      <div className="mt-2 flex flex-col gap-3">
        <Button type="submit" variant="default" className="w-full py-2 text-base font-semibold bg-purple-200 text-purple-800 hover:bg-purple-300">
          Iniciar Sesión
        </Button>
        
        {onSwitchToRegister && (
            <div className="text-center">
                <span className="text-gray-500 text-sm">¿No tienes cuenta? </span>
                <button 
                    type="button" 
                    onClick={onSwitchToRegister}
                    className="text-purple-600 font-bold text-sm hover:underline ml-1"
                >
                    Registrarse
                </button>
            </div>
        )}
      </div>
    </form>
  );
};

export default ClientLoginForm;