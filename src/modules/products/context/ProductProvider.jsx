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
  
 
  const [searchSku, setSearchSku] = useState(false); 

  const fetchProducts = async () => {
    try {
      setLoading(true);
     
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
    
  }, [status, pageSize, pageNumber, searchSku]); 

  
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
        searchSku,      
        setSearchSku   
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };