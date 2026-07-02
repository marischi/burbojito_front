/**
 * User profile service.
 */

import { apiGet, apiPut } from './api.client.js';
import { getCurrentUser, refreshSessionUser } from './auth.service.js';
import { normalizeUser } from './api.adapters.js';

/**
 * Returns the profile of the currently authenticated user.
 * @returns {Promise<{id: number, nome: string, sobrenome: string, email: string, username: string, telefone: string}>}
 */
export async function getProfile() {
  const user = getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado.');

  if (user.id) {
    const response = await apiGet('/api/user/');
    const users = Array.isArray(response)
      ? response
      : (response?.results ?? response?.data ?? []);

    const match = users
      .map(normalizeUser)
      .find(item => String(item.id) === String(user.id));

    if (match) {
      refreshSessionUser(match);
      return match;
    }
  }

  return { ...user };
}

/**
 * Updates the profile of the currently authenticated user.
 * @param {{nome: string, sobrenome: string, email: string, username: string, telefone: string}} data
 * @returns {Promise<object>} Updated user profile
 */
export async function updateProfile(data) {
  const user = getCurrentUser();
  if (!user?.id) throw new Error('Usuário não autenticado.');

  const response = await apiPut(`/api/user/${user.id}/update/`, {
    nome: data.nome,
    sobrenome: data.sobrenome,
    email: data.email,
    username: data.username,
    telefone: data.telefone,
  });

  const updatedUser = normalizeUser(response?.user ?? response ?? { ...user, ...data });
  refreshSessionUser(updatedUser);
  return updatedUser;
}

/**
 * Changes the user's password.
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function changePassword(currentPassword, newPassword) {
  const user = getCurrentUser();
  if (!user?.id) throw new Error('Usuário não autenticado.');

  await apiPut(`/api/user/${user.id}/update/`, {
    current_password: currentPassword,
    new_password: newPassword,
    password: newPassword,
    senha_atual: currentPassword,
    senha_nova: newPassword,
  });
}
