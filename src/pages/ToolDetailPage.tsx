import React, { useEffect } from 'react';
import {
  ArrowLeft, Star, ShieldCheck, Share2, Sparkles, ChevronRight
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { ToolDefinition } from '../types';
import { SUITES_DATA } from '../data/suitesData';
import { TOOLS_DATA } from '../data/toolsData';
import { ToolDispatcher } from '../tools/ToolDispatcher';
import { copyToClipboard } from '../utils/clipboard';

interface ToolDetailPageProps {
  tool: ToolDefinition;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ tool }) => {
  const { navigate, isFavorite, toggleFavorite, addRecent } = useNova();
  const [copiedShare, setCopiedShare] = React.useState<boolean>(false);

  // Record this tool in recently used
  useEffect(() => {
    addRecent(tool.slug);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.slug]);

  const suite = SUITES_DATA[tool.suite];
  const isFav = isFavorite(tool.slug);

  // Find 4 related tools in the same suite
  const relatedTools = TOOLS_DATA.filter(
    (t) => t.suite === tool.suite && t.slug !== tool.slug
  ).slice(0, 4);

  const handleShare = () => {
    copyToClipboard(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="space-y-8 animate-tool-enter">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Tools
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <button
            onClick={() => navigate(`/tools?suite=${suite.id}`)}
            className="font-medium hover:underline"
            style={{ color: suite.accentColor }}
          >
            {suite.name}
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedShare ? 'Link Copied!' : 'Share Tool'}
          </button>

          <button
            onClick={() => toggleFavorite(tool.slug)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
            {isFav ? 'Favorited' : 'Favorite'}
          </button>
        </div>
      </div>

      {/* Hero Header for Tool */}
      <div className="relative isolate overflow-hidden p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-violet-500/15 bg-gradient-to-br from-white via-violet-50/60 to-cyan-50/50 dark:from-[#10182B] dark:via-[#11142B] dark:to-[#0B1B2A] shadow-lg shadow-violet-950/5 dark:shadow-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6"><div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 -z-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
            >
              {suite.name}
            </span>
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-side</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {tool.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {tool.description}
          </p>
        </div>

        <div
          className="hidden sm:flex w-12 h-12 md:w-16 md:h-16 rounded-2xl items-center justify-center shrink-0 shadow-md"
          style={{ backgroundColor: `${suite.accentColor}20`, color: suite.accentColor }}
        >
          <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
        </div>
      </div>

      {/* Main Tool Interface */}
      <div className="p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/40 shadow-sm">
        <ToolDispatcher tool={tool} />
      </div>

      {/* Search-friendly, practical guide for this specific tool */}
      <article className="space-y-6 sm:space-y-8" aria-labelledby="tool-guide-title">
        <header className="max-w-3xl space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Tool guide</p>
          <h2 id="tool-guide-title" className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            About the {tool.name}
          </h2>
          <p className="text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">{tool.description}</p>
        </header>

        {tool.whatItDoes && tool.whatItDoes.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">What this tool does</h3>
            <div className="space-y-3">
              {tool.whatItDoes.map((paragraph, index) => (
                <p key={index} className="text-sm leading-7 text-slate-600 dark:text-slate-300">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {tool.howToUse && tool.howToUse.length > 0 && (
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 p-4 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">How to use the {tool.name}</h3>
            <ol className="space-y-3">
              {tool.howToUse.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700 dark:bg-violet-400/15 dark:text-violet-300">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {tool.example && (
          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Example</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Input</p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm font-medium text-slate-800 dark:text-slate-200">{tool.example.input}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Expected output</p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold text-slate-900 dark:text-white">{tool.example.output}</p>
              </div>
            </div>
            {tool.example.note && <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">{tool.example.note}</p>}
          </section>
        )}

        {tool.howItWorks && (
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">How it works</h3>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{tool.howItWorks}</p>
          </section>
        )}

        {tool.privacyInfo && (
          <section className="rounded-2xl border border-cyan-200/80 dark:border-cyan-900/60 bg-cyan-50/60 dark:bg-cyan-950/15 p-4 sm:p-5 space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />Data and privacy notes</h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{tool.privacyInfo}</p>
            <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">For site-wide analytics, advertising, and browser storage details, read the <button type="button" onClick={() => navigate('/privacy-policy')} className="font-semibold text-cyan-700 underline underline-offset-2 dark:text-cyan-300">Privacy Policy</button>.</p>
          </section>
        )}

        {tool.faqs && tool.faqs.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Frequently asked questions</h3>
            <div className="space-y-2">
              {tool.faqs.map((faq, index) => (
                <details key={index} className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 p-4">
                  <summary className="cursor-pointer list-none pr-5 text-sm font-semibold text-slate-900 dark:text-white marker:hidden">
                    {faq.question}
                  </summary>
                  <p className="pt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Related Suite Tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Related Tools in {suite.name}
            </h3>
            <button
              onClick={() => navigate(`/tools?suite=${suite.id}`)}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              Explore suite <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {relatedTools.map((rt) => (
              <div
                key={rt.slug}
                onClick={() => navigate(`/tools/${rt.slug}`)}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-cyan-500/40 cursor-pointer transition-all active:scale-[0.98] group"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-1">
                  {rt.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-2 mt-0.5">
                  {rt.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
