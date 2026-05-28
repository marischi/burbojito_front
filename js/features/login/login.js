/**
 * Login page script.
 */

import { login, getCurrentUser } from '../../services/auth.service.js';
import {
  getById,
  showAlert,
  clearAlert,
  setButtonDisabled,
} from '../../utils/dom-helpers.js';

function init() {
  if (getCurrentUser()) {
    window.location.replace('tablero.html');
    return;
  }

  const form          = getById('login-form');
  const emailInput    = getById('login-email');
  const passwordInput = getById('login-password');
  const emailError    = getById('login-email-error');
  const passwordError = getById('login-password-error');
  const alertEl       = getById('login-alert');
  const submitBtn     = getById('btn-login');
  const forgotBtn     = getById('btn-forgot-password');

  form.addEventListener('submit', handleSubmit);
  forgotBtn.addEventListener('click', handleForgotPassword);

  async function handleSubmit(event) {
    event.preventDefault();
    clearAlert(alertEl);
    clearFieldErrors();

    const email    = emailInput.value.trim();
    const password = passwordInput.value;

    if (!validateFields(email, password)) return;

    setButtonDisabled(submitBtn, true);
    submitBtn.textContent = 'Entrando...';

    try {
      await login(email, password);
      window.location.href = 'tablero.html';
    } catch (error) {
      showAlert(alertEl, error.message);
    } finally {
      setButtonDisabled(submitBtn, false);
      submitBtn.textContent = 'ENTRAR';
    }
  }

  function validateFields(email, password) {
    let valid = true;

    if (!email) {
      emailError.textContent = 'Informe o e-mail.';
      valid = false;
    } else if (!isValidEmail(email)) {
      emailError.textContent = 'E-mail inválido.';
      valid = false;
    }

    if (!password) {
      passwordError.textContent = 'Informe a senha.';
      valid = false;
    }

    return valid;
  }

  function clearFieldErrors() {
    emailError.textContent    = '';
    passwordError.textContent = '';
  }
}

function handleForgotPassword() {
  alert('Para recuperar sua senha, entre em contato com o administrador do sistema.');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', init);
