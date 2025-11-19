// src/pages/products/services/list.js

// 1. DATOS SIMULADOS (40 PRODUCTOS)
// -----------------------------------------------------------------------------------
const ALL_PRODUCTS_DATA = [
  // Tecnología y Electrónica (1-10)
  { sku: 'TCH001', name: 'Auriculares Inalámbricos Pro', stockQuantity: 95, currentUnitPrice: 79.99, isActive: true },
  { sku: 'TCH002', name: 'Cargador Rápido USB-C 65W', stockQuantity: 300, currentUnitPrice: 25.50, isActive: true },
  { sku: 'TCH003', name: 'Smartwatch Deportivo Ultra', stockQuantity: 40, currentUnitPrice: 199.00, isActive: true },
  { sku: 'TCH004', name: 'Router WiFi Mesh Doble Banda', stockQuantity: 15, currentUnitPrice: 120.00, isActive: false },
  { sku: 'TCH005', name: 'Disco Duro Externo 2TB', stockQuantity: 110, currentUnitPrice: 65.99, isActive: true },
  { sku: 'TCH006', name: 'Altavoz Bluetooth Portátil Mini', stockQuantity: 220, currentUnitPrice: 35.00, isActive: true },
  { sku: 'TCH007', name: 'Drone Plegable con Cámara 4K', stockQuantity: 8, currentUnitPrice: 450.00, isActive: false },
  { sku: 'TCH008', name: 'Tablet 10 Pulgadas Económica', stockQuantity: 75, currentUnitPrice: 145.50, isActive: true },
  { sku: 'TCH009', name: 'Kit de Limpieza para Pantallas', stockQuantity: 500, currentUnitPrice: 9.99, isActive: true },
  { sku: 'TCH010', name: 'Batería Externa Power Bank 10000mAh', stockQuantity: 180, currentUnitPrice: 19.90, isActive: true },

  // Hogar y Cocina (11-20)
  { sku: 'HOG011', name: 'Cafetera de Goteo Programable', stockQuantity: 25, currentUnitPrice: 59.95, isActive: true },
  { sku: 'HOG012', name: 'Set de Sartenes Antiadherentes (3 und)', stockQuantity: 60, currentUnitPrice: 89.00, isActive: true },
  { sku: 'HOG013', name: 'Aspiradora Robot Inteligente', stockQuantity: 10, currentUnitPrice: 320.00, isActive: false },
  { sku: 'HOG014', name: 'Lámpara de Escritorio LED Táctil', stockQuantity: 85, currentUnitPrice: 29.99, isActive: true },
  { sku: 'HOG015', name: 'Manta de Felpa Extra Suave Gris', stockQuantity: 140, currentUnitPrice: 45.00, isActive: true },
  { sku: 'HOG016', name: 'Purificador de Aire con Filtro HEPA', stockQuantity: 18, currentUnitPrice: 99.99, isActive: true },
  { sku: 'HOG017', name: 'Tostadora de Pan de 4 Rebanadas', stockQuantity: 50, currentUnitPrice: 39.00, isActive: true },
  { sku: 'HOG018', name: 'Vajilla Completa de Cerámica (12 pzs)', stockQuantity: 35, currentUnitPrice: 75.50, isActive: false },
  { sku: 'HOG019', name: 'Juego de Cuchillos de Chef Profesional', stockQuantity: 45, currentUnitPrice: 115.00, isActive: true },
  { sku: 'HOG020', name: 'Difusor de Aromas Ultrasónico', stockQuantity: 170, currentUnitPrice: 22.90, isActive: true },

  // Deportes y Fitness (21-30)
  { sku: 'DEP021', name: 'Esterilla de Yoga Antideslizante', stockQuantity: 150, currentUnitPrice: 18.00, isActive: true },
  { sku: 'DEP022', name: 'Pesas Rusas (Kettlebell) 10kg', stockQuantity: 30, currentUnitPrice: 49.99, isActive: true },
  { sku: 'DEP023', name: 'Botella de Agua de Acero Inoxidable', stockQuantity: 280, currentUnitPrice: 14.50, isActive: true },
  { sku: 'DEP024', name: 'Bandas de Resistencia (Set de 5)', stockQuantity: 90, currentUnitPrice: 12.99, isActive: true },
  { sku: 'DEP025', name: 'Zapatillas de Running Unisex Talla 42', stockQuantity: 20, currentUnitPrice: 89.00, isActive: false },
  { sku: 'DEP026', name: 'Cuerda para Saltar Ajustable', stockQuantity: 350, currentUnitPrice: 7.50, isActive: true },
  { sku: 'DEP027', name: 'Guantes de Ciclismo Acolchados', stockQuantity: 65, currentUnitPrice: 20.00, isActive: true },
  { sku: 'DEP028', name: 'Rodillo de Espuma para Masaje', stockQuantity: 48, currentUnitPrice: 29.90, isActive: true },
  { sku: 'DEP029', name: 'Monitor de Ritmo Cardíaco (Muñeca)', stockQuantity: 12, currentUnitPrice: 65.00, isActive: false },
  { sku: 'DEP030', name: 'Mochila de Senderismo 30L', stockQuantity: 55, currentUnitPrice: 55.50, isActive: true },

  // Juguetes y Varios (31-40)
  { sku: 'JUG031', name: 'Set de Bloques de Construcción Grande', stockQuantity: 70, currentUnitPrice: 39.99, isActive: true },
  { sku: 'JUG032', name: 'Coche a Control Remoto Todo Terreno', stockQuantity: 40, currentUnitPrice: 45.00, isActive: true },
  { sku: 'JUG033', name: 'Juego de Mesa Estratégico "Colonos"', stockQuantity: 22, currentUnitPrice: 50.00, isActive: true },
  { sku: 'VAR035', name: 'Kit de Herramientas Básicas (50 pzs)', stockQuantity: 30, currentUnitPrice: 69.00, isActive: true },
  { sku: 'VAR036', name: 'Libro: Cien Años de Soledad', stockQuantity: 100, currentUnitPrice: 12.50, isActive: true },
  { sku: 'VAR037', name: 'Pinturas Acrílicas (Set de 12 colores)', stockQuantity: 130, currentUnitPrice: 24.99, isActive: true },
  { sku: 'VAR038', name: 'Billetera de Cuero Clásica Negra', stockQuantity: 190, currentUnitPrice: 30.00, isActive: true },
  { sku: 'VAR039', name: 'Paraguas Plegable Reforzado', stockQuantity: 250, currentUnitPrice: 17.50, isActive: true },
  { sku: 'VAR040', name: 'Gafas de Sol Polarizadas Aviador', stockQuantity: 52, currentUnitPrice: 33.00, isActive: true },
];


/**
 * FUNCIÓN SIMULADA DEL BACKEND: getProducts
 * Simula la paginación y el filtrado que haría un servidor.
 * * @param {string} searchTerm 
 * @param {'all' | 'enabled' | 'disabled'} status 
 * @param {number} pageNumber 
 * @param {number} pageSize 
 * @returns {Promise<{data: {total: number, productItems: Array}, error: null}>}
 */
export const getProducts = async (searchTerm, status, pageNumber, pageSize) => {
  // Simula un retraso de red de 500ms
  await new Promise(resolve => setTimeout(resolve, 500)); 

  let filteredList = ALL_PRODUCTS_DATA;

  // 1. Filtrar por estado (status)
  filteredList = filteredList.filter(product => {
    if (status === 'all') return true;
    if (status === 'enabled') return product.isActive;
    if (status === 'disabled') return !product.isActive;
    return true;
  });

  // 2. Filtrar por término de búsqueda (searchTerm - simple por nombre o SKU)
  if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      filteredList = filteredList.filter(product =>
          product.name.toLowerCase().includes(termLower) ||
          product.sku.toLowerCase().includes(termLower)
      );
  }

  // 3. Simular paginación
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedItems = filteredList.slice(startIndex, endIndex);

  // 4. Devolver la respuesta
  const simulatedResponse = {
    total: filteredList.length, // Total después de aplicar todos los filtros
    productItems: paginatedItems,
  };

  return {
    data: simulatedResponse,
    error: null,
  };
};