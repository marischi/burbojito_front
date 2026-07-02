/**
 * API configuration.
 *
 * Override at runtime before app scripts load:
 *   window.BURBOJITO_API_BASE_URL = 'http://127.0.0.1:8000';
 */
export const API_BASE_URL = (
  typeof window !== 'undefined' && window.BURBOJITO_API_BASE_URL
) || 'http://127.0.0.1:8000';
