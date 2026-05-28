/**
 * Patients service.
 * Replace with real fetch calls when backend is ready.
 */

import {
  MOCK_PATIENTS,
  MOCK_HIGH_RISK_PATIENTS,
  MOCK_REPORT_IMAGE_PATH,
} from '../../mock/mock-data.js';

const SIMULATED_DELAY_MS = 500;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns the list of patients assigned to the current user.
 * @returns {Promise<Array<{id: number, nome: string, idade: number, campoVisual: number}>>}
 */
export async function getPatients() {
  await delay(SIMULATED_DELAY_MS);
  return [...MOCK_PATIENTS];
}

/**
 * Returns the list of high-risk patients for the dashboard.
 * @returns {Promise<Array<{id: number, nome: string, idade: number, campoVisual: number}>>}
 */
export async function getHighRiskPatients() {
  await delay(SIMULATED_DELAY_MS);
  return [...MOCK_HIGH_RISK_PATIENTS];
}

/**
 * Returns the report image URL for a given patient.
 * Currently always returns the example report image.
 * @param {number} patientId
 * @returns {Promise<string>} Image URL
 */
export async function getPatientReport(patientId) {
  await delay(SIMULATED_DELAY_MS);
  // Backend integration: replace with fetch(`/api/patients/${patientId}/report`)
  return MOCK_REPORT_IMAGE_PATH;
}
