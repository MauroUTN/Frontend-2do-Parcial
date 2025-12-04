import { createContext, useState, useEffect } from 'react';
import { getProducts } from '../services/list';

const ProductContext = createContext();

const productStatus = {
  ALL: 'todos',
  ENABLED: 'true',
  DISABLED: 'false',
};

function ProductProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ENABLED); 
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 1. ESTADO PARA CONTROLAR BÚSQUEDA POR SKU
  const [searchSku, setSearchSku] = useState(false); 

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // 2. ENVIAMOS searchSku AL SERVICIO
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize, searchSku);

      if (error) throw error;

      setTotal(data?.total || 0);
      setProducts(data?.productItems || []);
    } catch (error) {
      console.error(error);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // 3. RECARGAR SI CAMBIA searchSku
  }, [status, pageSize, pageNumber, searchSku]); 

  // Reset de página al buscar o cambiar filtro
  useEffect(() => {
    setPageNumber(1);
  }, [status, searchTerm]); 

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = async () => {
    setPageNumber(1);
    await fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        pageNumber,
        pageSize,
        total,
        totalPages,
        searchTerm,
        status,
        productStatus,
        
        setPageNumber,
        setPageSize,
        setSearchTerm,
        setStatus,
        handleSearch,
        fetchProducts,

        // 4. EXPORTAMOS EL CONTROL DE SKU
        searchSku,      
        setSearchSku   
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };