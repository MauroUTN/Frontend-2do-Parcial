import { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children }) {
  // Evitar scroll de fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      
      {/* Contenedor Blanco (Card) */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        
        {/* Botón Cerrar (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors font-bold text-xl"
        >
          ✕
        </button>

        {/* Contenido */}
        <div className="p-8">
          {title && <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;