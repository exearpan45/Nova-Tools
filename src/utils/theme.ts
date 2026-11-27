import { ThemeId } from '../types';

/** Resolve the user's appearance preference to the concrete theme for this render. */
export type ResolvedTheme = 'dark' | 'light';

export function resolveTheme(preference: ThemeId, prefersDark: boolean): ResolvedTheme {
  if (preference === 'system') return prefersDark ? 'dark' : 'light';
  return preference;
}
