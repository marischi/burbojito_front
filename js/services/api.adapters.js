/**
 * Normalizes backend payloads into the shapes expected by the UI.
 */

function pick(obj, ...keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  return (
    payload.results
    ?? payload.data
    ?? payload.items
    ?? payload.patients
    ?? payload.evaluations
    ?? payload.notifications
    ?? payload.high_risk_patients
    ?? payload.highRiskPatients
    ?? []
  );
}

function resolveAbsoluteUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (/^https?:\/\//.test(url) || url.startsWith('data:')) return url;
  if (url.startsWith('/')) {
    const base = typeof window !== 'undefined' && window.BURBOJITO_API_BASE_URL
      ? window.BURBOJITO_API_BASE_URL
      : 'http://127.0.0.1:8000';
    return `${base.replace(/\/$/, '')}${url}`;
  }
  return url;
}

/**
 * @param {unknown} raw
 * @returns {{ id: number|string, nome: string, idade: number, campoVisual: number }}
 */
export function normalizePatient(raw) {
  const item = raw ?? {};
  const nome = pick(item, 'nome', 'name')
    ?? [pick(item, 'first_name', 'primeiro_nome'), pick(item, 'last_name', 'sobrenome')]
      .filter(Boolean)
      .join(' ')
      .trim();

  return {
    id: pick(item, 'id', 'patient_id', 'pk'),
    nome: nome || 'Paciente',
    idade: Number(pick(item, 'idade', 'age', 'idade_anos') ?? 0),
    campoVisual: Number(
      pick(item, 'campoVisual', 'campo_visual', 'visual_field', 'vfi', 'vfi_percent') ?? 0,
    ),
  };
}

/**
 * @param {unknown} payload
 * @returns {Array<{ id: number|string, nome: string, idade: number, campoVisual: number }>}
 */
export function normalizePatients(payload) {
  return toArray(payload).map(normalizePatient);
}

/**
 * @param {unknown} raw
 * @returns {{ data: string, numero: number }}
 */
function formatEvaluationDate(dateValue) {
  if (!dateValue) return '';
  if (typeof dateValue !== 'string') return String(dateValue);

  const isoMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[3]}-${isoMatch[2]}-${isoMatch[1]}`;

  return dateValue;
}

export function normalizeEvaluation(raw) {
  const item = raw ?? {};
  const dateValue = pick(item, 'data', 'date', 'data_avaliacao', 'created_at', 'createdAt');

  return {
    data: formatEvaluationDate(dateValue),
    numero: Number(pick(item, 'numero', 'count', 'total', 'quantidade', 'number') ?? 0),
  };
}

/**
 * @param {unknown} payload
 * @returns {Array<{ data: string, numero: number }>}
 */
export function normalizeEvaluations(payload) {
  return toArray(payload).map(normalizeEvaluation);
}

/**
 * @param {unknown} raw
 * @returns {{ id: number|string, nome: string, sobrenome: string, email: string, username: string, telefone: string, role?: string }}
 */
export function normalizeUser(raw) {
  const item = raw ?? {};
  const user = pick(item, 'user') ?? item;

  return {
    id: pick(user, 'id', 'user_id', 'pk'),
    nome: pick(user, 'nome', 'first_name', 'primeiro_nome') ?? '',
    sobrenome: pick(user, 'sobrenome', 'last_name', 'ultimo_nome') ?? '',
    email: pick(user, 'email') ?? '',
    username: pick(user, 'username', 'user_name') ?? '',
    telefone: pick(user, 'telefone', 'phone', 'telephone') ?? '',
    role: pick(user, 'role', 'perfil', 'profile'),
  };
}

/**
 * @param {unknown} raw
 * @returns {{ id: number|string, enfermeiro: string, paciente: string, vfi: number, tempoLabel: string }}
 */
export function normalizeNotificationItem(raw) {
  const item = raw ?? {};

  return {
    id: pick(item, 'id', 'notification_id', 'pk') ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    enfermeiro: pick(item, 'enfermeiro', 'nurse', 'usuario', 'user_name', 'evaluator') ?? '—',
    paciente: pick(item, 'paciente', 'patient', 'patient_name', 'nome_paciente') ?? '—',
    vfi: Number(pick(item, 'vfi', 'campo_visual', 'campoVisual', 'visual_field') ?? 0),
    tempoLabel: pick(item, 'tempoLabel', 'tempo_label', 'time_label', 'time_ago', 'relative_time') ?? '',
  };
}

/**
 * @param {unknown} raw
 * @returns {{ grupo: string, itens: Array }}
 */
export function normalizeNotificationGroup(raw) {
  const item = raw ?? {};
  const itens = toArray(pick(item, 'itens', 'items') ?? item).map(normalizeNotificationItem);

  return {
    grupo: pick(item, 'grupo', 'group', 'label', 'date_label') ?? 'NOTIFICAÇÕES',
    itens,
  };
}

/**
 * @param {unknown} payload
 * @returns {Array<{ grupo: string, itens: Array }>}
 */
export function normalizeNotifications(payload) {
  if (Array.isArray(payload) && payload.every(group => group?.itens || group?.items)) {
    return payload.map(normalizeNotificationGroup);
  }

  const root = payload && typeof payload === 'object' ? payload : {};
  const groups = toArray(
    pick(root, 'notifications', 'notificacoes', 'groups', 'grupos') ?? root,
  );

  if (groups.length && (groups[0]?.itens || groups[0]?.items || groups[0]?.grupo || groups[0]?.group)) {
    return groups.map(normalizeNotificationGroup);
  }

  return groupEvaluationsAsNotifications(toArray(payload));
}

function groupEvaluationsAsNotifications(evaluations) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayKey = today.toISOString().slice(0, 10);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  const groups = {
    HOY: [],
    AYER: [],
    OUTROS: [],
  };

  evaluations.forEach(raw => {
    const item = normalizeNotificationItem(raw);
    const dateValue = pick(raw, 'date', 'data', 'created_at', 'createdAt');
    const dateKey = typeof dateValue === 'string' ? dateValue.slice(0, 10) : '';

    if (dateKey === todayKey) groups.HOY.push(item);
    else if (dateKey === yesterdayKey) groups.AYER.push(item);
    else groups.OUTROS.push(item);
  });

  return [
    { grupo: 'HOY', itens: groups.HOY },
    { grupo: 'AYER', itens: groups.AYER },
    { grupo: 'ANTERIORES', itens: groups.OUTROS },
  ].filter(group => group.itens.length > 0);
}

/**
 * @param {unknown} payload
 * @returns {string}
 */
export function normalizeReportUrl(payload) {
  if (typeof payload === 'string') return resolveAbsoluteUrl(payload);

  if (payload && typeof payload === 'object') {
    const url = pick(
      payload,
      'image_url',
      'imageUrl',
      'report_url',
      'reportUrl',
      'url',
      'path',
      'pdf_result_path',
      'file_path',
    );
    if (url) return resolveAbsoluteUrl(url);
  }

  throw new Error('Relatório não disponível para este paciente.');
}

/**
 * @param {unknown} payload
 * @returns {Array<{ id: number|string, nome: string, idade: number, campoVisual: number }>}
 */
export function extractHighRiskPatientsFromDashboard(payload) {
  if (!payload || typeof payload !== 'object') return [];

  const candidates = [
    payload.high_risk_patients,
    payload.highRiskPatients,
    payload.pacientes_alto_risco,
    payload.pacientesAltoRisco,
    payload.patients,
    payload.pacientes,
  ].find(Array.isArray);

  if (candidates) return candidates.map(normalizePatient);

  const nested = pick(payload, 'dashboard', 'data');
  if (nested) return extractHighRiskPatientsFromDashboard(nested);

  return normalizePatients(payload).filter(patient => patient.campoVisual > 0 && patient.campoVisual < 70);
}

/**
 * @param {unknown} payload
 * @returns {Array<{ data: string, numero: number }>}
 */
export function extractEvaluationsFromDashboard(payload) {
  if (!payload || typeof payload !== 'object') return [];

  const candidates = [
    payload.evaluations,
    payload.avaliacoes,
    payload.evaluations_summary,
    payload.evaluationsSummary,
  ].find(Array.isArray);

  if (candidates) return candidates.map(normalizeEvaluation);

  const nested = pick(payload, 'dashboard', 'data');
  if (nested) return extractEvaluationsFromDashboard(nested);

  return [];
}

/**
 * @param {unknown} payload
 * @returns {Array<{ grupo: string, itens: Array }>}
 */
export function extractNotificationsFromDashboard(payload) {
  if (!payload || typeof payload !== 'object') return [];

  const candidates = [
    payload.notifications,
    payload.notificacoes,
    payload.groups,
    payload.grupos,
  ].find(Array.isArray);

  if (candidates) return normalizeNotifications(candidates);

  const nested = pick(payload, 'dashboard', 'data');
  if (nested) return extractNotificationsFromDashboard(nested);

  return [];
}
