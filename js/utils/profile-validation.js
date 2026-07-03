/**
 * Shared validation for profile / user registration fields.
 */

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * @param {{ nome: string, sobrenome: string, email: string, username: string, telefone?: string }} data
 * @returns {string[]} List of error messages
 */
export function validateProfileFields(data) {
  const errors = [];

  if (!data.nome) errors.push('Informe o nome.');
  if (!data.sobrenome) errors.push('Informe o sobrenome.');

  if (!data.email) {
    errors.push('Informe o e-mail.');
  } else if (!isValidEmail(data.email)) {
    errors.push('E-mail inválido.');
  }

  if (!data.username) errors.push('Informe o username.');

  return errors;
}

/**
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string[]} List of error messages
 */
export function validatePasswordFields(password, confirmPassword) {
  const errors = [];

  if (!password) {
    errors.push('Informe a senha.');
  } else if (password.length < 6) {
    errors.push('A senha deve ter ao menos 6 caracteres.');
  }

  if (!confirmPassword) {
    errors.push('Confirme a senha.');
  } else if (password !== confirmPassword) {
    errors.push('A senha e a confirmação não coincidem.');
  }

  return errors;
}
