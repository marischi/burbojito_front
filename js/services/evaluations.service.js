/**
 * Evaluations service.
 */

import { apiGet } from './api.client.js';
import {
  normalizeEvaluations,
  extractEvaluationsFromDashboard,
} from './api.adapters.js';

/**
 * Returns the list of evaluations performed (for the dashboard chart and table).
 * @returns {Promise<Array<{data: string, numero: number}>>}
 */
export async function getEvaluations() {
  const response = await apiGet('/api/evaluations/');
  const evaluations = normalizeEvaluations(response);

  if (evaluations.length) return evaluations;

  const dashboard = await apiGet('/api/dashboard/');
  return extractEvaluationsFromDashboard(dashboard);
}
