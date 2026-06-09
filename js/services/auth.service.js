const API_BASE_URL = window.APP_CONFIG?.API_URL || 'http://localhost:8000/api/';
// 1. Mude para o endpoint correto de login do Django
const LOGIN_ENDPOINT = 'login/'; 

const SESSION_KEY = 'burbojito_user';

export async function login(email, password) {
  // Envia a requisição para /api/login/
  const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  console.log('Login response data:', data);
  
  if (!response.ok) {
    throw new Error(data.detail || 'Erro ao realizar login.');
  }

  const safeUser = data.user;

  
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  
  // Se quiser salvar o token para as próximas requisições:
  // localStorage.setItem('token', data.token);

  return safeUser;
}

/**
 * Clears the current session.
 */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  // localStorage.removeItem('token');
}

/**
 * Returns the currently authenticated user or null.
 * @returns {{ id: string, name: string, email: string, username: string, phone: string, role: string } | null}
 */
export function getCurrentUser() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Persists the updated user in the current session (used after profile update).
 * @param {object} updatedUser
 */
export function refreshSessionUser(updatedUser) {
  const { password: _pwd, ...safeUser } = updatedUser;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
}