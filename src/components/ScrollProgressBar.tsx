import React, { useEffect, useState } from 'react';
import { useNova } from '../context/NovaContext';
import { normalizeRoutePath } from '../utils/routing';

interface ScrollProgressBarProps {
  /**
   * If true, shows an optional subtle reading percentage pill on hover or active scrolling.
   */
  showPercentage?: boolean;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ showPercentage = false }) => {
  const { currentPath } = useNova();
  const [progress, setProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const normalized = normalizeRoutePath(currentPath);

  // Active on long-form content pages: Privacy, Terms, Disclaimer, Cookie Policy, About, Contact, Changelog, or Tool Detail pages (/tools/...)
  const isLongFormRoute =
    normalized === '/privacy' ||
    normalized === '/privacy-policy' ||
    normalized === '/terms' ||
    normalized === '/disclaimer' ||
    normalized === '/cookie-policy' ||
    normalized === '/about' ||
    normalized === '/contact' ||
    normalized === '/changelog' ||
    normalized === '/whats-new' ||
    normalized === '/workspace' ||
    normalized.startsWith('/tools/');

  useEffect(() => {
    if (!isLongFormRoute) {
      setIsVisible(false);
      setProgress(0);
      return;
    }

    let ticking = false;

    const computeProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollTotal = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;

      if (scrollTotal > 120) {
        const pct = Math.min(100, Math.max(0, (scrollY / scrollTotal) * 100));
        setProgress(pct);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(computeProgress);
        ticking = true;
      }
    };

    // Calculate immediately and on window resize/content load
    computeProgress();
    const timer = setTimeout(computeProgress, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isLongFormRoute, currentPath]);

  if (!isLongFormRoute || !isVisible) {
    return null;
  }

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2.5px] z-50 overflow-hidden bg-slate-200/20 dark:bg-slate-800/20"
    >
      <div
        className="h-full bg-gradient-to-r from-[#7657FF] via-[#00D9FF] to-[#FF4FC8] will-change-transform shadow-[0_0_8px_rgba(0,217,255,0.7)]"
        style={{
          transform: `scaleX(${progress / 100})`,
          transformOrigin: 'left center',
          transition: 'transform 80ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      {showPercentage && progress > 5 && progress < 99 && (
        <span
          className="absolute right-2 -top-6 text-[10px] font-mono font-bold text-cyan-400 bg-slate-900/90 px-1.5 py-0.5 rounded shadow-sm"
          style={{ opacity: progress > 5 ? 1 : 0 }}
        >
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};
