/**
 * NagrikSetu - Centralized API Endpoint Resolver & Client
 *
 * Provides centralized resolution for backend API routes.
 * Supports:
 * - Production deployments targeting Render via VITE_API_BASE_URL or VITE_API_URL.
 * - Automatic prevention of duplicated `/api` prefixes.
 * - Local development via Vite dev server proxy to Express.
 * - Node.js testing/script environments where `window` is undefined.
 * - Unified apiFetch with timeout, network error detection, and sanitized error mapping.
 */

export function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    const port = (typeof process !== 'undefined' && (process.env?.PORT || process.env?.BACKEND_PORT)) || 5001;
    return `http://localhost:${port}`;
  }

  const configured =
    (typeof import.meta !== 'undefined' &&
      (import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL)) ||
    '';

  if (configured && typeof configured === 'string') {
    return configured.trim().replace(/\/+$/, '');
  }

  // In local development or same-origin deployment, base is empty (relative paths)
  return '';
}

export function getApiEndpoint(endpointPath) {
  let cleanPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return cleanPath;
  }

  // Prevent duplicated /api prefixes (e.g. baseUrl='https://backend.onrender.com/api' + path='/api/analyze-complaint')
  if (baseUrl.endsWith('/api') && cleanPath.startsWith('/api/')) {
    return `${baseUrl}${cleanPath.slice(4)}`;
  }

  return `${baseUrl}${cleanPath}`;
}

/**
 * Standardized, safe fetch wrapper for NagrikSetu API calls.
 * Ensures clean error classification (400, 401, 403, 404, 429, 500, 502, 503, timeout, CORS/network).
 * Never exposes API keys or internal stack traces.
 */
export async function apiFetch(endpointPath, options = {}) {
  const url = getApiEndpoint(endpointPath);
  const timeoutMs = options.timeout || 12000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    signal: options.signal || controller.signal,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    // Detect when a static CDN like Vercel rewrote an unconfigured API request to index.html
    if (!isJson && contentType.includes('text/html')) {
      const error = new Error('API server unreachable or returned HTML document.');
      error.status = 404;
      error.isHtmlResponse = true;
      error.userMessage = 'AI service endpoint is unreachable. Please verify backend connection.';
      throw error;
    }

    let data = null;
    if (isJson) {
      data = await response.json();
    }

    if (!response.ok) {
      const error = new Error(data?.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;

      switch (response.status) {
        case 400:
          error.userMessage = data?.message || 'Invalid request. Please check the provided information.';
          break;
        case 401:
        case 403:
          error.userMessage = 'Access restricted or configuration error. Please try again.';
          break;
        case 404:
          error.userMessage = 'The requested AI service endpoint was not found.';
          break;
        case 429:
          error.userMessage = 'AI Assistant is currently busy. Please wait a moment and try again.';
          break;
        case 500:
        case 502:
        case 503:
          error.userMessage = 'AI Assistant is temporarily unavailable. Please try again shortly.';
          break;
        default:
          error.userMessage = 'An unexpected error occurred while communicating with the AI service.';
      }
      throw error;
    }

    return { ok: true, status: response.status, data };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Request timed out');
      timeoutErr.status = 504;
      timeoutErr.userMessage = 'Request timed out. Please try again.';
      throw timeoutErr;
    }

    // Preserve already processed error
    if (err.userMessage) {
      throw err;
    }

    // Network error / CORS failure / Server down
    const networkErr = new Error(err.message || 'Network request failed');
    networkErr.status = 0;
    networkErr.isNetworkError = true;
    networkErr.userMessage = 'Unable to connect to AI server. Please check your network connection.';
    throw networkErr;
  }
}

