import React, { useState } from 'react';
import { Search, Menu, X, Download, WifiOff } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  canInstall?: boolean;
  onInstallApp?: () => void;
  isOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  canInstall = false,
  onInstallApp,
  isOnline = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Tools', path: '/tools' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md transition-colors no-print transform-gpu">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            id="nav-logo-btn"
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 transition-colors">
              {/* Minimal geometric star/compass glyph */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
              </svg>
            </div>
            <span className="font-semibold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
              NOVA <span className="text-blue-600 dark:text-blue-400 font-medium">TOOLS</span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                    active
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Offline indicator if browser is offline */}
          {!isOnline && (
            <div
              id="offline-badge"
              className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              title="You are currently offline. Client-side tools continue to work."
            >
              <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Offline (local mode)</span>
            </div>
          )}

          {/* Install PWA Option (Item 10) */}
          {canInstall && onInstallApp && (
            <button
              id="nav-install-pwa-btn"
              type="button"
              onClick={onInstallApp}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Install App</span>
            </button>
          )}

          {/* Quick Search Button */}
          <button
            id="nav-search-btn"
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 text-xs transition-colors cursor-pointer"
            aria-label="Search tools"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Hamburger */}
          <button
            id="nav-mobile-toggle-btn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          id="nav-mobile-menu"
          className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <button
                key={link.path}
                id={`mobile-nav-link-${link.label.toLowerCase()}`}
                onClick={() => handleLinkClick(link.path)}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-md min-h-[44px] flex items-center transition-colors ${
                  active
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
