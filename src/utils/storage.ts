// Local Storage Utilities for NOVA TOOLS
// Strict Privacy Guarantee: NEVER store user inputs, passwords, or personal content.
// Only store harmless IDs and preference strings.

const RECENT_KEY = 'nova-tools-recent';
const FAVORITES_KEY = 'nova-tools-favorites';
const PREFS_KEY_PREFIX = 'nova-tools-pref-';

const MAX_RECENTS = 6;

export function getRecentToolSlugs(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

export function recordRecentToolSlug(slug: string): string[] {
  try {
    const current = getRecentToolSlugs().filter((s) => s !== slug);
    const updated = [slug, ...current].slice(0, MAX_RECENTS);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearRecentTools(): void {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function getFavoriteToolSlugs(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteToolSlug(slug: string): { isFavorite: boolean; favorites: string[] } {
  try {
    const current = getFavoriteToolSlugs();
    let updated: string[];
    let isFavorite: boolean;

    if (current.includes(slug)) {
      updated = current.filter((s) => s !== slug);
      isFavorite = false;
    } else {
      updated = [...current, slug];
      isFavorite = true;
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return { isFavorite, favorites: updated };
  } catch {
    return { isFavorite: false, favorites: [] };
  }
}

export function isToolFavorite(slug: string): boolean {
  return getFavoriteToolSlugs().includes(slug);
}

// Harmless non-sensitive preferences
export function getSavedPreference<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(PREFS_KEY_PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function savePreference<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFS_KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}
