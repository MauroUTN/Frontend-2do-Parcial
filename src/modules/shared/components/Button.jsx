import React from 'react';

function Button({ children, type = 'button', variant = 'default', ...restProps }) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  // Estilos base:
  // - Se quitó 'w-full' para que funcionen bien en horizontal.
  // - 'rounded-lg': redondeado medio, como en la imagen 1.
  // - 'font-medium': peso de fuente medio, no negrita.
  // - 'text-gray-600': el color gris exacto para el texto en ambos casos.
  const baseClasses = "py-2 px-6 rounded-lg font-medium text-gray-600 transition duration-200 ease-in-out flex items-center justify-center text-sm sm:text-base";

  const variantStyle = {
    // Botón Morado Claro (texto gris)
    default: 'bg-purple-200 hover:bg-purple-300',
    // Botón Gris Claro (texto gris)
    secondary: 'bg-gray-200 hover:bg-gray-300',
  };

  const selectedVariant = variantStyle[variant] || variantStyle.default;

  return (
    <button
      {...restProps}
      type={type}
      className={`${baseClasses} ${selectedVariant} ${restProps.className || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;