/**
 * Thin wrapper around localStorage so the rest of the app doesn't
 * touch `window` directly (keeps SSR-safety in one place) and so this
 * layer can later be swapped for a real backend without touching
 * calling code.
 */
const isBrowser = typeof window !== 'undefined';

export function loadJSON<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or disabled — fail silently for this assignment scope
  }
}
