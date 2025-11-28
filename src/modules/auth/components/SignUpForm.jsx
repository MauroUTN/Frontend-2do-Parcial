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

  // Observamos la contraseña para validarla contra la confirmación
  const password = watch("password");

  const onSubmit = async (data) => {
    setBackendError('');
    
    // Preparamos los datos según lo que espera tu API (revisar Swagger)
    const payload = {
      userName: data.username,
      email: data.email,
      password: data.password,
      rol: data.role, // Asegúrate que el backend espera "rol" o "role"
      name: data.username // O agrega un campo extra si lo necesitas
    };

    const { error } = await registerUser(payload);

    if (error) {
      setBackendError(error);
    } else {
      alert("Usuario registrado con éxito");
      navigate('/login');
    }
  };

  return (
    <Card>
      <div className="w-full sm:w-[400px] p-4 flex flex-col gap-4">
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          
          {/* Usuario */}
          <Input
            label="Usuario"
            placeholder="Nombre de usuario"
            error={errors.username?.message}
            {...register("username", { required: "El usuario es requerido" })}
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

          {/* Selector de Rol (Select nativo con estilos de Tailwind) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-purple-500 bg-white"
              {...register("role", { required: "Debes seleccionar un rol" })}
            >
              <option value="">Seleccione una opción</option>
              <option value="Administrador">Administrador</option>
              <option value="Cliente">Cliente</option>
            </select>
            {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
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
            <p className="text-red-500 text-sm text-center">{backendError}</p>
          )}

          {/* Botones */}
          <div className="flex flex-col gap-3 mt-4">
            {/* Botón Principal: Registrar (Violeta) */}
            <Button 
              type="submit" 
              variant="default" 
              className="w-full justify-center"
            >
              Registrar Usuario
            </Button>

            {/* Botón Secundario: Ir a Login (Gris) */}
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full justify-center"
              onClick={() => navigate('/login')}
            >
              Inicio de Sesión
            </Button>
          </div>

        </form>
      </div>
    </Card>
  );
}

export default SignUpForm;