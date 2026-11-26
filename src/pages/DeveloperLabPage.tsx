import React, { useState } from 'react';
import {
  Code2, FileJson, FileText, Regex, Minimize2, KeyRound, Binary, ShieldCheck
} from 'lucide-react';
import { DeveloperTools } from '../tools/developerTools';

type LabTab =
  | 'code-playground'
  | 'json-formatter'
  | 'markdown-preview'
  | 'regex-tester'
  | 'code-minifier'
  | 'jwt-decoder'
  | 'file-inspector';

const LAB_TABS: { id: LabTab; label: string; icon: React.ElementType }[] = [
  { id: 'code-playground', label: 'HTML / CSS / JS Sandbox', icon: Code2 },
  { id: 'json-formatter', label: 'JSON Editor', icon: FileJson },
  { id: 'markdown-preview', label: 'Markdown Studio', icon: FileText },
  { id: 'regex-tester', label: 'Regex Tester', icon: Regex },
  { id: 'code-minifier', label: 'Code Formatter', icon: Minimize2 },
  { id: 'jwt-decoder', label: 'JWT Inspector', icon: KeyRound },
  { id: 'file-inspector', label: 'Hex & Checksums', icon: Binary },
];

export const DeveloperLabPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<LabTab>('code-playground');

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            NOVA Developer Lab
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Sandboxed Code & Payload Workbench
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Switch seamlessly between live HTML/CSS/JS execution, JSON parsing, Regex testing, JWT decoding, and Hex file checksums.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Sandboxed iframe execution</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/70 overflow-x-auto no-scrollbar">
        {LAB_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTool(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tool Panel */}
      <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xs">
        <DeveloperTools toolSlug={activeTool} />
      </div>
    </div>
  );
};
