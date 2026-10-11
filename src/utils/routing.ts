/**
 * Normalize a browser location or internal route to a stable pathname.
 * Query strings and fragments are intentionally excluded from route matching.
 */
export function normalizeRoutePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || '/';
  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
}
