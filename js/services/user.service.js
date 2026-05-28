/**
 * User profile service.
 * Replace with real fetch calls when backend is ready.
 */

import { MOCK_USERS } from '../../mock/mock-data.js';
import { getCurrentUser, refreshSessionUser } from './auth.service.js';

const SIMULATED_DELAY_MS = 500;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns the profile of the currently authenticated user.
 * @returns {Promise<{id: number, nome: string, sobrenome: string, email: string, username: string, telefone: string}>}
 */
export async function getProfile() {
  await delay(SIMULATED_DELAY_MS);
  const user = getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado.');
  return { ...user };
}

/**
 * Updates the profile of the currently authenticated user.
 * @param {{nome: string, sobrenome: string, email: string, username: string, telefone: string}} data
 * @returns {Promise<object>} Updated user profile
 */
export async function updateProfile(data) {
  await delay(SIMULATED_DELAY_MS);

  const user = getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado.');

  const mockUser = MOCK_USERS.find(u => u.id === user.id);
  if (mockUser) {
    Object.assign(mockUser, {
      nome:      data.nome,
      sobrenome: data.sobrenome,
      email:     data.email,
      username:  data.username,
      telefone:  data.telefone,
    });
  }

  const updatedUser = { ...user, ...data };
  refreshSessionUser(updatedUser);
  return { ...updatedUser };
}

/**
 * Changes the user's password.
 * Validates current password before accepting the new one.
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function changePassword(currentPassword, newPassword) {
  await delay(SIMULATED_DELAY_MS);

  const user = getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado.');

  const mockUser = MOCK_USERS.find(u => u.id === user.id);
  if (!mockUser || mockUser.password !== currentPassword) {
    throw new Error('Senha atual incorreta.');
  }

  mockUser.password = newPassword;
}
