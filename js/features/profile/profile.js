/**
 * Configurações page script.
 */

import { requireAuth }                        from '../../shared/auth-guard.js';
import { initSidebar }                        from '../../shared/sidebar.js';
import { getProfile, updateProfile, changePassword } from '../../services/user.service.js';
import { logout }                             from '../../services/auth.service.js';
import {
  getById,
  showAlert,
  clearAlert,
  setButtonDisabled,
  show,
  hide,
} from '../../utils/dom-helpers.js';

function init() {
  requireAuth();
  initSidebar('ajustes');
  bindHandlers();
  loadProfile();
}

async function loadProfile() {
  const alertEl = getById('profile-alert');
  clearAlert(alertEl);

  try {
    const profile = await getProfile();
    populateForm(profile);
  } catch (err) {
    alertEl.className = 'alert alert--error';
    showAlert(alertEl, err.message);
  }
}

function populateForm(profile) {
  getById('profile-name').value      = profile.name      ?? '';
  getById('profile-sobrenome').value = profile.sobrenome ?? '';
  getById('profile-email').value     = profile.email     ?? '';
  getById('profile-username').value  = profile.username  ?? '';
  getById('profile-phone').value  = profile.phone_number  ?? '';
}

function bindHandlers() {
  getById('profile-form').addEventListener('submit', handleSaveProfile);
  getById('btn-logout').addEventListener('click', handleLogout);
  getById('change-password-link').addEventListener('click', openPasswordModal);
  getById('btn-modal-cancel').addEventListener('click', closePasswordModal);
  getById('btn-modal-save').addEventListener('click', handleChangePassword);

  getById('modal-change-password').addEventListener('click', event => {
    if (event.target === event.currentTarget) closePasswordModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePasswordModal();
  });
}

async function handleSaveProfile(event) {
  event.preventDefault();

  const alertEl = getById('profile-alert');
  const saveBtn = getById('btn-save-profile');

  clearAlert(alertEl);
  setButtonDisabled(saveBtn, true);
  saveBtn.textContent = 'Salvando...';

  const data = {
    name:      getById('profile-name').value.trim(),
    sobrenome: getById('profile-sobrenome').value.trim(),
    email:     getById('profile-email').value.trim(),
    username:  getById('profile-username').value.trim(),
    phone_number:  getById('profile-phone').value.trim(),
  };

  try {
    await updateProfile(data);
    alertEl.className = 'alert alert--success';
    showAlert(alertEl, 'Perfil atualizado com sucesso.');
  } catch (err) {
    alertEl.className = 'alert alert--error';
    showAlert(alertEl, err.message);
  } finally {
    setButtonDisabled(saveBtn, false);
    saveBtn.textContent = 'SALVAR ALTERAÇÕES';
  }
}

function handleLogout() {
  logout();
  window.location.href = 'index.html';
}

function openPasswordModal() {
  clearAlert(getById('modal-pwd-alert'));
  getById('modal-current-pwd').value = '';
  getById('modal-new-pwd').value     = '';
  getById('modal-confirm-pwd').value = '';
  show(getById('modal-change-password'));
  getById('modal-current-pwd').focus();
}

function closePasswordModal() {
  hide(getById('modal-change-password'));
}

async function handleChangePassword() {
  const alertEl    = getById('modal-pwd-alert');
  const currentPwd = getById('modal-current-pwd').value;
  const newPwd     = getById('modal-new-pwd').value;
  const confirmPwd = getById('modal-confirm-pwd').value;
  const saveBtn    = getById('btn-modal-save');

  clearAlert(alertEl);

  if (!currentPwd || !newPwd || !confirmPwd) {
    showAlert(alertEl, 'Preencha todos os campos.');
    return;
  }
  if (newPwd.length < 6) {
    showAlert(alertEl, 'A nova senha deve ter ao menos 6 caracteres.');
    return;
  }
  if (newPwd !== confirmPwd) {
    showAlert(alertEl, 'A nova senha e a confirmação não coincidem.');
    return;
  }

  setButtonDisabled(saveBtn, true);
  saveBtn.textContent = 'Salvando...';

  try {
    await changePassword(currentPwd, newPwd);
    closePasswordModal();
    const profileAlert = getById('profile-alert');
    profileAlert.className = 'alert alert--success';
    showAlert(profileAlert, 'Senha alterada com sucesso.');
  } catch (err) {
    showAlert(alertEl, err.message);
  } finally {
    setButtonDisabled(saveBtn, false);
    saveBtn.textContent = 'Salvar';
  }
}

document.addEventListener('DOMContentLoaded', init);
