/**
 * Sidebar — toggle collapse and active nav item highlight.
 * Call initSidebar(currentRoute) on every protected page.
 *
 * @param {'tablero'|'pacientes'|'notificacoes'|'ajustes'} currentRoute
 */
export function initSidebar(currentRoute) {
  const sidebar  = document.getElementById('sidebar');
  const appShell = document.getElementById('app-shell');
  const toggle   = document.getElementById('btn-sidebar-toggle');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('is-collapsed');
      appShell?.classList.toggle('sidebar-collapsed', collapsed);
      toggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  document.querySelectorAll('.nav-item[data-route]').forEach(item => {
    const isActive = item.dataset.route === currentRoute;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}
