/**
 * NagrikSetu - API Endpoint Resolver
 *
 * Provides centralized resolution for backend API routes.
 * Supports:
 * - Production deployments where frontend is hosted on static CDN (e.g. Vercel)
 *   and backend is on a Node.js host (e.g. Render/Railway) via VITE_API_URL.
 * - Local development where Vite proxies relative `/api` paths to Express.
 * - Node.js testing/script environments where `window` is undefined.
 */

export function getApiEndpoint(endpointPath) {
  const cleanPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;

  // Headless Node.js test environment (e.g., node tests/runAllTests.mjs)
  if (typeof window === 'undefined') {
    const port = (typeof process !== 'undefined' && process.env?.PORT) || 5001;
    return `http://localhost:${port}${cleanPath}`;
  }

  // Browser environment - Check for configured external backend URL in production
  const configuredBase = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '';
  if (configuredBase) {
    return `${configuredBase.replace(/\/+$/, '')}${cleanPath}`;
  }

  // Relative path (Vite dev proxy or same-domain deployment)
  return cleanPath;
}
