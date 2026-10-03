import React from 'react';
import { Home, Grid, Search, Star, Menu } from 'lucide-react';
import { useNova } from '../context/NovaContext';

export const MobileNav: React.FC = () => {
  const { currentPath, navigate, setSearchOpen, favorites } = useNova();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/', action: () => navigate('/') },
    { id: 'tools', label: 'Tools', icon: Grid, path: '/tools', action: () => navigate('/tools') },
    { id: 'search', label: 'Search', icon: Search, action: () => setSearchOpen(true) },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Star,
      path: '/favorites',
      badge: favorites.length,
      action: () => navigate('/favorites'),
    },
    { id: 'menu', label: 'Menu', icon: Menu, path: '/settings', action: () => navigate('/settings') },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-1 flex items-center justify-around shadow-lg transition-colors select-none"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        minHeight: 'calc(58px + env(safe-area-inset-bottom, 0px))',
      }}
      aria-label="Mobile navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.path && currentPath === item.path;

        return (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center min-w-[54px] h-[52px] rounded-xl text-[10px] font-medium transition-all active:scale-90 relative ${
              isActive
                ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-[18px] h-[18px] mb-0.5 transition-transform ${
                  isActive ? 'scale-110 text-cyan-600 dark:text-cyan-400 stroke-[2.4]' : 'stroke-[1.8]'
                }`}
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 flex items-center justify-center text-[8px] font-mono font-bold rounded-full bg-cyan-500 text-white leading-none">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
