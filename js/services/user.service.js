/**
 * User profile service.
 * Replace with real fetch calls when backend is ready.
 */

import { MOCK_USERS } from '../../mock/mock-data.js';
import { getCurrentUser, refreshSessionUser } from './auth.service.js';

const SIMULATED_DELAY_MS = 500;

export const API_BASE_URL = window.APP_CONFIG?.API_URL || 'http://localhost:8000/api/';
export const USERS_ENDPOINT = `${API_BASE_URL}user/`;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns the profile of the currently authenticated user.
 * @returns {Promise<{id: number, name: string, email: string, username: string, phone: string}>}
 */
export async function getProfile() {
  // await delay(SIMULATED_DELAY_MS);
  const user = getCurrentUser();
  console.log('Current user from getProfile:', user);
  if (!user) throw new Error('Usuário não autenticado.');
  return { ...user };
}

/**
 * Updates the profile of the currently authenticated user.
 * @param {{name: string, email: string, username: string, phone_number: string, role: string}} data
 * @returns {Promise<object>} Updated user profile
 */
export async function updateProfile(data) {
  // await delay(SIMULATED_DELAY_MS);

  const user = getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado.');

  // const mockUser = MOCK_USERS.find(u => u.id === user.id);
    const response = await fetch(`${USERS_ENDPOINT}${user.id}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao atualizar perfil.');
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
