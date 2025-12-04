export const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    // 'sub' es donde Identity guarda el ID del usuario
    return decoded.sub; 
  } catch (error) {
    console.error("Error decodificando token", error);
    return null;
  }
};
export const getUserRoleFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    
    // .NET suele guardar el rol en esta propiedad larga:
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role || null;
  } catch (error) {
    console.error("Error obteniendo rol", error);
    return null;
  }
};