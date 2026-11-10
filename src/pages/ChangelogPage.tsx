import React from 'react';
import {
  Sparkles, Zap, Shield, Smartphone, Palette, CheckCircle2,
  Cpu, Wrench, Layers, RefreshCw
} from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const releases = [
    {
      version: 'v2.1.0',
      date: 'Current Release',
      title: 'The Ultimate Platform Transformation & Feature Expansion',
      badge: 'Major Overhaul',
      badgeColor: 'bg-violet-500/10 text-violet-500 border-violet-500/30',
      items: [
        {
          category: 'Platform & UI/UX',
          icon: Palette,
          color: 'text-violet-400',
          points: [
            'Apple-inspired futuristic SaaS aesthetic with midnight navy, electric violet, and cyan ambient gradients.',
            'Smooth theme switching between Light Mode, Dark Mode, and system preferences.',
            'Reading progress indicator anchored to long-form reading pages and tool guides.',
            'Full PWA compliance with offline service worker asset caching and in-app install flow.',
          ],
        },
        {
          category: 'Signature NOVA Features',
          icon: Sparkles,
          color: 'text-cyan-400',
          points: [
            'NOVA Dashboard with real-time productivity statistics, pinned tools, and quick launchpad.',
            'Universal File Converter with multi-format drag-and-drop processing for images and text.',
            'Mini Image Studio with crop, resize, rotate, flip, filters, and format conversion.',
            'NOVA Code Playground with live sandboxed HTML/CSS/JS preview and built-in console logger.',
            'File Inspector & Hex Dump Viewer with cryptographic checksums (SHA-256/SHA-1/MD5).',
            'CSV-to-Chart Generator for interactive Bar, Line, Area, and Donut SVG/PNG charts.',
            'Advanced QR Studio with custom frames, colors, and built-in QR Code Validator.',
            'Accessibility Checker for WCAG 2.1 AA/AAA contrast ratios and color blindness simulation.',
            'NOVA Workspace for persistent browser-local notes, checklists, and calculations.',
          ],
        },
        {
          category: 'Performance & Architecture',
          icon: Cpu,
          color: 'text-emerald-400',
          points: [
            '100% in-browser client execution: zero telemetry, zero mandatory user accounts, zero server file uploads.',
            'Lazy-loaded suite code-splitting to ensure instantaneous first-paint on low-end mobile devices.',
            'Zero build errors, verified route normalization, and automated sitemap generation for Cloudflare Pages.',
          ],
        },
      ],
    },
    {
      version: 'v2.0.0',
      date: 'Foundational Upgrade',
      title: 'Arsenal Expansion to 100+ Functional Tools',
      badge: 'Milestone',
      badgeColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
      items: [
        {
          category: 'Tooling',
          icon: Wrench,
          color: 'text-amber-400',
          points: [
            'Expanded tool registry from 61 to 100+ fully-implemented client-side tools across 12 distinct suites.',
            'Added Financial calculators (GST with CGST/SGST, Reducing-balance EMI, Date Differences).',
            'Added Web Crypto AES-GCM 256-bit Text Encryption and Decryption.',
            'Added Student suite: GPA/CGPA calculators, Pomodoro timer, and Fraction simplifiers.',
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
          Explore the latest improvements, newly launched utility suites, and performance optimizations.
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
