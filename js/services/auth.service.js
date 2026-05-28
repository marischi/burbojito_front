/**
 * Authentication service.
 * All methods simulate network latency and will be replaced by real fetch calls.
 */

import { MOCK_USERS } from '../../mock/mock-data.js';

const SESSION_KEY = 'burbojito_user';
const SIMULATED_DELAY_MS = 600;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{id: number, nome: string, sobrenome: string, email: string, username: string, telefone: string, role: string}>}
 */
export async function login(email, password) {
  await delay(SIMULATED_DELAY_MS);

  const user = MOCK_USERS.find(
    u => u.email === email.trim().toLowerCase() && u.password === password,
  );

  if (!user) {
    throw new Error('E-mail ou senha incorretos. Tente novamente.');
  }

  const { password: _pwd, ...safeUser } = user;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return safeUser;
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
  const { password: _pwd, ...safeUser } = updatedUser;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
}
