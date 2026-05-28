/**
 * Notifications service.
 * Replace with real fetch calls when backend is ready.
 */

import { MOCK_NOTIFICATIONS } from '../../mock/mock-data.js';

const SIMULATED_DELAY_MS = 450;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns notifications grouped by date for the current user.
 * @returns {Promise<Array<{grupo: string, itens: Array<{id: number, enfermeiro: string, paciente: string, vfi: number, tempoLabel: string}>}>>}
 */
export async function getNotifications() {
  await delay(SIMULATED_DELAY_MS);
  return MOCK_NOTIFICATIONS.map(group => ({
    ...group,
    itens: [...group.itens],
  }));
}
