import React, { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT_ID } from '../config/features';

interface AdSlotProps {
  id?: string;
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
  adsEnabled?: boolean;
}

/**
 * AdSlot Component
 * Renders a compliant Google AdSense ad container using ca-pub-3171742470969015.
 * Non-intrusive, styled for both light and dark themes.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  id = 'tool-bottom-ad',
  slot,
  format = 'auto',
  className = '',
  adsEnabled = true,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!adsEnabled || pushedRef.current) return;
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
        adsbygoogle.push({});
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle = adsbygoogle;
        pushedRef.current = true;
      }
    } catch {
      // AdSense push might fail if script is blocked by client adblocker
    }
  }, [adsEnabled]);

  if (!adsEnabled) {
    return null;
  }

  return (
    <div
      id={id}
      data-no-print="true"
      className={`w-full overflow-hidden flex flex-col items-center my-6 py-2 px-3 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 no-print ${className}`}
    >
      <span className="text-[10px] uppercase font-medium tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
        Advertisement
      </span>
      <div className="w-full min-h-[90px] flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full text-center"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot || 'default'}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
