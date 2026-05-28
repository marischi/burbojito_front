/**
 * Auth guard — redirects to index.html when there is no active session.
 * Call requireAuth() at the top of every protected page script.
 */

import { getCurrentUser } from '../services/auth.service.js';

export function requireAuth() {
  if (!getCurrentUser()) {
    window.location.replace('index.html');
  }
}
