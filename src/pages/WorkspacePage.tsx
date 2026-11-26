import React, { useState, useEffect } from 'react';
import {
  FileText, CheckSquare, Plus, Trash2, Download, Copy, Check,
  Calculator, LayoutDashboard, Clipboard, FolderPlus, ArrowUp, ArrowDown,
  Eye, EyeOff, RotateCcw, Star, Edit3, Search, ArrowRight, AppWindow
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { useToast } from '../context/ToastContext';
import { copyToClipboard } from '../utils/clipboard';
import { evaluateSafeMath } from '../utils/safeMath';
import { TOOLS_BY_SLUG, TOOLS_DATA } from '../data/toolsData';
import { ClipboardSnippet, WorkspaceWidgetConfig } from '../types';

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

interface WorkspacePageProps {
  initialTab?: 'overview' | 'notes' | 'tasks' | 'vault' | 'collections' | 'calc';
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ initialTab = 'overview' }) => {
  const {
    triggerSound,
    favorites,
    recentTools,
    workflows,
    collections,
    addCollection,
    deleteCollection,
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
    navigate,
    openMiniApp,
    exportUserData,
  } = useNova();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'tasks' | 'vault' | 'collections' | 'calc'>(initialTab);
  const [copied, setCopied] = useState<string | null>(null);
  const [customizeWidgets, setCustomizeWidgets] = useState<boolean>(false);
  const [dragWidgetId, setDragWidgetId] = useState<WorkspaceWidgetConfig['id'] | null>(null);

  // 1. Notes State
  const [noteContent, setNoteContent] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('nova_workspace_note') ||
        '# My Quick Note\n\nUse this local scratchpad for notes, code snippets, or draft ideas.\n- Automatically saved in your browser\n- Zero server uploads\n- Export as Markdown anytime'
      );
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nova_workspace_note', noteContent);
    } catch {}
  }, [noteContent]);

  // 2. Tasks State
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const stored = localStorage.getItem('nova_workspace_tasks');
      return stored
        ? JSON.parse(stored)
        : [
            { id: '1', text: 'Compress project hero images', completed: false, priority: 'high', createdAt: Date.now() },
            { id: '2', text: 'Generate secure API secrets', completed: true, priority: 'medium', createdAt: Date.now() - 3600000 },
            { id: '3', text: 'Verify WCAG color contrast', completed: false, priority: 'low', createdAt: Date.now() - 7200000 },
          ];
    } catch {
      return [];
    }
  });

  const [newTaskText, setNewTaskText] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    try {
      localStorage.setItem('nova_workspace_tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // 3. Clipboard Vault State
  const [snipTitle, setSnipTitle] = useState<string>('');
  const [snipContent, setSnipContent] = useState<string>('');
  const [snipCategory, setSnipCategory] = useState<ClipboardSnippet['category']>('Code');
  const [snipSearch, setSnipSearch] = useState<string>('');
  const [snipFilterCat, setSnipFilterCat] = useState<string>('All');
  const [editingSnipId, setEditingSnipId] = useState<string | null>(null);
  const [confirmClearSnips, setConfirmClearSnips] = useState<boolean>(false);

  // 4. Collections State
  const [colName, setColName] = useState<string>('');
  const [colDesc, setColDesc] = useState<string>('');
  const [colSlugs, setColSlugs] = useState<string[]>([]);

  // 5. Calculation Scratchpad
  const [calcInput, setCalcInput] = useState<string>('24 * 365 * 60');
  const [calcHistory, setCalcHistory] = useState<Array<{ expr: string; res: string }>>([
    { expr: '1024 * 768', res: '786,432' },
    { expr: '150000 * 0.18', res: '27,000' },
  ]);

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      priority: newTaskPriority,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText('');
    triggerSound('click');
  };

  const evaluateCalc = () => {
    const evalRes = evaluateSafeMath(calcInput);
    if (evalRes.error || evalRes.result === undefined) {
      setCalcHistory([{ expr: calcInput, res: 'Error' }, ...calcHistory.slice(0, 9)]);
    } else {
      setCalcHistory([{ expr: calcInput, res: evalRes.result.toLocaleString() }, ...calcHistory.slice(0, 9)]);
      triggerSound('success');
    }
  };

  const handleSaveSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snipContent.trim()) return;

    if (editingSnipId) {
      updateSnippet(editingSnipId, {
        title: snipTitle.trim() || 'Untitled Snippet',
        content: snipContent,
        category: snipCategory,
      });
      setEditingSnipId(null);
      setSnipTitle('');
      setSnipContent('');
      showToast('Snippet updated.', 'success');
      return;
    }

    const res = addSnippet({
      title: snipTitle.trim() || `Snippet (${snipCategory})`,
      content: snipContent,
      category: snipCategory,
      favorite: false,
    });
    if (res.duplicate) {
      showToast('Identical snippet already exists in Clipboard Vault.', 'info');
      return;
    }
    setSnipTitle('');
    setSnipContent('');
    triggerSound('success');
    showToast('Snippet saved to browser-local Vault.', 'success');
  };

  const filteredSnippets = snippets.filter((s) => {
    if (snipFilterCat !== 'All' && s.category !== snipFilterCat) return false;
    const q = snipSearch.trim().toLowerCase();
    if (!q) return true;
    return s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q);
  });

  const handleCopyText = (id: string, text: string) => {
    copyToClipboard(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  const renderWidget = (widget: WorkspaceWidgetConfig) => {
    if (!widget.visible) return null;

    switch (widget.id) {
      case 'welcome':
        return (
          <div key={widget.id} className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">Personal Workspace</span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">One Space. Ready to Work.</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize widget visibility and order, manage saved snippets, or launch floating Mini Apps.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button type="button" onClick={() => openMiniApp('calculator')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:border-cyan-500">
                <AppWindow className="w-3.5 h-3.5 text-cyan-500" /> Mini Apps
              </button>
              <button type="button" onClick={exportUserData} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold">
                <Download className="w-3.5 h-3.5" /> Export Backup
              </button>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div key={widget.id} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <span className="text-[11px] font-semibold text-slate-500 block">Favorites</span>
              <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">{favorites.length}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <span className="text-[11px] font-semibold text-slate-500 block">Recent Tools</span>
              <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">{recentTools.length}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <span className="text-[11px] font-semibold text-slate-500 block">Saved Snippets</span>
              <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">{snippets.length}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <span className="text-[11px] font-semibold text-slate-500 block">Open Tasks</span>
              <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">{tasks.filter((t) => !t.completed).length}</span>
            </div>
          </div>
        );

      case 'quick-launch':
        return (
          <div key={widget.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Quick Launch Studios</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
              {[
                { label: 'File Studio', path: '/file-studio' },
                { label: 'Developer Lab', path: '/developer-lab' },
                { label: 'Design Studio', path: '/design-studio' },
                { label: 'QR Studio', path: '/qr-studio' },
                { label: 'NOVA Focus', path: '/focus' },
                { label: 'Learning Hub', path: '/learning-hub' },
              ].map((st) => (
                <button
                  key={st.path}
                  type="button"
                  onClick={() => navigate(st.path)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-cyan-500 font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span className="truncate">{st.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div key={widget.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pinned Favorites ({favorites.length})</h2>
              <button type="button" onClick={() => navigate('/favorites')} className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">Manage</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {favorites.slice(0, 8).map((slug) => {
                const t = TOOLS_BY_SLUG.get(slug);
                if (!t) return null;
                return (
                  <button key={slug} type="button" onClick={() => navigate(`/tools/${slug}`)} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:border-amber-500/50 text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{t.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{t.suite}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'recent':
        return (
          <div key={widget.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recently Used</h2>
              <button type="button" onClick={() => navigate('/recent')} className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">View All</button>
            </div>
            {recentTools.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {recentTools.slice(0, 4).map((r) => (
                  <button key={r.slug} type="button" onClick={() => navigate(`/tools/${r.slug}`)} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:border-violet-500/50 text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{r.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{r.suite}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Open any tool to record your recent activity here.</p>
            )}
          </div>
        );

      case 'collections':
        return (
          <div key={widget.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Saved Collections ({collections.length})</h2>
              <button type="button" onClick={() => setActiveTab('collections')} className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">Create / Edit</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {collections.map((col) => (
                <div key={col.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{col.name}</span>
                    <span className="text-[10px] font-mono tabular-nums text-slate-400">{col.toolSlugs.length} tools</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {col.toolSlugs.map((slug) => {
                      const t = TOOLS_BY_SLUG.get(slug);
                      return (
                        <button key={slug} type="button" onClick={() => navigate(`/tools/${slug}`)} className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold hover:border-cyan-500">
                          {t?.name || slug}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'workflows':
        return (
          <div key={widget.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Pipelines ({workflows.length})</h2>
              <button type="button" onClick={() => navigate('/workflows')} className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">Open NOVA Flow</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {workflows.slice(0, 4).map((wf) => (
                <button key={wf.id} type="button" onClick={() => navigate('/workflows')} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-left hover:border-cyan-500">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{wf.title}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{wf.steps.map((s) => s.name).join(' → ')}</span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">NOVA Workspace</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Dashboard, Clipboard Vault & Notes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Customizable browser-local workspace with modular widgets, snippets vault, collections, tasks, and math scratchpad.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar self-start sm:self-center">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'vault', label: `Vault (${snippets.length})`, icon: Clipboard },
            { id: 'collections', label: 'Collections', icon: FolderPlus },
            { id: 'notes', label: 'Notes', icon: FileText },
            { id: 'tasks', label: `Tasks (${tasks.filter((t) => !t.completed).length})`, icon: CheckSquare },
            { id: 'calc', label: 'Scratchpad', icon: Calculator },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-violet-500" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 0. OVERVIEW WIDGETS TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {widgetLayout.filter((w) => w.visible).length} of {widgetLayout.length} widgets visible
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCustomizeWidgets((v) => !v)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                {customizeWidgets ? 'Done Customizing' : 'Customize Widgets'}
              </button>
              {customizeWidgets && (
                <button
                  type="button"
                  onClick={resetWidgetLayout}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-rose-500"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Layout
                </button>
              )}
            </div>
          </div>

          {customizeWidgets && (
            <div className="p-4 rounded-2xl border border-violet-500/30 bg-violet-500/5 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Drag widgets or use arrow controls to reorder and toggle visibility
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {widgetLayout.map((w, idx) => (
                  <div
                    key={w.id}
                    draggable
                    onDragStart={() => setDragWidgetId(w.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragWidgetId) reorderWidgets(dragWidgetId, w.id);
                      setDragWidgetId(null);
                    }}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-move"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{w.label}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => moveWidget(w.id, 'up')} disabled={idx === 0} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label={`Move ${w.label} up`}>
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => moveWidget(w.id, 'down')} disabled={idx === widgetLayout.length - 1} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label={`Move ${w.label} down`}>
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => toggleWidgetVisibility(w.id)} className="p-1 text-slate-500 hover:text-violet-500" aria-label={`Toggle ${w.label}`}>
                        {w.visible ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">{widgetLayout.map((w) => renderWidget(w))}</div>
        </div>
      )}

      {/* 1. CLIPBOARD VAULT TAB */}
      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveSnippet} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3 h-fit">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingSnipId ? 'Edit Snippet' : 'Save New Snippet'}
            </h2>
            <p className="text-[11px] text-slate-500">Manual save only — zero background clipboard surveillance.</p>
            <input
              type="text"
              value={snipTitle}
              onChange={(e) => setSnipTitle(e.target.value)}
              placeholder="Title (e.g. Deploy command, Bio...)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
            />
            <select
              value={snipCategory}
              onChange={(e) => setSnipCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
            >
              <option value="Code">Code</option>
              <option value="Text">Text</option>
              <option value="Links">Links</option>
              <option value="Prompts">Prompts</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              required
              rows={5}
              value={snipContent}
              onChange={(e) => setSnipContent(e.target.value)}
              placeholder="Paste snippet content..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold">
                {editingSnipId ? 'Update Snippet' : 'Save Snippet'}
              </button>
              {editingSnipId && (
                <button type="button" onClick={() => { setEditingSnipId(null); setSnipTitle(''); setSnipContent(''); }} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={snipSearch}
                  onChange={(e) => setSnipSearch(e.target.value)}
                  placeholder="Search snippets..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Code', 'Text', 'Links', 'Prompts', 'Other'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSnipFilterCat(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                      snipFilterCat === cat ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(snippets, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'nova-clipboard-vault.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Export JSON
                </button>
                <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 font-semibold cursor-pointer">
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      f.text().then((txt) => {
                        try {
                          const parsed = JSON.parse(txt);
                          const count = importSnippets(Array.isArray(parsed) ? parsed : []);
                          showToast(`Imported ${count} new unique snippet(s).`, 'success');
                        } catch {
                          showToast('Invalid JSON snippets file.', 'error');
                        }
                      });
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {snippets.length > 0 && (
                confirmClearSnips ? (
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => { clearSnippets(); setConfirmClearSnips(false); }} className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold">
                      Confirm Clear
                    </button>
                    <button type="button" onClick={() => setConfirmClearSnips(false)} className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmClearSnips(true)} className="text-rose-500 font-semibold hover:underline">
                    Clear All Snippets
                  </button>
                )
              )}
            </div>

            <div className="space-y-3">
              {filteredSnippets.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.title}</span>
                      <span className="text-[10px] font-semibold text-violet-500">· {s.category}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => updateSnippet(s.id, { favorite: !s.favorite })} className="p-1 text-slate-400 hover:text-amber-500">
                        <Star className={`w-3.5 h-3.5 ${s.favorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                      <button type="button" onClick={() => { setEditingSnipId(s.id); setSnipTitle(s.title); setSnipContent(s.content); setSnipCategory(s.category); }} className="p-1 text-slate-400 hover:text-cyan-500">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => handleCopyText(s.id, s.content)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                        {copied === s.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copied === s.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button type="button" onClick={() => deleteSnippet(s.id)} className="p-1 text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <pre className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap">
                    {s.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. COLLECTIONS TAB */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!colName.trim() || colSlugs.length === 0) return;
              addCollection(colName, colDesc, colSlugs);
              setColName('');
              setColDesc('');
              setColSlugs([]);
              showToast('Collection created!', 'success');
            }}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3 h-fit text-xs"
          >
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Create Custom Tool Collection</h2>
            <input type="text" required value={colName} onChange={(e) => setColName(e.target.value)} placeholder="Collection Name" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
            <input type="text" value={colDesc} onChange={(e) => setColDesc(e.target.value)} placeholder="Short description" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
            <div className="max-h-48 overflow-y-auto grid grid-cols-2 gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              {TOOLS_DATA.slice(0, 40).map((t) => {
                const picked = colSlugs.includes(t.slug);
                return (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => setColSlugs((prev) => (picked ? prev.filter((s) => s !== t.slug) : [...prev, t.slug]))}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold truncate text-left ${
                      picked ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
            <button type="submit" disabled={!colName.trim() || colSlugs.length === 0} className="w-full py-2.5 rounded-xl bg-violet-600 text-white font-bold">
              Save Collection ({colSlugs.length} selected)
            </button>
          </form>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
            {collections.map((col) => (
              <div key={col.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{col.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{col.description}</p>
                  </div>
                  <button type="button" onClick={() => deleteCollection(col.id)} className="p-1 text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {col.toolSlugs.map((slug) => {
                    const t = TOOLS_BY_SLUG.get(slug);
                    return (
                      <button key={slug} type="button" onClick={() => navigate(`/tools/${slug}`)} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:text-cyan-500">
                        {t?.name || slug}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. NOTES TAB */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono tabular-nums">
              {noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0} words · {noteContent.length} chars · Auto-saved locally
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => handleCopyText('note', noteContent)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                {copied === 'note' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'note' ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([noteContent], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `nova-notes-${new Date().toISOString().slice(0, 10)}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .MD</span>
              </button>
            </div>
          </div>

          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Type your notes, drafts, or code snippets..."
            className="w-full h-[420px] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 font-mono text-sm text-slate-900 dark:text-slate-100 resize-y leading-relaxed"
          />
        </div>
      )}

      {/* 4. TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task or reminder..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
            <div className="flex items-center gap-2">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="button" onClick={addTask} className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    task.completed
                      ? 'border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/20 opacity-60'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))}>
                    <input type="checkbox" checked={task.completed} onChange={() => {}} className="w-4 h-4 rounded text-cyan-600 cursor-pointer" />
                    <span className={`text-sm truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white font-medium'}`}>
                      {task.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold uppercase text-slate-400">{task.priority}</span>
                    <button type="button" onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))} className="p-1 text-slate-400 hover:text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <CheckSquare className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs">No tasks active. All clear!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. CALC SCRATCHPAD */}
      {activeTab === 'calc' && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
            <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Math Expression Evaluator</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && evaluateCalc()}
                placeholder="e.g. (45 * 12) + (180 / 4)"
                className="flex-1 font-mono text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800"
              />
              <button type="button" onClick={evaluateCalc} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0">
                Evaluate
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {calcHistory.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 font-mono text-xs tabular-nums">
                <span className="text-slate-500 truncate mr-3">{h.expr}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">= {h.res}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
