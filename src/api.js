import { fetchAuthSession } from 'aws-amplify/auth';
import { API_URL } from './config';

// Hace la peticion al backend agregando el token de Cognito del usuario logueado
async function apiFetch(path, options = {}) {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('401: sesion invalida o vencida, vuelve a iniciar sesion');
    if (res.status === 403) throw new Error('403: tu usuario no tiene permiso para esta accion');
    throw new Error(`Error ${res.status} del backend`);
  }
  return res.status === 204 ? null : res.json();
}

export const obtenerCatalogo = () => apiFetch('/api/videojuegos');

export const crearVideojuego = (juego) =>
  apiFetch('/api/videojuegos', { method: 'POST', body: JSON.stringify(juego) });

export const actualizarVideojuego = (id, juego) =>
  apiFetch(`/api/videojuegos/${id}`, { method: 'PUT', body: JSON.stringify(juego) });

export const eliminarVideojuego = (id) =>
  apiFetch(`/api/videojuegos/${id}`, { method: 'DELETE' });