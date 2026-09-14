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

// Client-side in-memory SWR (Stale-While-Revalidate) Cache Map
const CLIENT_API_CACHE = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Universal safe API fetcher with automatic fallback and client-side SWR caching.
 */
export async function apiFetch(endpoint, options = {}) {
  const primaryUrl = getApiUrl(endpoint);
  const method = (options.method || 'GET').toUpperCase();
  const bypassCache = options.cache === 'no-store' || options.bypassCache;

  // Use client cache for GET requests
  if (method === 'GET' && !bypassCache) {
    const cachedEntry = CLIENT_API_CACHE.get(primaryUrl);
    const now = Date.now();

    if (cachedEntry && (now - cachedEntry.timestamp < CACHE_TTL_MS)) {
      // Revalidate in background asynchronously if older than 30s
      if (now - cachedEntry.timestamp > 30 * 1000) {
        fetch(primaryUrl, options)
          .then(async (res) => {
            if (res.ok) {
              const bodyText = await res.clone().text();
              CLIENT_API_CACHE.set(primaryUrl, {
                timestamp: Date.now(),
                status: res.status,
                headers: Array.from(res.headers.entries()),
                bodyText
              });
            }
          })
          .catch(() => {});
      }

      // Instant response clone from cache (<1ms)
      return new Response(cachedEntry.bodyText, {
        status: cachedEntry.status,
        headers: new Headers(cachedEntry.headers)
      });
    }
  }

  let res;
  try {
    res = await fetch(primaryUrl, options);
  } catch (err) {
    // Fallback for local development
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      if (!primaryUrl.startsWith('http://') && !primaryUrl.startsWith('https://')) {
        const fallbackUrl = `http://127.0.0.1:8000${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        console.warn(`[apiFetch] Primary fetch to ${primaryUrl} failed. Trying fallback to ${fallbackUrl}...`);
        res = await fetch(fallbackUrl, options);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }

  // Store successful GET responses in client cache
  if (method === 'GET' && res.ok && !bypassCache) {
    try {
      const cloned = res.clone();
      const bodyText = await cloned.text();
      CLIENT_API_CACHE.set(primaryUrl, {
        timestamp: Date.now(),
        status: res.status,
        headers: Array.from(res.headers.entries()),
        bodyText
      });
    } catch (e) {
      // Ignore clone errors
    }
  }

  return res;
}

