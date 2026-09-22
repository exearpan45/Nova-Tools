// Mathematical and Number Precision Utilities
// Avoids floating-point anomalies (e.g. 0.1 + 0.2 = 0.30000000000000004 -> 0.3)

/**
 * Rounds a floating-point number cleanly without trailing binary representation artifacts.
 */
export function roundClean(value: number, maxDecimals: number = 8): number {
  if (isNaN(value) || !isFinite(value)) return value;
  const factor = Math.pow(10, maxDecimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Formats a number with comma groupings while preserving sensible decimal precision.
 */
export function formatNumber(
  value: number,
  options?: {
    maxDecimals?: number;
    useGrouping?: boolean;
  }
): string {
  if (isNaN(value) || !isFinite(value)) return '';

  const maxDecimals = options?.maxDecimals ?? 6;
  const useGrouping = options?.useGrouping ?? true;

  const cleaned = roundClean(value, maxDecimals);

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
    useGrouping,
  }).format(cleaned);
}

/**
 * Parses user numeric input safely, handling locale commas if present.
 */
export function parseCleanNumber(input: string): number | null {
  if (!input || typeof input !== 'string') return null;
  const sanitized = input.trim().replace(/,/g, '');
  if (!sanitized) return null;
  const num = Number(sanitized);
  return isNaN(num) ? null : num;
}
