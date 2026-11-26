declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Privacy-preserving analytics helper for GA4 (G-X5PB7K7H9N / G-JVN75PL5JS).
 * Never emits uploaded file contents, passwords, or personal user input.
 */
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch {
    // Ignore analytics errors if blocked by privacy extensions
  }
}

export function trackToolOpen(slug: string, suite: string): void {
  trackEvent('tool_opened', { tool_slug: slug, suite });
}

export function trackSearchPerformed(resultCount: number, suiteFilter: string): void {
  trackEvent('search_performed', { result_count: resultCount, suite_filter: suiteFilter });
}

export function trackCategoryViewed(suite: string): void {
  trackEvent('category_viewed', { suite });
}

export function trackFavoriteToggled(slug: string, added: boolean): void {
  trackEvent('favorite_toggled', { tool_slug: slug, action: added ? 'add' : 'remove' });
}

export function trackWorkflowExecuted(workflowId: string, status: 'success' | 'error'): void {
  trackEvent('workflow_executed', { workflow_id: workflowId, status });
}
