/**
 * Patients service.
 */

import { apiGet } from './api.client.js';
import {
  normalizePatients,
  normalizeReportUrl,
  extractHighRiskPatientsFromDashboard,
} from './api.adapters.js';

/**
 * Returns the list of patients assigned to the current user.
 * @returns {Promise<Array<{id: number, nome: string, idade: number, campoVisual: number}>>}
 */
export async function getPatients() {
  const response = await apiGet('/api/patients/');
  return normalizePatients(response);
}

/**
 * Returns the list of high-risk patients for the dashboard.
 * @returns {Promise<Array<{id: number, nome: string, idade: number, campoVisual: number}>>}
 */
export async function getHighRiskPatients() {
  const dashboard = await apiGet('/api/dashboard/');
  const fromDashboard = extractHighRiskPatientsFromDashboard(dashboard);

  if (fromDashboard.length) return fromDashboard;

  const patients = await getPatients();
  return patients.filter(patient => patient.campoVisual > 0 && patient.campoVisual < 70);
}

/**
 * Returns the report image URL for a given patient.
 * @param {number|string} patientId
 * @returns {Promise<string>} Image URL
 */
export async function getPatientReport(patientId) {
  const response = await apiGet(`/api/patients/${patientId}/report/`);
  return normalizeReportUrl(response);
}
