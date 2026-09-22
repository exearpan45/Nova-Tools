// NOVA TOOLS Feature Flags & Maintenance Configuration

export interface FeatureFlags {
  enablePWA: boolean;
  enableOfflineIndicator: boolean;
  enableKeyboardShortcuts: boolean;
  enableQuickAccess: boolean;
  enableRecentTools: boolean;
  enableFavoriteTools: boolean;
  enableSorting: boolean;
}

export const FEATURE_FLAGS: FeatureFlags = {
  enablePWA: true,
  enableOfflineIndicator: true,
  enableKeyboardShortcuts: true,
  enableQuickAccess: true,
  enableRecentTools: true,
  enableFavoriteTools: true,
  enableSorting: true,
};

/**
 * Slugs of tools temporarily disabled for developer maintenance.
 * When a tool is in this array, users see a graceful maintenance state instead of a broken interface.
 */
export const MAINTENANCE_TOOLS: string[] = [
  // Example: 'currency-converter' (if in maintenance)
];

export function isToolInMaintenance(slug: string): boolean {
  return MAINTENANCE_TOOLS.includes(slug);
}
