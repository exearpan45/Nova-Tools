// Local Storage Utilities for NOVA TOOLS
// Strict Privacy Guarantee: NEVER store user inputs, passwords, or personal content.
// Only store harmless IDs and preference strings.

const RECENT_KEY = 'nova-tools-recent';
const FAVORITES_KEY = 'nova-tools-favorites';
const PREFS_KEY_PREFIX = 'nova-tools-pref-';
const VISIT_COUNT_KEY = 'nova-tools-visit-count';

const MAX_RECENTS = 8;

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

export function removeRecentToolSlug(slug: string): string[] {
  try {
    const current = getRecentToolSlugs().filter((s) => s !== slug);
    localStorage.setItem(RECENT_KEY, JSON.stringify(current));
    return current;
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

// Returning User Detection
export function isReturningUser(): boolean {
  try {
    const rawCount = localStorage.getItem(VISIT_COUNT_KEY);
    const count = rawCount ? parseInt(rawCount, 10) : 0;
    if (count > 0) return true;
    
    // Also check if user has existing recents or favorites
    const hasRecents = getRecentToolSlugs().length > 0;
    const hasFavorites = getFavoriteToolSlugs().length > 0;
    return hasRecents || hasFavorites;
  } catch {
    return false;
  }
}

export function markUserVisited(): void {
  try {
    const rawCount = localStorage.getItem(VISIT_COUNT_KEY);
    const count = rawCount ? parseInt(rawCount, 10) : 0;
    localStorage.setItem(VISIT_COUNT_KEY, (count + 1).toString());
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

// 5-Star Tool Ratings (Persists in user's localStorage)
const RATINGS_KEY = 'nova-tools-ratings';

export function getToolRating(slug: string): number {
  try {
    const raw = localStorage.getItem(RATINGS_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    const score = Number(parsed[slug]);
    return score >= 1 && score <= 5 ? score : 0;
  } catch {
    return 0;
  }
}

export function setToolRating(
  slug: string,
  rating: number
): { rating: number; allRatings: Record<string, number> } {
  try {
    const raw = localStorage.getItem(RATINGS_KEY);
    const current: Record<string, number> = raw ? JSON.parse(raw) : {};
    const validRating = Math.max(0, Math.min(5, Math.round(rating)));

    if (validRating === 0) {
      delete current[slug];
    } else {
      current[slug] = validRating;
    }

    localStorage.setItem(RATINGS_KEY, JSON.stringify(current));
    return { rating: validRating, allRatings: current };
  } catch {
    return { rating: 0, allRatings: {} };
  }
}

export function getAllToolRatings(): Record<string, number> {
  try {
    const raw = localStorage.getItem(RATINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

