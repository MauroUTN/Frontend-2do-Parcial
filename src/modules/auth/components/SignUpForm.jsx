import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/register';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import Modal from '../../shared/components/Modal'; // 1. Importar Modal

function SignUpForm() {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState('');
  
  // 2. Estado para controlar el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setBackendError('');
    
    const payload = {
      Username: data.username,
      Email: data.email,
      Password: data.password,
      Rol: data.role,
      Name: data.name,
      PhoneNumber: data.phoneNumber
    };

    console.log("Enviando:", payload); 

    const { error } = await registerUser(payload);

    if (error) {
      setBackendError(typeof error === 'object' ? JSON.stringify(error) : error);
    } else {
      // 3. Éxito: En lugar de alert, abrimos el modal
      setShowSuccessModal(true);
    }
  };

  // Función para cerrar modal y redirigir
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

 return (
    <>
      <Card className="w-full max-w-[450px] p-8 shadow-lg bg-white rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          
          <Input
            label="Usuario"
            placeholder="Nombre de usuario"
            error={errors.username?.message}
            {...register("username", { required: "El usuario es requerido" })}
          />

          <Input
            label="Nombre Real"
            placeholder="Nombre y Apellido"
            error={errors.name?.message}
            {...register("name", { required: "El nombre es requerido" })}
          />

          <Input
            label="Teléfono"
            placeholder="Número de contacto"
            error={errors.phoneNumber?.message}
            {...register("phoneNumber", { required: "El teléfono es requerido" })}
          />

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

          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700">Role</label>
            <select
              className={`
                w-full border rounded-lg p-2 outline-none bg-white transition-all
                focus:ring-2 focus:ring-purple-200 
                ${errors.role ? 'border-red-400' : 'border-gray-300'}
              `}
              defaultValue="User"
              {...register("role", { required: "Debes seleccionar un rol" })}
            >
              <option value="Admin">Administrador</option>
              <option value="User">Cliente</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          <Input
            label="Contraseña"
            type="password"
            error={errors.password?.message}
            {...register("password", { 
              required: "La contraseña es requerida",
              minLength: { value: 8, message: "Mínimo 8 caracteres" }
            })}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", { 
              required: "Confirma tu contraseña",
              validate: value => value === password || "Las contraseñas no coinciden"
            })}
          />

          {backendError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {backendError}
            </div>
          )}

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

      {/* 4. MODAL DE ÉXITO AGREGADO */}
      <Modal isOpen={showSuccessModal} onClose={handleCloseSuccess} title="¡Registro Exitoso!">
        <div className="flex flex-col items-center gap-6 text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl">✓</div>
            <div>
              <p className="text-lg font-bold text-gray-800">El usuario ha sido registrado.</p>
              <p className="text-sm text-gray-500">Ahora puedes iniciar sesión con tus credenciales.</p>
            </div>
            <Button 
                variant="default" 
                className="w-full"
                onClick={handleCloseSuccess}
            >
                Ir al Login
            </Button>
        </div>
      </Modal>
    </>
  );
}

export default SignUpForm;