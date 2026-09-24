import { fetchAuthSession } from "aws-amplify/auth";
import { config } from "./config";

export async function apiFetch(path, options = {}) {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  return fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// GET: Obtener catálogo
export async function obtenerCatalogo() {
  const res = await apiFetch("/api/videojuegos");
  if (!res.ok) throw new Error(`Error ${res.status} al consultar inventario`);
  return res.json();
}

// POST: Agregar nuevo videojuego
export async function crearVideojuego(juego) {
  const res = await apiFetch("/api/videojuegos", {
    method: "POST",
    body: JSON.stringify(juego),
  });
  if (!res.ok) throw new Error(`Error ${res.status} al guardar el juego`);
  return res.json();
}