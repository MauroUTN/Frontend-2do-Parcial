// Datos falsos que simulan lo que te devolvería la API según el PDF (Pág 19)
const FAKE_ORDERS = [
  { id: 1, clientName: 'Juan Pérez', status: 'Pending', total: 1500 },
  { id: 2, clientName: 'María Gomez', status: 'Processing', total: 3200 },
  { id: 3, clientName: 'Carlos Ruiz', status: 'Shipped', total: 850 },
  { id: 4, clientName: 'Ana Lopez', status: 'Delivered', total: 12000 },
  { id: 5, clientName: 'Pedro Pascal', status: 'Cancelled', total: 0 },
];

export const getOrders = async (searchTerm = '', status = '', page = 1) => {
  // Simulamos una espera de 500ms para que parezca real (loading...)
  await new Promise(resolve => setTimeout(resolve, 500));

  // Aquí filtramos "de mentira" usando JS en lugar del Backend
  let filteredOrders = FAKE_ORDERS;

  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(o => o.status === status);
  }

  if (searchTerm) {
    filteredOrders = filteredOrders.filter(o => 
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Retornamos con la estructura que espera tu componente
  return {
    data: filteredOrders,
    error: null
  };
};