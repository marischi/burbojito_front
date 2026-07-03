/**
 * Cadastro de novo usuário page script.
 */

import { requireAuth } from '../../shared/auth-guard.js';
import { initSidebar } from '../../shared/sidebar.js';
import { createUser } from '../../services/user.service.js';
import {
  getById,
  showAlert,
  clearAlert,
  setButtonDisabled,
} from '../../utils/dom-helpers.js';
import {
  validateProfileFields,
  validatePasswordFields,
} from '../../utils/profile-validation.js';

function init() {
  requireAuth();
  initSidebar('cadastro-usuario');
  getById('register-form').addEventListener('submit', handleRegister);
}

async function handleRegister(event) {
  event.preventDefault();

  const alertEl = getById('register-alert');
  const saveBtn = getById('btn-register-user');

  clearAlert(alertEl);

  const data = {
    nome:      getById('register-nome').value.trim(),
    sobrenome: getById('register-sobrenome').value.trim(),
    email:     getById('register-email').value.trim(),
    username:  getById('register-username').value.trim(),
    telefone:  getById('register-telefone').value.trim(),
  };
  const password        = getById('register-password').value;
  const confirmPassword = getById('register-confirm-password').value;

  const validationErrors = [
    ...validateProfileFields(data),
    ...validatePasswordFields(password, confirmPassword),
  ];

  if (validationErrors.length) {
    alertEl.className = 'alert alert--error';
    showAlert(alertEl, validationErrors[0]);
    return;
  }

  setButtonDisabled(saveBtn, true);
  saveBtn.textContent = 'Cadastrando...';

  try {
    await createUser({ ...data, password });
    alertEl.className = 'alert alert--success';
    showAlert(alertEl, 'Usuário cadastrado com sucesso.');
    getById('register-form').reset();
  } catch (err) {
    alertEl.className = 'alert alert--error';
    showAlert(alertEl, err.message);
  } finally {
    setButtonDisabled(saveBtn, false);
    saveBtn.textContent = 'CADASTRAR USUÁRIO';
  }
}

document.addEventListener('DOMContentLoaded', init);
