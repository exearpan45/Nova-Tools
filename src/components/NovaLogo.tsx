import React from 'react';

interface NovaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

export const NovaLogo: React.FC<NovaLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  animated = false,
}) => {
  const sizeMap = {
    xs: { icon: 20, text: 'text-sm' },
    sm: { icon: 26, text: 'text-base' },
    md: { icon: 34, text: 'text-xl' },
    lg: { icon: 44, text: 'text-2xl' },
    xl: { icon: 56, text: 'text-3xl' },
    hero: { icon: 72, text: 'text-4xl md:text-5xl' },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Geometric Orbital N Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${animated ? 'group' : ''}`}>
        {/* Ambient glow in dark mode */}
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500/25 via-violet-600/30 to-pink-500/25 blur-md opacity-60 dark:opacity-80 -z-10"
          aria-hidden="true"
        />

        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="novaGradientBrand" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="novaSparkBrand" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <filter id="novaGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#3b82f6" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Left Orbital Pillar */}
          <path
            d="M10 38V14C10 11.7909 11.7909 10 14 10H16C17.1046 10 18 10.8954 18 12V36C18 37.1046 17.1046 38 16 38H14C11.7909 38 10 38 10 38Z"
            fill="url(#novaGradientBrand)"
            rx="3"
          />

          {/* Right Orbital Pillar */}
          <path
            d="M38 10V34C38 36.2091 36.2091 38 34 38H32C30.8954 38 30 37.1046 30 36V12C30 10.8954 30.8954 10 32 10H34C36.2091 10 38 10 38 10Z"
            fill="url(#novaGradientBrand)"
            rx="3"
          />

          {/* Dynamic Hyper-Speed Diagonal N Spark */}
          <path
            d="M13 13.5L34.5 35.5C35.8 36.8 38 35.9 38 34.1V31.5L17.5 10.5C16.2 9.2 14 10.1 14 11.9V13.5H13Z"
            fill="url(#novaSparkBrand)"
            filter="url(#novaGlowFilter)"
          />

          {/* Central Orbital Synergy Core */}
          <circle cx="24" cy="24" r="3.2" fill="#ffffff" className="dark:fill-white fill-slate-900" />
          <circle cx="24" cy="24" r="1.8" fill="#38bdf8" />

          {/* High-speed momentum satellite dots */}
          <circle cx="36" cy="11" r="2" fill="#ec4899" />
          <circle cx="12" cy="37" r="2" fill="#06b6d4" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center tracking-tight">
          <span className={`font-black tracking-wider text-slate-900 dark:text-white uppercase ${current.text}`}>
            NOVA<span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent ml-1 font-bold">TOOLS</span>
          </span>
        </div>
      )}
    </div>
  );
};
