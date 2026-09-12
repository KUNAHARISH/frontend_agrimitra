// Central API Configuration for AgriSathi / AgriMitra
// Automatically resolves between Local Development, Vercel, Render, and Mobile APK (Capacitor)

export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://agrimitra-backend.onrender.com'
    : '')
).replace(/\/$/, '');

export function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!BACKEND_URL) {
    return cleanEndpoint;
  }
  return `${BACKEND_URL}${cleanEndpoint}`;
}

/**
 * Universal safe API fetcher with automatic fallback to local backend if relative path fails.
 */
export async function apiFetch(endpoint, options = {}) {
  const primaryUrl = getApiUrl(endpoint);
  
  try {
    const res = await fetch(primaryUrl, options);
    return res;
  } catch (err) {
    // If primary relative request failed and we are on localhost, fallback to direct http://localhost:8000
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      if (!primaryUrl.startsWith('http://') && !primaryUrl.startsWith('https://')) {
        const fallbackUrl = `http://127.0.0.1:8000${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        console.warn(`[apiFetch] Primary fetch to ${primaryUrl} failed. Trying fallback to ${fallbackUrl}...`);
        return await fetch(fallbackUrl, options);
      }
    }
    throw err;
  }
}
