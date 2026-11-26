import React, { useState, useMemo } from 'react';
import {
  BookOpen, Search, Copy, Check, ArrowRight, Calculator, Atom, Keyboard, Code2
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { copyToClipboard } from '../utils/clipboard';

type HubCategory = 'all' | 'html' | 'css' | 'javascript' | 'python' | 'math' | 'units' | 'markdown' | 'shortcuts';

interface ReferenceEntry {
  id: string;
  category: Exclude<HubCategory, 'all'>;
  title: string;
  summary: string;
  snippet: string;
}

const REFERENCE_DATA: ReferenceEntry[] = [
  {
    id: 'html-semantic',
    category: 'html',
    title: 'Semantic Document Layout',
    summary: 'Accessible landmark tags for headers, main views, articles, and footers.',
    snippet: '<header>...</header>\n<main>\n  <article>\n    <h1>Heading</h1>\n    <p>Paragraph text</p>\n  </article>\n</main>\n<footer>...</footer>',
  },
  {
    id: 'html-form',
    category: 'html',
    title: 'Accessible Form Input',
    summary: 'Properly linked label, input attributes, and validation hints.',
    snippet: '<label for="email">Email Address</label>\n<input id="email" type="email" required autocomplete="email" placeholder="you@example.com" />',
  },
  {
    id: 'css-grid',
    category: 'css',
    title: 'Responsive Auto-Fit Grid',
    summary: 'Fluid card layout without manual breakpoints.',
    snippet: '.grid-cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 1.25rem;\n}',
  },
  {
    id: 'css-center',
    category: 'css',
    title: 'Flexbox & Place-Items Centering',
    summary: 'Center elements horizontally and vertically.',
    snippet: '.center-box {\n  display: grid;\n  place-items: center;\n}',
  },
  {
    id: 'js-fetch',
    category: 'javascript',
    title: 'Async Fetch with Error Handling',
    summary: 'Safe JSON request pattern checking response.ok before parsing.',
    snippet: 'async function loadJson(url) {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}',
  },
  {
    id: 'js-array',
    category: 'javascript',
    title: 'Map, Filter & Deduplicate',
    summary: 'Transform and remove duplicates from arrays cleanly.',
    snippet: 'const uniqueActive = Array.from(\n  new Set(users.filter(u => u.active).map(u => u.email))\n);',
  },
  {
    id: 'py-comp',
    category: 'python',
    title: 'List & Dict Comprehensions',
    summary: 'Concise functional transformations in Python 3.',
    snippet: 'squares = [n * n for n in range(1, 11) if n % 2 == 0]\nlookup = {item["id"]: item["name"] for item in records}',
  },
  {
    id: 'py-file',
    category: 'python',
    title: 'Safe File Read with Context Manager',
    summary: 'Automatically closes files cleanly on completion or exception.',
    snippet: 'with open("data.csv", "r", encoding="utf-8") as f:\n    lines = [line.strip() for line in f if line.strip()]',
  },
  {
    id: 'math-quadratic',
    category: 'math',
    title: 'Quadratic Formula & Discriminant',
    summary: 'Solve ax² + bx + c = 0 where a ≠ 0.',
    snippet: 'x = (-b ± √(b² - 4ac)) / (2a)\nDiscriminant Δ = b² - 4ac (>0 two real roots, =0 one root, <0 complex)',
  },
  {
    id: 'math-compound',
    category: 'math',
    title: 'Compound Interest Formula',
    summary: 'Calculate future investment value with periodic compounding.',
    snippet: 'A = P * (1 + r / n)^(n * t)\nP = principal, r = annual rate (decimal), n = compounds/year, t = years',
  },
  {
    id: 'units-quick',
    category: 'units',
    title: 'Everyday Unit Conversion Constants',
    summary: 'Exact metric, imperial, and digital storage factors.',
    snippet: '1 inch = 2.54 cm | 1 mile = 1.60934 km | 1 kg = 2.20462 lbs\n1 GiB = 1024 MiB | °F = (°C × 9/5) + 32 | K = °C + 273.15',
  },
  {
    id: 'md-cheat',
    category: 'markdown',
    title: 'Markdown Syntax Quick Reference',
    summary: 'Headings, links, code blocks, tables, and checklists.',
    snippet: '# Heading 1\n**Bold** and *Italic* and `inline code`\n- [x] Done task\n| Col A | Col B |\n|---|---|\n| 1 | 2 |',
  },
  {
    id: 'shortcuts-nova',
    category: 'shortcuts',
    title: 'NOVA Tools & Browser Shortcuts',
    summary: 'Keyboard navigation shortcuts across the workspace.',
    snippet: 'Ctrl/Cmd + K : Open Universal Search\nCtrl/Cmd + / : Open Keyboard Shortcut Center\nEsc          : Close Modals & Overlays',
  },
];

export const LearningHubPage: React.FC = () => {
  const { navigate } = useNova();
  const [category, setCategory] = useState<HubCategory>('all');
  const [query, setQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REFERENCE_DATA.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  const handleCopy = (id: string, text: string) => {
    copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            NOVA Learning Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Developer & Academic Reference Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Searchable syntax cheat sheets, math formulas, unit conversion constants, and quick links to interactive calculators.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search HTML, JS, Python, Math..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Interactive Educational Quick Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => navigate('/tools/periodic-table')}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-500 text-left flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">118-Element Periodic Table</span>
              <span className="text-[11px] text-slate-500">Interactive chemistry reference</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/tools/unit-converter')}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-cyan-500 text-left flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Unit Converter</span>
              <span className="text-[11px] text-slate-500">Interactive metric & imperial math</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/developer-lab')}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-emerald-500 text-left flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Try in Developer Lab</span>
              <span className="text-[11px] text-slate-500">Test HTML/CSS/JS examples live</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(['all', 'html', 'css', 'javascript', 'python', 'math', 'units', 'markdown', 'shortcuts'] as HubCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide shrink-0 transition-colors ${
              category === cat
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {item.category}
                </span>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(item.id, item.snippet)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold shrink-0 hover:border-indigo-500"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto leading-relaxed">
              {item.snippet}
            </pre>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-10 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800 dark:text-white">No references matched "{query}"</p>
          <button type="button" onClick={() => { setQuery(''); setCategory('all'); }} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
