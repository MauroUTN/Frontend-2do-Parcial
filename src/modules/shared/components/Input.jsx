function Input({ label, error = '', className = '', ...restProps }) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Solo renderiza el label si existe, para no ocupar espacio invisible */}
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      
      <input 
        className={`
          border rounded-lg p-2 outline-none transition-all w-full
          focus:ring-2 focus:ring-purple-200 
          ${error ? 'border-red-400' : 'border-gray-300'}
        `} 
        { ...restProps } 
      />
      
      {/* Solo ocupa espacio si hay error */}
      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </div>
  );
};

export default Input;