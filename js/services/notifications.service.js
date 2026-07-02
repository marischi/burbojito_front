/**
 * Notifications service.
 */

import { apiGet } from './api.client.js';
import { getCurrentUser } from './auth.service.js';
import {
  normalizeNotifications,
  extractNotificationsFromDashboard,
} from './api.adapters.js';

/**
 * Returns notifications grouped by date for the current user.
 * @returns {Promise<Array<{grupo: string, itens: Array<{id: number, enfermeiro: string, paciente: string, vfi: number, tempoLabel: string}>}>>}
 */
export async function getNotifications() {
  const dashboard = await apiGet('/api/dashboard/');
  const fromDashboard = extractNotificationsFromDashboard(dashboard);
  if (fromDashboard.length) return fromDashboard;

  const user = getCurrentUser();
  if (user?.id) {
    const byUser = await apiGet(`/api/evaluations/by-user/${user.id}/`);
    const notifications = normalizeNotifications(byUser);
    if (notifications.length) return notifications;
  }

  const evaluations = await apiGet('/api/evaluations/');
  return normalizeNotifications(evaluations);
}
