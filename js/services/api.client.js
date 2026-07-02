/**
 * Shared HTTP client for backend API calls.
 */

import { API_BASE_URL } from '../config/api.config.js';

function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function buildUrl(path, query) {
  const url = new URL(path, API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseResponseBody(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorMessage(body, status) {
  if (!body) return `Erro na requisição (${status}).`;

  if (typeof body === 'string') return body;

  if (typeof body.detail === 'string') return body.detail;
  if (Array.isArray(body.detail)) return body.detail.join(' ');
  if (typeof body.message === 'string') return body.message;
  if (typeof body.error === 'string') return body.error;

  const firstFieldError = Object.values(body).find(
    value => Array.isArray(value) && value.length > 0,
  );
  if (Array.isArray(firstFieldError)) return String(firstFieldError[0]);

  return `Erro na requisição (${status}).`;
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: unknown, query?: Record<string, unknown>, headers?: Record<string, string> }} [options]
 */
export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, query, headers = {} } = options;
  const requestHeaders = { Accept: 'application/json', ...headers };

  const init = {
    method,
    credentials: 'include',
    headers: requestHeaders,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  if (method !== 'GET' && method !== 'HEAD') {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      requestHeaders['X-CSRFToken'] = csrfToken;
    }
  }

  const response = await fetch(buildUrl(path, query), init);
  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(responseBody, response.status));
  }

  return responseBody;
}

export function apiGet(path, query) {
  return apiRequest(path, { method: 'GET', query });
}

export function apiPost(path, body) {
  return apiRequest(path, { method: 'POST', body });
}

export function apiPut(path, body) {
  return apiRequest(path, { method: 'PUT', body });
}

export function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' });
}
