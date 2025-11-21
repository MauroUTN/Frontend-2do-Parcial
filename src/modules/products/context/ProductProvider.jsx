import { createContext, useState, useEffect } from 'react';
import { getProducts } from '../services/list'; // Asegúrate de que la ruta sea correcta

const ProductContext = createContext();

// Definimos los estados constantes aquí o en un archivo de constantes aparte
const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ProductProvider({ children }) {
  // 1. MOVER ESTADOS AQUÍ
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. MOVER LA LÓGICA DE FETCH AQUÍ
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Nota: Pasamos los estados actuales a la función de servicio
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      setTotal(data.total);
      setProducts(data.productItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. MOVER LOS EFECTOS AQUÍ
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pageSize, pageNumber]); 
  // Nota: searchTerm no está en la dependencia para evitar busquedas mientras escribes, 
  // se dispara con el botón buscar (handleSearch) o puedes usar debounce.

  useEffect(() => {
    setPageNumber(1);
  }, [status]);

  // Cálculo de total de páginas
  const totalPages = Math.ceil(total / pageSize);

  // Función para buscar manualmente (cuando se hace click en la lupa)
  const handleSearch = async () => {
    setPageNumber(1);
    await fetchProducts();
  };

  // 4. EXPORTAR TODO LO NECESARIO
  return (
    <ProductContext.Provider
      value={{
        // Estados
        products,
        loading,
        pageNumber,
        pageSize,
        total,
        totalPages,
        searchTerm,
        status,
        productStatus, // Exportamos esto para usarlo en el select
        
        // Funciones para modificar el estado
        setPageNumber,
        setPageSize,
        setSearchTerm,
        setStatus,
        handleSearch,
        fetchProducts // Por si necesitamos recargar manualmente desde fuera
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };