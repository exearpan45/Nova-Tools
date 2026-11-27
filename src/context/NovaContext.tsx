import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserSettings,
  ToolSuite,
  RecentToolItem,
  WorkflowDefinition,
  ClipboardSnippet,
  ToolCollection,
  WorkspaceWidgetConfig,
  FocusSessionRecord,
  NotificationItem,
  MiniAppId,
} from '../types';
import { DEFAULT_WORKFLOWS } from '../data/workflowsData';
import { TOOLS_BY_SLUG } from '../data/toolsData';
import { playSound } from '../utils/soundEffects';
import { trackFavoriteToggled } from '../utils/analytics';

export const DEFAULT_WIDGET_LAYOUT: WorkspaceWidgetConfig[] = [
  { id: 'welcome', label: 'Welcome Overview', visible: true },
  { id: 'stats', label: 'Productivity Metrics', visible: true },
  { id: 'quick-launch', label: 'Ecosystem Studios', visible: true },
  { id: 'favorites', label: 'Pinned Favorites', visible: true },
  { id: 'recent', label: 'Recently Used Tools', visible: true },
  { id: 'collections', label: 'Custom Collections', visible: true },
  { id: 'workflows', label: 'Saved Pipelines', visible: true },
];

const DEFAULT_COLLECTIONS: ToolCollection[] = [
  {
    id: 'col-web-dev',
    name: 'Frontend & API Kit',
    description: 'Daily utilities for formatting payloads, testing regex, and inspecting tokens.',
    toolSlugs: ['json-formatter', 'jwt-decoder', 'regex-tester', 'code-playground'],
    createdAt: 1700000000000,
  },
  {
    id: 'col-media',
    name: 'Creator Media Pack',
    description: 'Optimize photos, convert formats, and build brand color palettes.',
    toolSlugs: ['image-compressor', 'image-resizer', 'gradient-generator', 'qr-generator'],
    createdAt: 1700000001000,
  },
];

const DEFAULT_SNIPPETS: ClipboardSnippet[] = [
  {
    id: 'snip-1',
    title: 'Flexbox Center Utility',
    content: 'display: flex;\nalign-items: center;\njustify-content: center;',
    category: 'Code',
    favorite: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'snip-2',
    title: 'Standard MIT License Header',
    content: 'Permission is hereby granted, free of charge, to any person obtaining a copy of this software...',
    category: 'Text',
    favorite: false,
    createdAt: 1700000001000,
    updatedAt: 1700000001000,
  },
];

interface NovaContextType {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  clearFavorites: () => void;
  recentTools: RecentToolItem[];
  addRecent: (slug: string) => void;
  clearRecent: () => void;
  workflows: WorkflowDefinition[];
  addWorkflow: (wf: WorkflowDefinition) => void;
  deleteWorkflow: (id: string) => void;
  collections: ToolCollection[];
  addCollection: (name: string, description: string, toolSlugs: string[]) => void;
  deleteCollection: (id: string) => void;
  toggleToolInCollection: (collectionId: string, slug: string) => void;
  snippets: ClipboardSnippet[];
  addSnippet: (snippet: Omit<ClipboardSnippet, 'id' | 'createdAt' | 'updatedAt'>) => { added: boolean; duplicate: boolean };
  updateSnippet: (id: string, patch: Partial<ClipboardSnippet>) => void;
  deleteSnippet: (id: string) => void;
  clearSnippets: () => void;
  importSnippets: (list: ClipboardSnippet[]) => number;
  widgetLayout: WorkspaceWidgetConfig[];
  toggleWidgetVisibility: (id: WorkspaceWidgetConfig['id']) => void;
  moveWidget: (id: WorkspaceWidgetConfig['id'], direction: 'up' | 'down') => void;
  reorderWidgets: (sourceId: WorkspaceWidgetConfig['id'], targetId: WorkspaceWidgetConfig['id']) => void;
  resetWidgetLayout: () => void;
  focusSessions: FocusSessionRecord[];
  addFocusSession: (session: Omit<FocusSessionRecord, 'id'>) => void;
  clearFocusSessions: () => void;
  recentSearches: string[];
  recordSearchQuery: (q: string) => void;
  clearRecentSearches: () => void;
  notifications: NotificationItem[];
  pushNotification: (title: string, message: string, type?: 'info' | 'success' | 'error') => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  openMiniApps: MiniAppId[];
  openMiniApp: (id: MiniAppId) => void;
  closeMiniApp: (id: MiniAppId) => void;
  tourOpen: boolean;
  setTourOpen: (open: boolean) => void;
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
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
  exportUserData: () => void;
  importUserData: (jsonString: string) => { success: boolean; message: string };
  triggerSound: (type: 'click' | 'success' | 'delete' | 'chime' | 'beep') => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  accentColor: '#06b6d4',
  animations: true,
  compactMode: false,
  defaultSuite: 'all',
  autoDownload: false,
  keepHistory: true,
  confirmBeforeClearing: true,
  reducedMotion: false,
  highContrast: false,
  soundEffects: false,
};

const NovaContext = createContext<NovaContextType | undefined>(undefined);

export const NovaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname + window.location.search + window.location.hash;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_settings');
      const directTheme = localStorage.getItem('novatools_theme');
      const parsed = stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
      if (!stored && (directTheme === 'light' || directTheme === 'dark')) {
        parsed.theme = directTheme;
      }
      if (!['dark', 'light', 'system'].includes(parsed.theme)) parsed.theme = 'system';
      return parsed;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_favorites');
      return stored
        ? JSON.parse(stored)
        : [
            'image-compressor',
            'pdf-merger',
            'word-counter',
            'json-formatter',
            'percentage-calculator',
            'qr-generator',
            'password-generator',
            'unit-converter',
          ];
    } catch {
      return [];
    }
  });

  const [recentTools, setRecentTools] = useState<RecentToolItem[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_recent');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_workflows');
      return stored ? JSON.parse(stored) : DEFAULT_WORKFLOWS;
    } catch {
      return DEFAULT_WORKFLOWS;
    }
  });

  const [collections, setCollections] = useState<ToolCollection[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_collections');
      return stored ? JSON.parse(stored) : DEFAULT_COLLECTIONS;
    } catch {
      return DEFAULT_COLLECTIONS;
    }
  });

  const [snippets, setSnippets] = useState<ClipboardSnippet[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_snippets');
      return stored ? JSON.parse(stored) : DEFAULT_SNIPPETS;
    } catch {
      return DEFAULT_SNIPPETS;
    }
  });

  const [widgetLayout, setWidgetLayout] = useState<WorkspaceWidgetConfig[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_widgets');
      if (stored) {
        const parsed = JSON.parse(stored) as WorkspaceWidgetConfig[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((w) => w.id));
          const missing = DEFAULT_WIDGET_LAYOUT.filter((w) => !existingIds.has(w.id));
          return [...parsed, ...missing];
        }
      }
      return DEFAULT_WIDGET_LAYOUT;
    } catch {
      return DEFAULT_WIDGET_LAYOUT;
    }
  });

  const [focusSessions, setFocusSessions] = useState<FocusSessionRecord[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_focus_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nova_v2_recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-welcome',
      title: 'NOVA Tools 2.0 Ready',
      message: 'All 107 tools and ecosystem studios run locally in your browser with zero server uploads.',
      type: 'info',
      timestamp: Date.now(),
      read: true,
    },
  ]);

  const [openMiniApps, setOpenMiniApps] = useState<MiniAppId[]>([]);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [tourOpen, setTourOpen] = useState<boolean>(false);
  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [smartDropFile, setSmartDropFile] = useState<File | null>(null);
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);

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

  useEffect(() => {
    try {
      localStorage.setItem('nova_v2_settings', JSON.stringify(settings));
    } catch {}

    const doc = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const themeMode = settings.theme === 'system'
        ? (media.matches ? 'dark' : 'light')
        : settings.theme;
      doc.classList.toggle('dark', themeMode === 'dark');
      doc.classList.toggle('light', themeMode === 'light');
      doc.style.setProperty('background-color', themeMode === 'light' ? '#f8fafc' : '#080D1C', 'important');
      doc.style.setProperty('color-scheme', themeMode, 'important');
      try { localStorage.setItem('novatools_theme', themeMode); } catch {}
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) metaThemeColor.setAttribute('content', themeMode === 'light' ? '#f8fafc' : '#080D1C');
    };
    applyTheme();
    if (settings.theme === 'system') media.addEventListener('change', applyTheme);

    doc.classList.toggle('compact-mode', !!settings.compactMode);
    doc.classList.toggle('reduced-motion', !!settings.reducedMotion);
    doc.classList.toggle('high-contrast', !!settings.highContrast);
    doc.style.setProperty('--nova-accent', settings.accentColor);
    return () => media.removeEventListener('change', applyTheme);
  }, [settings]);

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      trackFavoriteToggled(slug, !exists);
      try {
        localStorage.setItem('nova_v2_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.setItem('nova_v2_favorites', JSON.stringify([]));
    } catch {}
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

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
      ].slice(0, 20);

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

  const addCollection = (name: string, description: string, toolSlugs: string[]) => {
    const newCol: ToolCollection = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom curated collection',
      toolSlugs: Array.from(new Set(toolSlugs)),
      createdAt: Date.now(),
    };
    setCollections((prev) => {
      const next = [newCol, ...prev];
      try {
        localStorage.setItem('nova_v2_collections', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('nova_v2_collections', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleToolInCollection = (collectionId: string, slug: string) => {
    setCollections((prev) => {
      const next = prev.map((c) => {
        if (c.id !== collectionId) return c;
        const exists = c.toolSlugs.includes(slug);
        return {
          ...c,
          toolSlugs: exists ? c.toolSlugs.filter((s) => s !== slug) : [...c.toolSlugs, slug],
        };
      });
      try {
        localStorage.setItem('nova_v2_collections', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addSnippet = (
    snippet: Omit<ClipboardSnippet, 'id' | 'createdAt' | 'updatedAt'>
  ): { added: boolean; duplicate: boolean } => {
    const normalized = snippet.content.trim();
    const isDuplicate = snippets.some((s) => s.content.trim() === normalized);
    if (isDuplicate) {
      return { added: false, duplicate: true };
    }
    const item: ClipboardSnippet = {
      ...snippet,
      id: `snip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSnippets((prev) => {
      const next = [item, ...prev];
      try {
        localStorage.setItem('nova_v2_snippets', JSON.stringify(next));
      } catch {}
      return next;
    });
    return { added: true, duplicate: false };
  };

  const updateSnippet = (id: string, patch: Partial<ClipboardSnippet>) => {
    setSnippets((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: Date.now() } : s));
      try {
        localStorage.setItem('nova_v2_snippets', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const deleteSnippet = (id: string) => {
    setSnippets((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('nova_v2_snippets', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearSnippets = () => {
    setSnippets([]);
    try {
      localStorage.setItem('nova_v2_snippets', JSON.stringify([]));
    } catch {}
  };

  const importSnippets = (list: ClipboardSnippet[]): number => {
    const existingSet = new Set(snippets.map((s) => s.content.trim()));
    const valid = list.filter(
      (item) => item && typeof item.content === 'string' && item.content.trim() && !existingSet.has(item.content.trim())
    );
    if (valid.length === 0) return 0;
    const sanitized = valid.map((item) => ({
      id: `snip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : 'Imported Snippet',
      content: item.content,
      category: (['Code', 'Text', 'Links', 'Prompts', 'Other'].includes(item.category)
        ? item.category
        : 'Other') as ClipboardSnippet['category'],
      favorite: !!item.favorite,
      createdAt: item.createdAt || Date.now(),
      updatedAt: Date.now(),
    }));
    setSnippets((prev) => {
      const next = [...sanitized, ...prev];
      try {
        localStorage.setItem('nova_v2_snippets', JSON.stringify(next));
      } catch {}
      return next;
    });
    return sanitized.length;
  };

  const persistWidgets = (next: WorkspaceWidgetConfig[]) => {
    try {
      localStorage.setItem('nova_v2_widgets', JSON.stringify(next));
    } catch {}
  };

  const toggleWidgetVisibility = (id: WorkspaceWidgetConfig['id']) => {
    setWidgetLayout((prev) => {
      const next = prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w));
      persistWidgets(next);
      return next;
    });
  };

  const moveWidget = (id: WorkspaceWidgetConfig['id'], direction: 'up' | 'down') => {
    setWidgetLayout((prev) => {
      const idx = prev.findIndex((w) => w.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, moved);
      persistWidgets(copy);
      return copy;
    });
  };

  const reorderWidgets = (sourceId: WorkspaceWidgetConfig['id'], targetId: WorkspaceWidgetConfig['id']) => {
    if (sourceId === targetId) return;
    setWidgetLayout((prev) => {
      const fromIdx = prev.findIndex((w) => w.id === sourceId);
      const toIdx = prev.findIndex((w) => w.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      persistWidgets(copy);
      return copy;
    });
  };

  const resetWidgetLayout = () => {
    setWidgetLayout(DEFAULT_WIDGET_LAYOUT);
    persistWidgets(DEFAULT_WIDGET_LAYOUT);
  };

  const addFocusSession = (session: Omit<FocusSessionRecord, 'id'>) => {
    const entry: FocusSessionRecord = {
      ...session,
      id: `focus-${Date.now()}`,
    };
    setFocusSessions((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      try {
        localStorage.setItem('nova_v2_focus_sessions', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearFocusSessions = () => {
    setFocusSessions([]);
    try {
      localStorage.removeItem('nova_v2_focus_sessions');
    } catch {}
  };

  const recordSearchQuery = (q: string) => {
    const cleaned = q.trim();
    if (cleaned.length < 2) return;
    setRecentSearches((prev) => {
      const next = [cleaned, ...prev.filter((item) => item.toLowerCase() !== cleaned.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('nova_v2_recent_searches', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('nova_v2_recent_searches');
    } catch {}
  };

  const pushNotification = (title: string, message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [item, ...prev].slice(0, 25));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const openMiniApp = (id: MiniAppId) => {
    setOpenMiniApps((prev) => (prev.includes(id) ? [...prev.filter((x) => x !== id), id] : [...prev, id]));
  };

  const closeMiniApp = (id: MiniAppId) => {
    setOpenMiniApps((prev) => prev.filter((x) => x !== id));
  };

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

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

  const triggerSound = (type: 'click' | 'success' | 'delete' | 'chime' | 'beep') => {
    if (settings.soundEffects) {
      playSound(type);
    }
  };

  const exportUserData = () => {
    try {
      const data = {
        app: 'NOVA TOOLS',
        version: '2.2.0',
        exportedAt: new Date().toISOString(),
        favorites,
        recentTools,
        settings,
        workflows,
        collections,
        snippets,
        widgetLayout,
        focusSessions,
        workspaceNote: localStorage.getItem('nova_workspace_note') || '',
        workspaceTasks: JSON.parse(localStorage.getItem('nova_workspace_tasks') || '[]'),
      };
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nova-tools-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerSound('success');
      pushNotification('Backup Exported', 'Your workspace settings, favorites, and snippets were saved to JSON.', 'success');
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const importUserData = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid backup format. Expected JSON object.' };
      }

      let restoredCount = 0;
      if (Array.isArray(parsed.favorites)) {
        setFavorites(parsed.favorites);
        localStorage.setItem('nova_v2_favorites', JSON.stringify(parsed.favorites));
        restoredCount += parsed.favorites.length;
      }
      if (Array.isArray(parsed.recentTools)) {
        setRecentTools(parsed.recentTools);
        localStorage.setItem('nova_v2_recent', JSON.stringify(parsed.recentTools));
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        const mergedSettings = { ...settings, ...parsed.settings };
        setSettings(mergedSettings);
        localStorage.setItem('nova_v2_settings', JSON.stringify(mergedSettings));
      }
      if (Array.isArray(parsed.workflows)) {
        setWorkflows(parsed.workflows);
        localStorage.setItem('nova_v2_workflows', JSON.stringify(parsed.workflows));
      }
      if (Array.isArray(parsed.collections)) {
        setCollections(parsed.collections);
        localStorage.setItem('nova_v2_collections', JSON.stringify(parsed.collections));
      }
      if (Array.isArray(parsed.snippets)) {
        setSnippets(parsed.snippets);
        localStorage.setItem('nova_v2_snippets', JSON.stringify(parsed.snippets));
      }
      if (Array.isArray(parsed.widgetLayout)) {
        setWidgetLayout(parsed.widgetLayout);
        localStorage.setItem('nova_v2_widgets', JSON.stringify(parsed.widgetLayout));
      }
      if (Array.isArray(parsed.focusSessions)) {
        setFocusSessions(parsed.focusSessions);
        localStorage.setItem('nova_v2_focus_sessions', JSON.stringify(parsed.focusSessions));
      }
      if (typeof parsed.workspaceNote === 'string') {
        localStorage.setItem('nova_workspace_note', parsed.workspaceNote);
      }
      if (Array.isArray(parsed.workspaceTasks)) {
        localStorage.setItem('nova_workspace_tasks', JSON.stringify(parsed.workspaceTasks));
      }

      triggerSound('success');
      pushNotification('Backup Restored', `Restored ${restoredCount} favorites and workspace items.`, 'success');
      return { success: true, message: `Successfully restored ${restoredCount} favorites and workspace data!` };
    } catch {
      return { success: false, message: 'Failed to parse JSON backup file.' };
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setShortcutsOpen(false);
        setNotificationsOpen(false);
        setTourOpen(false);
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
        clearFavorites,
        recentTools,
        addRecent,
        clearRecent,
        workflows,
        addWorkflow,
        deleteWorkflow,
        collections,
        addCollection,
        deleteCollection,
        toggleToolInCollection,
        snippets,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        clearSnippets,
        importSnippets,
        widgetLayout,
        toggleWidgetVisibility,
        moveWidget,
        reorderWidgets,
        resetWidgetLayout,
        focusSessions,
        addFocusSession,
        clearFocusSessions,
        recentSearches,
        recordSearchQuery,
        clearRecentSearches,
        notifications,
        pushNotification,
        markAllNotificationsRead,
        dismissNotification,
        clearNotifications,
        openMiniApps,
        openMiniApp,
        closeMiniApp,
        tourOpen,
        setTourOpen,
        shortcutsOpen,
        setShortcutsOpen,
        notificationsOpen,
        setNotificationsOpen,
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
        exportUserData,
        importUserData,
        triggerSound,
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
