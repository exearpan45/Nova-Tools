import React from 'react';
import {
  Sparkles, Palette, CheckCircle2, Cpu, Wrench, Layers
} from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const releases = [
    {
      version: 'v2.2.0',
      date: 'NOVA REBORN Release',
      title: '16-Module Ecosystem Architecture & Studio Workbenches',
      badge: 'Latest Release',
      badgeColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
      items: [
        {
          category: 'Studios & Workbenches',
          icon: Layers,
          color: 'text-cyan-400',
          points: [
            'File Studio & Batch Engine: Binary magic-byte inspection, sandboxed SVG preview, concurrency queue, and pure client-side .ZIP export.',
            'Developer Lab: Unified multi-tab workbench for Code Playground, JSON, Markdown, Regex, Minifier, JWT Decoder & File Inspector.',
            'Design Studio: Palette generator with CSS/JSON export, WCAG Contrast Checker, Gradient, Shadow, Glassmorphism & Sanitized SVG Optimizer.',
            'QR & Barcode Studio: URL/Wi-Fi/vCard/Geo QR builder with logo overlay coverage warnings, Code 128B barcodes, print sheets & camera scanner.',
            'Focus Studio: Timestamp-accurate Pomodoro, Countdown presets, Stopwatch, Zen Mode & session logging.',
            'Learning Hub & Browser Utilities: Copy-ready developer/math references, Viewport monitor, Key/Mouse testers & Storage Inspector.',
          ],
        },
        {
          category: 'Workspace, Discovery & Control',
          icon: Sparkles,
          color: 'text-violet-400',
          points: [
            'Customizable Dashboard Widgets with drag reordering, accessible Up/Down controls & show/hide persistence.',
            'Clipboard & Snippets Vault with duplicate detection, category tagging & portable JSON export/import.',
            '5 Floating Mini Apps (Calculator, Quick Notes, Mini Timer, Color Inspector, Unit Converter) draggable across screens.',
            'Universal Command Search (⌘K) across all 107 tools, 12 suites, 11 studios, and saved NOVA Flow workflows.',
            'Privacy Center in Settings with granular local data clearing, notifications drawer, shortcuts modal & guided walkthrough.',
          ],
        },
      ],
    },
    {
      version: 'v2.1.0',
      date: 'Platform Transformation',
      title: 'UI/UX Overhaul & Signature Tools',
      badge: 'Previous Major',
      badgeColor: 'bg-violet-500/10 text-violet-500 border-violet-500/30',
      items: [
        {
          category: 'Platform & UI/UX',
          icon: Palette,
          color: 'text-violet-400',
          points: [
            'Midnight navy dark mode & clean daylight theme switching.',
            'Scroll-linked reading progress indicator anchored cleanly inside header.',
            'Full PWA compliance with offline service worker asset caching and in-app install flow.',
          ],
        },
        {
          category: 'Performance & Architecture',
          icon: Cpu,
          color: 'text-emerald-400',
          points: [
            '100% in-browser client execution: zero telemetry clutter, zero mandatory user accounts, zero server file uploads.',
            'Cross-device JSON Export & Import backup for Favorites, Recent history, Workspace, and Settings.',
          ],
        },
      ],
    },
    {
      version: 'v2.0.0',
      date: 'Foundational Upgrade',
      title: 'Arsenal Expansion to 100+ Functional Tools',
      badge: 'Milestone',
      badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      items: [
        {
          category: 'Tooling',
          icon: Wrench,
          color: 'text-amber-400',
          points: [
            'Expanded tool registry to 107 client-side tools across 12 distinct suites.',
            'Added Financial calculators (GST with CGST/SGST, Reducing-balance EMI, Date Differences).',
            'Added Web Crypto AES-GCM 256-bit Text Encryption and Decryption.',
          ],
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-page-enter">
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>WHAT'S NEW IN NOVA TOOLS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Changelog & Platform Evolution
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Explore the latest NOVA 2.0 ("NOVA REBORN") ecosystem studios, utilities, and architectural improvements.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {releases.map((rel) => (
          <div
            key={rel.version}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {rel.version}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${rel.badgeColor}`}>
                  {rel.badge}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {rel.date}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {rel.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {rel.items.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${sec.color}`} />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        {sec.category}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {sec.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
