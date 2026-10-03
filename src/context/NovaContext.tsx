import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSettings, ThemeId, ToolSuite, RecentToolItem, WorkflowDefinition } from '../types';
import { DEFAULT_WORKFLOWS } from '../data/workflowsData';
import { TOOLS_BY_SLUG } from '../data/toolsData';

interface NovaContextType {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  recentTools: RecentToolItem[];
  addRecent: (slug: string) => void;
  clearRecent: () => void;
  workflows: WorkflowDefinition[];
  addWorkflow: (wf: WorkflowDefinition) => void;
  deleteWorkflow: (id: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  smartDropFile: File | null;
  setSmartDropFile: (file: File | null) => void;
  pwaInstallPrompt: any;
  installPwa: () => void;
  currentPath: string;
  navigate: (path: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  accentColor: '#06b6d4',
  animations: true,
  compactMode: false,
  defaultSuite: 'all',
  autoDownload: false,
  keepHistory: true,
  confirmBeforeClearing: true,
  reducedMotion: false,
  highContrast: false,
};

const NovaContext = createContext<NovaContextType | undefined>(undefined);

export const NovaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname + window.location.search + window.location.hash;
  });

  // Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_settings');
      const directTheme = localStorage.getItem('novatools_theme');
      let parsed = stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
      if (directTheme === 'light' || directTheme === 'dark') {
        parsed.theme = directTheme;
      }
      return parsed;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_favorites');
      return stored ? JSON.parse(stored) : [
        'image-compressor',
        'pdf-merger',
        'word-counter',
        'json-formatter',
        'percentage-calculator',
        'qr-generator',
        'password-generator',
        'unit-converter'
      ];
    } catch {
      return [];
    }
  });

  // Recent tools
  const [recentTools, setRecentTools] = useState<RecentToolItem[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_recent');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Workflows
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_workflows');
      return stored ? JSON.parse(stored) : DEFAULT_WORKFLOWS;
    } catch {
      return DEFAULT_WORKFLOWS;
    }
  });

  // Global search modal & smart file drop
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [smartDropFile, setSmartDropFile] = useState<File | null>(null);
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);

  // Sidebar collapsed state persisted locally
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nova_v2_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('nova_v2_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search + window.location.hash);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: settings.animations ? 'smooth' : 'auto' });
    }
  };

  // Sync settings with document element classes & attributes
  useEffect(() => {
    try {
      localStorage.setItem('nova_v2_settings', JSON.stringify(settings));
    } catch {}

    const doc = document.documentElement;
    doc.classList.remove('dark', 'light');

    const themeMode = settings.theme === 'light' ? 'light' : 'dark';
    try {
      localStorage.setItem('novatools_theme', themeMode);
    } catch {}

    if (themeMode === 'light') {
      doc.classList.add('light');
      doc.classList.remove('dark');
      doc.style.setProperty('background-color', '#ffffff', 'important');
      doc.style.setProperty('color-scheme', 'light', 'important');
    } else {
      doc.classList.add('dark');
      doc.classList.remove('light');
      doc.style.setProperty('background-color', '#070b14', 'important');
      doc.style.setProperty('color-scheme', 'dark', 'important');
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeMode === 'light' ? '#ffffff' : '#070b14');
    }

    if (settings.compactMode) {
      doc.classList.add('compact-mode');
    } else {
      doc.classList.remove('compact-mode');
    }

    if (settings.reducedMotion) {
      doc.classList.add('reduced-motion');
    } else {
      doc.classList.remove('reduced-motion');
    }

    if (settings.highContrast) {
      doc.classList.add('high-contrast');
    } else {
      doc.classList.remove('high-contrast');
    }

    doc.style.setProperty('--nova-accent', settings.accentColor);
  }, [settings]);

  // Persist Favorites
  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem('nova_v2_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  // Record Recent Tool
  const addRecent = (slug: string) => {
    if (!settings.keepHistory) return;
    const tool = TOOLS_BY_SLUG.get(slug);
    if (!tool) return;

    setRecentTools((prev) => {
      const filtered = prev.filter((item) => item.slug !== slug);
      const updated: RecentToolItem[] = [
        {
          slug: tool.slug,
          name: tool.name,
          suite: tool.suite,
          icon: tool.icon,
          lastUsed: Date.now(),
        },
        ...filtered,
      ].slice(0, 20); // Keep 20 most recent

      try {
        localStorage.setItem('nova_v2_recent', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearRecent = () => {
    setRecentTools([]);
    try {
      localStorage.removeItem('nova_v2_recent');
    } catch {}
  };

  // Add / Delete Workflow
  const addWorkflow = (wf: WorkflowDefinition) => {
    setWorkflows((prev) => {
      const next = [wf, ...prev];
      try {
        localStorage.setItem('nova_v2_workflows', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows((prev) => {
      const next = prev.filter((w) => w.id !== id);
      try {
        localStorage.setItem('nova_v2_workflows', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const installPwa = () => {
    if (pwaInstallPrompt) {
      pwaInstallPrompt.prompt();
      pwaInstallPrompt.userChoice.then(() => setPwaInstallPrompt(null));
    }
  };

  // Global Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NovaContext.Provider
      value={{
        settings,
        updateSettings,
        favorites,
        toggleFavorite,
        isFavorite,
        recentTools,
        addRecent,
        clearRecent,
        workflows,
        addWorkflow,
        deleteWorkflow,
        searchOpen,
        setSearchOpen,
        smartDropFile,
        setSmartDropFile,
        pwaInstallPrompt,
        installPwa,
        currentPath,
        navigate,
        sidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </NovaContext.Provider>
  );
};

export const useNova = () => {
  const context = useContext(NovaContext);
  if (!context) throw new Error('useNova must be used within a NovaProvider');
  return context;
};
