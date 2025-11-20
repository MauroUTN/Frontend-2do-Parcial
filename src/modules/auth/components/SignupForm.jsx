import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

function SignupForm() {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const passwordValue = watch("password");

  const onValid = async (formData) => {
    try {
      setErrorMessage("");

      await api.post("/api/auth/register", {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Error al registrar usuario"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="
        flex flex-col gap-4 
        bg-white p-8 
        sm:w-md sm:rounded-lg sm:shadow-lg
      "
    >

      {/* Usuario */}
      <Input
        label="Usuario"
        {...register("username", {
          required: "El usuario es obligatorio",
          minLength: { value: 3, message: "Mínimo 3 caracteres" },
        })}
        error={errors.username?.message}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        {...register("email", {
          required: "El email es obligatorio",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Formato de email inválido",
          },
        })}
        error={errors.email?.message}
      />

      {/* Rol */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold">Role</label>
        <select
          className="border p-2 rounded"
          {...register("role", { required: "El rol es obligatorio" })}
        >
          <option value="">Seleccione una opción</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        {errors.role && (
          <span className="text-red-500">{errors.role.message}</span>
        )}
      </div>

      {/* Contraseña */}
      <Input
        label="Contraseña"
        type="password"
        {...register("password", {
          required: "La contraseña es obligatoria",
          minLength: { value: 6, message: "Mínimo 6 caracteres" },
        })}
        error={errors.password?.message}
      />

      {/* Confirmar contraseña */}
      <Input
        label="Confirmar contraseña"
        type="password"
        {...register("confirmPassword", {
          required: "Debe confirmar la contraseña",
          validate: (value) =>
            value === passwordValue || "Las contraseñas no coinciden",
        })}
        error={errors.confirmPassword?.message}
      />

      {/* Botones */}
      <Button type="submit">Registrar Usuario</Button>

      <Button
        type="button"
        variant="secondary"
        onClick={() => navigate("/login")}
      >
        Inicio de Sesión
      </Button>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </form>
  );
}

export default SignupForm;
