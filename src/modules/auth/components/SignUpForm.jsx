import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/register';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';

function SignUpForm() {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setBackendError('');
    
    // --- CORRECCIÓN CRÍTICA ---
   const payload = {
      Username: data.username,
      Email: data.email,
      Password: data.password,
      Rol: data.role,
      // Mapeamos los nuevos campos
      Name: data.name,
      PhoneNumber: data.phoneNumber
    };

    console.log("Enviando:", payload); // Para verificar en consola

    const { error } = await registerUser(payload);

    if (error) {
      // Si el error es objeto (ej: validación), lo hacemos texto
      setBackendError(typeof error === 'object' ? JSON.stringify(error) : error);
    } else {
      alert("Usuario registrado con éxito. Ahora inicia sesión.");
      navigate('/login');
    }
  };

 return (
    <Card className="w-full max-w-[450px] p-8 shadow-lg bg-white rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        {/* Usuario (Existente) */}
        <Input
          label="Usuario"
          placeholder="Nombre de usuario"
          error={errors.username?.message}
          {...register("username", { required: "El usuario es requerido" })}
        />

        {/* NUEVO: Nombre */}
        <Input
          label="Nombre Real"
          placeholder="Nombre y Apellido"
          error={errors.name?.message}
          {...register("name", { required: "El nombre es requerido" })}
        />

        {/* NUEVO: Teléfono */}
        <Input
          label="Teléfono"
          placeholder="Número de contacto"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber", { required: "El teléfono es requerido" })}
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
          {...register("email", { 
            required: "El email es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido"
            }
          })}
        />

        {/* SELECTOR DE ROL */}
        <div className="flex flex-col w-full">
          <label className="mb-1 font-medium text-gray-700">Role</label>
          <select
            className={`
              w-full border rounded-lg p-2 outline-none bg-white transition-all
              focus:ring-2 focus:ring-purple-200 
              ${errors.role ? 'border-red-400' : 'border-gray-300'}
            `}
            // Valor por defecto para evitar errores de campo vacío
            defaultValue="User"
            {...register("role", { required: "Debes seleccionar un rol" })}
          >
            {/* Value = Lo que va a la BD ("Admin"/"User") */}
            {/* Texto = Lo que ve la persona ("Administrador"/"Cliente") */}
            <option value="Admin">Administrador</option>
            <option value="User">Cliente</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
        </div>

        {/* Contraseña */}
        <Input
          label="Contraseña"
          type="password"
          error={errors.password?.message}
          {...register("password", { 
            required: "La contraseña es requerida",
            minLength: { value: 8, message: "Mínimo 8 caracteres" }
          })}
        />

        {/* Confirmar Contraseña */}
        <Input
          label="Confirmar contraseña"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", { 
            required: "Confirma tu contraseña",
            validate: value => value === password || "Las contraseñas no coinciden"
          })}
        />

        {/* Mensaje de Error del Backend */}
        {backendError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {backendError}
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col gap-3 mt-4">
          
          <Button 
            type="submit" 
            variant="default" 
            className="w-full justify-center py-2.5 font-semibold"
          >
            Registrar Usuario
          </Button>

          <Button 
            type="button" 
            variant="secondary" 
            className="w-full justify-center py-2.5 font-semibold"
            onClick={() => navigate('/login')}
          >
            Inicio de Sesión
          </Button>
        </div>

      </form>
    </Card>
  );
}

export default SignUpForm;