/**
 * DOM utility helpers.
 */

/**
 * Returns an element by ID and throws if not found.
 * @param {string} id
 * @returns {HTMLElement}
 */
export function getById(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found in DOM.`);
  return el;
}

/**
 * Hides an element by adding the 'hidden' class.
 * @param {HTMLElement} el
 */
export function hide(el) {
  el.classList.add('hidden');
}

/**
 * Shows an element by removing the 'hidden' class.
 * @param {HTMLElement} el
 */
export function show(el) {
  el.classList.remove('hidden');
}

/**
 * Toggles visibility of an element.
 * @param {HTMLElement} el
 * @param {boolean} visible
 */
export function setVisible(el, visible) {
  if (visible) show(el);
  else hide(el);
}

/**
 * Sets text content safely (avoids XSS).
 * @param {HTMLElement} el
 * @param {string} text
 */
export function setText(el, text) {
  el.textContent = text;
}

/**
 * Shows an alert element with a message.
 * @param {HTMLElement} el
 * @param {string} message
 */
export function showAlert(el, message) {
  el.textContent = message;
  show(el);
}

/**
 * Hides and clears an alert element.
 * @param {HTMLElement} el
 */
export function clearAlert(el) {
  el.textContent = '';
  hide(el);
}

/**
 * Disables or enables a button.
 * @param {HTMLButtonElement} btn
 * @param {boolean} disabled
 */
export function setButtonDisabled(btn, disabled) {
  btn.disabled = disabled;
}

/**
 * Replaces the content of a container with a loading indicator.
 * @param {HTMLElement} container
 */
export function showLoadingInContainer(container) {
  container.innerHTML = `
    <div class="loading-state">
      <span class="spinner"></span>
      <span>Carregando...</span>
    </div>
  `;
}
