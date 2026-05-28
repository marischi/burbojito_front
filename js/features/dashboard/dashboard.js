/**
 * Painel page script.
 */

import { requireAuth }        from '../../shared/auth-guard.js';
import { initSidebar }        from '../../shared/sidebar.js';
import { getHighRiskPatients } from '../../services/patients.service.js';
import { getEvaluations }      from '../../services/evaluations.service.js';
import { getById, showLoadingInContainer } from '../../utils/dom-helpers.js';

function init() {
  requireAuth();
  initSidebar('tablero');
  loadHighRiskTable();
  loadEvaluationsPanel();
}

async function loadHighRiskTable() {
  const container = getById('high-risk-table-container');
  showLoadingInContainer(container);

  try {
    const patients = await getHighRiskPatients();
    container.innerHTML = buildHighRiskTable(patients);
  } catch {
    container.innerHTML = '<p class="alert alert--error">Erro ao carregar pacientes.</p>';
  }
}

function buildHighRiskTable(patients) {
  const rows = patients.map(p => `
    <tr>
      <td>${escapeText(p.nome)}</td>
      <td>${p.idade}</td>
      <td>${p.campoVisual} %</td>
      <td><button type="button" class="data-table__link" data-patient-id="${p.id}">Ver detalhes</button></td>
    </tr>
  `).join('');

  return `
    <table class="data-table" aria-label="Pacientes com maior risco">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Idade</th>
          <th>Campo Visual</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function loadEvaluationsPanel() {
  const tableContainer = getById('evaluations-table-container');
  const chartContainer = getById('chart-container');

  showLoadingInContainer(tableContainer);

  try {
    const evaluations = await getEvaluations();
    tableContainer.innerHTML = buildEvaluationsTable(evaluations);
    renderBarChart(chartContainer, evaluations);
  } catch {
    tableContainer.innerHTML = '<p class="alert alert--error">Erro ao carregar avaliações.</p>';
  }
}

function buildEvaluationsTable(evaluations) {
  const rows = evaluations.map(e => `
    <tr>
      <td>${escapeText(e.data)}</td>
      <td>${e.numero}</td>
      <td><button type="button" class="data-table__link">Ver detalhes</button></td>
    </tr>
  `).join('');

  return `
    <table class="data-table" aria-label="Avaliações realizadas">
      <thead>
        <tr>
          <th>Data</th>
          <th>Número</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderBarChart(container, data) {
  const BAR_WIDTH  = 48;
  const BAR_GAP    = 24;
  const CHART_H    = 180;
  const PADDING_B  = 28;
  const PADDING_L  = 28;
  const maxValue   = Math.max(...data.map(d => d.numero));
  const chartWidth = PADDING_L + data.length * (BAR_WIDTH + BAR_GAP);
  const totalH     = CHART_H + PADDING_B;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const y    = CHART_H * (1 - ratio);
    const label = Math.round(maxValue * ratio);
    return `
      <line x1="${PADDING_L}" y1="${y}" x2="${chartWidth}" y2="${y}"
            stroke="#D1D5DB" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="${PADDING_L - 6}" y="${y + 4}" text-anchor="end"
            font-size="10" fill="#9CA3AF">${label}</text>
    `;
  }).join('');

  const bars = data.map((d, i) => {
    const barH   = (d.numero / maxValue) * CHART_H;
    const x      = PADDING_L + BAR_GAP / 2 + i * (BAR_WIDTH + BAR_GAP);
    const y      = CHART_H - barH;
    const labelX = x + BAR_WIDTH / 2;
    return `
      <rect x="${x}" y="${y}" width="${BAR_WIDTH}" height="${barH}"
            fill="#F07C00" rx="3" ry="3"/>
      <text x="${labelX}" y="${totalH - 6}" text-anchor="middle"
            font-size="9" fill="#6B7280">${escapeText(d.data.slice(0, 5))}</text>
    `;
  }).join('');

  container.innerHTML = `
    <svg
      width="100%"
      viewBox="0 0 ${chartWidth + PADDING_L} ${totalH}"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gráfico de barras — avaliações realizadas"
    >
      ${gridLines}
      ${bars}
    </svg>
  `;
}

function escapeText(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
