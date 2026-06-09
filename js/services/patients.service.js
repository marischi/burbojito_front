/**
 * Patients service.
 * Consumes the backend API when it is available.
 */

import { MOCK_REPORT_IMAGE_PATH } from '../../mock/mock-data.js';

export const API_BASE_URL = window.APP_CONFIG?.API_URL || 'http://localhost:8000/api/';
export const PATIENTS_ENDPOINT = `${API_BASE_URL}patients/`;

/**
 * Returns the list of patients assigned to the current user.
 * @returns {Promise<Array<{id: number, nome: string, idade: number, campoVisual: number}>>}
 */
export async function getPatients() {
  const patients = await requestJsonList(PATIENTS_ENDPOINT);
  return patients.map(normalizePatient).filter(Boolean);
}

/**
 * Returns the list of high-risk patients for the dashboard.
 * @returns {Promise<Array<{id: number, nome: string, idade: number, campoVisual: number}>>}
 */
export async function getHighRiskPatients() {
  const patients = await requestJsonList(PATIENTS_ENDPOINT);
  return patients
    .map(normalizePatient)
    .filter(patient => patient && isHighRiskPatient(patient));
}

/**
 * Returns the report image URL for a given patient.
 * @param {number} patientId
 * @returns {Promise<string>} Image URL
 */
export async function getPatientReport(patientId) {
  const patient = await requestJson(`${PATIENTS_ENDPOINT}${patientId}/report`).catch(() => requestJson(`${PATIENTS_ENDPOINT}${patientId}/report`));
  const reportUrl = getFirstDefinedValue(patient, [
    'reportImagePath',
    'reportImageUrl',
    'report_url',
    'reportUrl',
    'relatorio',
    'relatorioUrl',
    'report',
  ]);

  if (reportUrl) {
    return resolveBackendUrl(reportUrl);
  }

  return MOCK_REPORT_IMAGE_PATH;
}

async function requestJsonList(path) {
  const payload = await requestJson(path);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return payload ? [payload] : [];
}

async function requestJson(path) {
  const response = await fetch(joinApiUrl(path));

  if (!response.ok) {
    throw new Error(`Falha ao buscar pacientes (${response.status})`);
  }

  const payload = await response.json();

  return payload;
}

function normalizePatient(patient) {
  if (!patient) return null;

  const id = String(getFirstDefinedValue(patient, ['id', 'pk', 'patientId']));
  // if (!Number.isFinite(id)) return null;

  const nome = String(getFirstDefinedValue(patient, ['nome', 'name', 'fullName', 'full_name']) ?? '');
  const idade = Number(getFirstDefinedValue(patient, ['idade', 'age', 'anos']));
  const campoVisual = Number(
    getFirstDefinedValue(patient, ['campoVisual', 'visualField', 'visual_field', 'visual_site_score', 'vfi', 'campo_visual'])
  );

  return {
    ...patient,
    id,
    nome,
    idade: Number.isFinite(idade) ? idade : 0,
    campoVisual: Number.isFinite(campoVisual) ? campoVisual : 0,
  };
}

function isHighRiskPatient(patient) {
  const highRiskFlag = getFirstDefinedValue(patient, [
    'highRisk',
    'isHighRisk',
    'is_high_risk',
    'riscoAlto',
    'risco_alto',
  ]);

  if (typeof highRiskFlag === 'boolean') {
    return highRiskFlag;
  }

  if (typeof highRiskFlag === 'string') {
    return ['true', '1', 'yes', 'sim'].includes(highRiskFlag.toLowerCase());
  }

  return false;
}

function getFirstDefinedValue(object, keys) {
  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null) {
      return object[key];
    }
  }

  return undefined;
}

function resolveBackendUrl(value) {
  try {
    return new URL(value, API_BASE_URL).toString();
  } catch {
    return value;
  }
}

function joinApiUrl(path) {
  return new URL(path, API_BASE_URL).toString();
}
