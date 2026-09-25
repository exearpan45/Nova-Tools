import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const applyThemeToDOM = (dark: boolean) => {
  const root = document.documentElement;
  if (dark) {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.backgroundColor = '#121214';
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.backgroundColor = '#ffffff';
    root.style.colorScheme = 'light';
  }
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', dark ? '#121214' : '#ffffff');
  }
};

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    applyThemeToDOM(nextDark);
    try {
      localStorage.setItem('novatools_theme', nextDark ? 'dark' : 'light');
    } catch {}
  };

  // Sync if system OS scheme changes and user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem('novatools_theme');
        if (!stored) {
          applyThemeToDOM(e.matches);
          setIsDark(e.matches);
        }
      } catch {}
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sync across multiple open browser tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'novatools_theme') {
        const newTheme = e.newValue;
        if (newTheme === 'dark') {
          applyThemeToDOM(true);
          setIsDark(true);
        } else if (newTheme === 'light') {
          applyThemeToDOM(false);
          setIsDark(false);
        } else {
          const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          applyThemeToDOM(sysDark);
          setIsDark(sysDark);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};
