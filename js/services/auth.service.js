/**
 * Authentication service.
 */

import { apiPost } from './api.client.js';
import { normalizeUser } from './api.adapters.js';

const SESSION_KEY = 'burbojito_user';

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{id: number, nome: string, sobrenome: string, email: string, username: string, telefone: string, role: string}>}
 */
export async function login(email, password) {
  const response = await apiPost('/api/login/', {
    email: email.trim().toLowerCase(),
    password,
  });

  const user = normalizeUser(response?.user ?? response);
  if (!user.id && !user.email) {
    throw new Error('E-mail ou senha incorretos. Tente novamente.');
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

/**
 * Clears the current session.
 */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Returns the currently authenticated user or null.
 * @returns {{ id: number, nome: string, sobrenome: string, email: string, username: string, telefone: string, role: string } | null}
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
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
}
