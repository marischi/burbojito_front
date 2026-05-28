/**
 * Notificações page script.
 */

import { requireAuth }       from '../../shared/auth-guard.js';
import { initSidebar }       from '../../shared/sidebar.js';
import { getNotifications }  from '../../services/notifications.service.js';
import { getById, showLoadingInContainer } from '../../utils/dom-helpers.js';

function init() {
  requireAuth();
  initSidebar('notificacoes');
  loadNotifications();
}

async function loadNotifications() {
  const container = getById('notifications-container');
  showLoadingInContainer(container);

  try {
    const groups = await getNotifications();
    container.innerHTML = groups.map(buildNotificationGroup).join('');
  } catch {
    container.innerHTML = '<p class="alert alert--error">Erro ao carregar notificações.</p>';
  }
}

function buildNotificationGroup(group) {
  const items = group.itens.map(buildNotificationItem).join('');
  return `
    <div class="notifications-group">
      <p class="notifications-group__label">${escapeText(group.grupo)}</p>
      <ul class="notifications-list" aria-label="Notificações de ${escapeText(group.grupo)}">
        ${items}
      </ul>
    </div>
  `;
}

function buildNotificationItem(item) {
  return `
    <li class="notification-item" data-notification-id="${item.id}">
      <div class="notification-item__body">
        <p class="notification-item__text">
          <span class="accent">Enfermeiro ${escapeText(item.enfermeiro)}</span>
          registrou novas informações sobre
          <span class="accent">paciente ${escapeText(item.paciente)}</span>
        </p>
        <p class="notification-item__vfi">%${item.vfi}</p>
      </div>
      <time class="notification-item__time">${escapeText(item.tempoLabel)}</time>
    </li>
  `;
}

function escapeText(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
