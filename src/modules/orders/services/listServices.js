// Cambiamos el nombre del primer parámetro a 'searchTerm'
export const listOrders = async (searchTerm = "", status = "all", pageNumber = 1, pageSize = 20) => {
  try {
    const params = new URLSearchParams();

    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);

    // CAMBIO AQUÍ: Enviamos 'searchTerm' en lugar de 'orderID'
    if (searchTerm) params.append("searchTerm", searchTerm);
    
    if (status !== "all") params.append("status", status);

    const response = await fetch(`/api/orders/paged?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) return { data: null, error: await response.json() };

    const data = await response.json();
    return { data, error: null };

  } catch (err) {
    console.error("Error en listOrders:", err);
    return { data: null, error: err };
  }
};