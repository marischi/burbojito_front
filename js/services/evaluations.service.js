/**
 * Evaluations service.
 * Replace with real fetch calls when backend is ready.
 */

import { MOCK_EVALUATIONS } from '../../mock/mock-data.js';

const SIMULATED_DELAY_MS = 400;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns the list of evaluations performed (for the dashboard chart and table).
 * @returns {Promise<Array<{data: string, numero: number}>>}
 */
export async function getEvaluations() {
  await delay(SIMULATED_DELAY_MS);
  return [...MOCK_EVALUATIONS];
}
