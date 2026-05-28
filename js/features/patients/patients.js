/**
 * Pacientes page script.
 */

import { requireAuth }                    from '../../shared/auth-guard.js';
import { initSidebar }                    from '../../shared/sidebar.js';
import { getPatients, getPatientReport }  from '../../services/patients.service.js';
import { getById }                        from '../../utils/dom-helpers.js';

let allPatients      = [];
let selectedPatientId = null;

function init() {
  requireAuth();
  initSidebar('pacientes');

  const searchInput = getById('patient-search');
  searchInput.addEventListener('input', handleSearch);

  loadPatientsList();
}

async function loadPatientsList() {
  const listEl = getById('patients-list');
  listEl.innerHTML = `<li class="loading-state"><span class="spinner"></span><span>Carregando...</span></li>`;

  try {
    allPatients = await getPatients();
    renderPatientList(allPatients);
  } catch {
    listEl.innerHTML = `<li style="padding:12px 16px;" class="alert alert--error">Erro ao carregar pacientes.</li>`;
  }
}

function renderPatientList(patients) {
  const listEl = getById('patients-list');

  if (!patients.length) {
    listEl.innerHTML = `<li style="padding:12px 16px;color:var(--color-text-muted);font-size:13px;">Nenhum paciente encontrado.</li>`;
    return;
  }

  listEl.innerHTML = patients.map(p => `
    <li
      class="patient-item${p.id === selectedPatientId ? ' is-selected' : ''}"
      role="option"
      aria-selected="${p.id === selectedPatientId}"
      data-patient-id="${p.id}"
    >
      <span class="patient-item__name">${escapeText(p.nome)}</span>
      <span class="patient-item__arrow" aria-hidden="true">→</span>
    </li>
  `).join('');

  listEl.querySelectorAll('.patient-item').forEach(item => {
    item.addEventListener('click', () => handlePatientClick(Number(item.dataset.patientId)));
  });
}

async function handlePatientClick(patientId) {
  if (selectedPatientId === patientId) return;
  selectedPatientId = patientId;
  updateSelectedState();
  await loadPatientReport(patientId);
}

function updateSelectedState() {
  document.querySelectorAll('.patient-item').forEach(item => {
    const isSelected = Number(item.dataset.patientId) === selectedPatientId;
    item.classList.toggle('is-selected', isSelected);
    item.setAttribute('aria-selected', String(isSelected));
  });
}

async function loadPatientReport(patientId) {
  const panelEl = getById('patient-report-panel');
  panelEl.innerHTML = `<div class="loading-state"><span class="spinner"></span><span>Carregando relatório...</span></div>`;

  try {
    const imageUrl = await getPatientReport(patientId);
    const patient  = allPatients.find(p => p.id === patientId);
    const altText  = patient ? `Relatório de ${patient.nome}` : 'Relatório do paciente';

    panelEl.innerHTML = `
      <div class="patients-report-panel__report">
        <img
          src="${imageUrl}"
          alt="${escapeText(altText)}"
          class="patients-report-panel__img"
        >
      </div>
    `;
  } catch {
    panelEl.innerHTML = `<div class="alert alert--error">Erro ao carregar relatório.</div>`;
  }
}

function handleSearch(event) {
  const query    = event.target.value.toLowerCase().trim();
  const filtered = allPatients.filter(p => p.nome.toLowerCase().includes(query));
  renderPatientList(filtered);
}

function escapeText(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
