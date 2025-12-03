export const listOrders = async (orderID = "", status = "all", pageNumber = 1, pageSize = 20) => {
  try {
    const params = new URLSearchParams();

    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);

    if (orderID) params.append("orderID", orderID);
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
