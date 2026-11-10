import React, { useState, useEffect } from 'react';
import {
  FileText, CheckSquare, Plus, Trash2, Download, Copy, Check,
  Save, Sparkles, AlertCircle, ArrowUpRight, Calculator
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { copyToClipboard } from '../utils/clipboard';

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export const WorkspacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'calc'>('notes');
  const [copied, setCopied] = useState<boolean>(false);

  // 1. Notes State
  const [noteContent, setNoteContent] = useState<string>(() => {
    try {
      return localStorage.getItem('nova_workspace_note') || '# My Quick Note\n\nUse this local scratchpad for notes, code snippets, or draft ideas.\n- Automatically saved in your browser\n- Zero server uploads\n- Export as Markdown anytime';
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
      return stored ? JSON.parse(stored) : [
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
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  // 3. Quick Calculation Scratchpad
  const [calcInput, setCalcInput] = useState<string>('24 * 365 * 60');
  const [calcHistory, setCalcHistory] = useState<Array<{ expr: string; res: string }>>([
    { expr: '1024 * 768', res: '786,432' },
    { expr: '150000 * 0.18', res: '27,000' },
  ]);

  const evaluateCalc = () => {
    try {
      const cleaned = calcInput.replace(/[^0-9+\-*/().%\s]/g, '');
      // Safe math eval with Function constructor on sanitized input
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${cleaned})`)();
      const resStr = Number(result).toLocaleString();
      setCalcHistory([{ expr: calcInput, res: resStr }, ...calcHistory.slice(0, 9)]);
    } catch {
      setCalcHistory([{ expr: calcInput, res: 'Error' }, ...calcHistory.slice(0, 9)]);
    }
  };

  const handleCopyNote = () => {
    copyToClipboard(noteContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadNote = () => {
    const blob = new Blob([noteContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-notes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0;
  const charCount = noteContent.length;

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NOVA WORKSPACE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Personal Notes & Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A private browser-local scratchpad for tasks, code snippets, and quick calculations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-violet-500" />
            <span>Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tasks'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-cyan-500" />
            <span>Tasks ({tasks.filter((t) => !t.completed).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'calc'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-500" />
            <span>Scratchpad</span>
          </button>
        </div>
      </div>

      {/* 1. NOTES TAB */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">
              {wordCount} words · {charCount} chars · Auto-saved locally
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyNote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-violet-500 text-xs font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={downloadNote}
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
            className="w-full h-[450px] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 font-mono text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 shadow-inner resize-y leading-relaxed"
          />
        </div>
      )}

      {/* 2. TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* New Task Input Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task or reminder..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
            <div className="flex items-center gap-2">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={addTask}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-2 pt-2">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    task.completed
                      ? 'border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/20 opacity-60'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                    />
                    <span
                      className={`text-sm truncate ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white font-medium'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        task.priority === 'high'
                          ? 'bg-rose-500/10 text-rose-500'
                          : task.priority === 'medium'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-slate-500/10 text-slate-500'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete task"
                    >
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

          {tasks.some((t) => t.completed) && (
            <div className="flex justify-end pt-2">
              <button
                onClick={clearCompletedTasks}
                className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors"
              >
                Clear completed tasks
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. CALC SCRATCHPAD */}
      {activeTab === 'calc' && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
              Math Expression Evaluator
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && evaluateCalc()}
                placeholder="e.g. (45 * 12) + (180 / 4)"
                className="flex-1 font-mono text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <button
                onClick={evaluateCalc}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0"
              >
                Evaluate
              </button>
            </div>
          </div>

          {/* History */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Calculation History
            </span>
            {calcHistory.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 font-mono text-xs"
              >
                <span className="text-slate-500 dark:text-slate-400 truncate mr-3">{h.expr}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">= {h.res}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
