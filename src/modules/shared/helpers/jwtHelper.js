export const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // Decodificar la parte del payload del JWT (la segunda parte)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    // 'sub' es el standard claim para el ID del usuario en Identity
    return decoded.sub; 
  } catch (error) {
    console.error("Error decodificando token", error);
    return null;
  }
};