function Input({ label, error = '', className = '', ...restProps }) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && <label className="mb-1 font-medium text-gray-700 text-sm">{label}</label>}
      <input
        className={`
          border rounded-lg px-3 py-2 outline-none transition-all w-full
          text-base text-gray-700
          focus:ring-2 focus:ring-purple-200
          ${error ? 'border-red-400' : 'border-gray-200'}
        `}
        { ...restProps }
      />
      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  );
};

export default Input;