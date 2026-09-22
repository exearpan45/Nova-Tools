import React from 'react';

interface AdSlotProps {
  id?: string;
  slot?: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

/**
 * AdSlot Component
 * Prepared placeholder for unobtrusive Google AdSense integration.
 * In production, official Google AdSense <ins> script can be injected cleanly without layout shift.
 * Adheres to PRD guidelines: no fake publisher IDs, no invasive popups, strictly below tools or between sections.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  id = 'ad-slot',
  className = '',
  format = 'horizontal'
}) => {
  return (
    <div
      id={id}
      aria-label="Advertisement placeholder"
      className={`w-full my-8 flex flex-col items-center justify-center p-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30 text-xs text-neutral-400 dark:text-neutral-500 transition-colors ${
        format === 'rectangle' ? 'min-h-[250px]' : 'min-h-[90px]'
      } ${className}`}
    >
      <span className="font-mono uppercase tracking-wider text-[11px] text-neutral-400 dark:text-neutral-500">
        Advertisement
      </span>
      <span className="mt-1 text-[11px] text-neutral-400/80 dark:text-neutral-600">
        Clean, non-intrusive ad space
      </span>
    </div>
  );
};
