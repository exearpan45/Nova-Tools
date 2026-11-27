import React from 'react';
import {
  ArrowRight, ArrowUpRight, BookOpen, Braces, Calculator, Check, ChevronRight,
  Clock3, Code2, Compass, Cpu, FileStack, GitBranch, Globe2, Image,
  Layers3, LockKeyhole, Palette, QrCode, Search, ShieldCheck, Sparkles,
  Star, Timer, Type, WandSparkles, Zap
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { SUITE_LIST, SUITES_DATA } from '../data/suitesData';
import { FEATURED_TOOLS, TOOLS_BY_SLUG, TOOLS_DATA } from '../data/toolsData';

const quickLaunch = [
  { name: 'Calculator', slug: 'calculator', icon: Calculator, tint: '#9B8CFF' },
  { name: 'Image tools', slug: 'image-compressor', icon: Image, tint: '#48C6D8' },
  { name: 'JSON formatter', slug: 'json-formatter', icon: Braces, tint: '#F0B45B' },
  { name: 'Word counter', slug: 'word-counter', icon: Type, tint: '#E58AB8' },
  { name: 'QR generator', slug: 'qr-generator', icon: QrCode, tint: '#7DC79B' },
  { name: 'Unit converter', slug: 'unit-converter', icon: Zap, tint: '#83A9FF' },
];

const studios = [
  { title: 'File Studio', description: 'Inspect, convert and batch-process files in one calm workspace.', path: '/file-studio', icon: FileStack, tint: '#62B8FF', tag: 'FILES' },
  { title: 'Developer Lab', description: 'Build, format, inspect and experiment with code.', path: '/developer-lab', icon: Code2, tint: '#75D6B0', tag: 'BUILD' },
  { title: 'Design Studio', description: 'Explore palettes, gradients, contrast and visual assets.', path: '/design-studio', icon: Palette, tint: '#D69AFF', tag: 'CREATE' },
  { title: 'QR Studio', description: 'Generate polished QR codes and useful barcodes.', path: '/qr-studio', icon: QrCode, tint: '#F2BD72', tag: 'SHARE' },
  { title: 'Focus Studio', description: 'Make room for deep work with timers and simple goals.', path: '/focus', icon: Timer, tint: '#F08E9C', tag: 'FOCUS' },
  { title: 'Learning Hub', description: 'Keep practical references and quick explanations close.', path: '/learning-hub', icon: BookOpen, tint: '#75B9E8', tag: 'LEARN' },
  { title: 'NOVA Flow', description: 'Connect supported tools into repeatable local workflows.', path: '/workflows', icon: GitBranch, tint: '#A99AFF', tag: 'AUTOMATE' },
  { title: 'Browser Utilities', description: 'Understand your browser, viewport and local storage.', path: '/browser-utilities', icon: Globe2, tint: '#76C9C1', tag: 'INSPECT' },
];

export const HomePage: React.FC = () => {
  const { navigate, setSearchOpen, isFavorite, toggleFavorite, recentTools, favorites } = useNova();

  const recentPreview = recentTools
    .slice(0, 4)
    .map((item) => TOOLS_BY_SLUG.get(item.slug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  const totalTools = TOOLS_DATA.length;

  return (
    <div className="nova-home-v2 min-w-0 space-y-10 pb-8 sm:space-y-14">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1020] px-5 py-8 text-white shadow-[0_28px_90px_-38px_rgba(69,75,190,.55)] sm:px-8 sm:py-11 lg:px-12 lg:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-36 h-[26rem] w-[26rem] rounded-full bg-violet-600/30 blur-[100px]" />
          <div className="absolute -bottom-48 left-[28%] h-[25rem] w-[25rem] rounded-full bg-cyan-500/20 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)', backgroundSize: '42px 42px', maskImage: 'linear-gradient(to bottom, black, transparent 85%)' }} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-violet-200">
            <Sparkles className="h-3.5 w-3.5" /> NOVA TOOLS / YOUR DIGITAL WORKSPACE
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Browser-native
          </span>
        </div>

        <div className="mt-8 grid gap-9 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.24em] text-cyan-200/80">Less switching. More making.</p>
            <h1 className="max-w-3xl text-[2.65rem] font-extrabold leading-[1.02] tracking-[-.055em] sm:text-6xl lg:text-[4.35rem]">
              Your everyday
              <span className="block bg-gradient-to-r from-[#AFA0FF] via-[#73D8E7] to-[#A2E5C1] bg-clip-text text-transparent">tools, in orbit.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              A thoughtfully organised collection of free utilities for creating, converting, calculating and getting things done. No account required.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate('/tools')} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-cyan-50">
                Explore all tools <ArrowUpRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => navigate('/workspace')} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10">
                Open workspace <Layers3 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button type="button" onClick={() => setSearchOpen(true)} className="group w-full rounded-2xl border border-white/15 bg-white/[.07] p-3 text-left shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:border-cyan-200/40 hover:bg-white/[.10]">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080D19]/70 px-4 py-4">
              <Search className="h-5 w-5 text-cyan-200" />
              <span className="flex-1 text-sm text-slate-300">What do you want to do?</span>
              <kbd className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-semibold text-slate-300">⌘ K</kbd>
            </div>
            <div className="flex flex-wrap gap-2 px-1 pb-1 pt-3">
              {['Compress an image', 'Format JSON', 'Create a QR code'].map((hint) => (
                <span key={hint} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-slate-400 transition group-hover:border-cyan-200/20 group-hover:text-slate-200">{hint}</span>
              ))}
            </div>
          </button>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:max-w-xl">
          <div><div className="text-2xl font-extrabold tracking-tight sm:text-3xl">{totalTools}+</div><div className="mt-1 text-[10px] uppercase tracking-[.16em] text-slate-400">Utilities</div></div>
          <div><div className="text-2xl font-extrabold tracking-tight sm:text-3xl">{SUITE_LIST.length}</div><div className="mt-1 text-[10px] uppercase tracking-[.16em] text-slate-400">Tool suites</div></div>
          <div><div className="text-2xl font-extrabold tracking-tight sm:text-3xl">{studios.length}</div><div className="mt-1 text-[10px] uppercase tracking-[.16em] text-slate-400">Studios</div></div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-violet-500">Start in one click</p><h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">Quick launch</h2></div>
          <button type="button" onClick={() => navigate('/tools')} className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-500 dark:text-violet-300">All tools <ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {quickLaunch.map((item) => {
            const Icon = item.icon;
            return <button key={item.slug} type="button" onClick={() => navigate('/tools/' + item.slug)} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-3 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-violet-400/40 sm:p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: item.tint + '20', color: item.tint }}><Icon className="h-5 w-5" /></span>
              <span className="min-w-0 text-xs font-bold text-slate-700 group-hover:text-violet-600 dark:text-slate-200 dark:group-hover:text-violet-300">{item.name}</span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-500" />
            </button>;
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-600 dark:text-cyan-300">Purpose-built spaces</p><h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">Explore the NOVA ecosystem</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">A dedicated space for every kind of work.</p></div>
          <button type="button" onClick={() => navigate('/categories')} className="hidden items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-300 sm:inline-flex">Explore categories <ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {studios.map((studio, index) => {
            const Icon = studio.icon;
            return <button key={studio.path} type="button" onClick={() => navigate(studio.path)} className="group relative min-h-[176px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-white/10 dark:bg-[#111827] dark:hover:border-white/20">
              <div aria-hidden="true" className="absolute -right-10 -top-12 h-32 w-32 rounded-full opacity-[.12] blur-2xl transition group-hover:opacity-25" style={{ backgroundColor: studio.tint }} />
              <div className="relative flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: studio.tint + '1A', color: studio.tint }}><Icon className="h-5 w-5" /></span>
                <span className="text-[9px] font-extrabold tracking-[.2em] text-slate-400">{studio.tag}</span>
              </div>
              <div className="relative mt-6"><h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{studio.title}</h3><p className="mt-1.5 max-w-[17rem] text-xs leading-5 text-slate-500 dark:text-slate-400">{studio.description}</p></div>
              <ArrowUpRight className="absolute bottom-5 right-5 h-4 w-4 text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-500" />
              <span className="absolute bottom-5 left-5 h-px w-8 origin-left scale-x-0 transition duration-300 group-hover:scale-x-100" style={{ backgroundColor: studio.tint }} />
              <span className="sr-only">Open {studio.title}</span>
              <span className="sr-only">{index + 1}</span>
            </button>;
          })}
        </div>
      </section>

      {recentPreview.length > 0 && <section className="space-y-4">
        <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-emerald-600 dark:text-emerald-300">Pick up where you stopped</p><h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Recently used</h2></div><button type="button" onClick={() => navigate('/recent')} className="text-xs font-bold text-violet-600 dark:text-violet-300">View history <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {recentPreview.map((tool) => <button key={tool.slug} type="button" onClick={() => navigate('/tools/' + tool.slug)} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-4 text-left transition hover:border-emerald-300 dark:border-white/10 dark:bg-slate-900/60"><span className="min-w-0"><span className="block truncate text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">{SUITES_DATA[tool.suite].name}</span><span className="mt-1 block truncate text-sm font-bold text-slate-800 dark:text-white">{tool.name}</span></span><Clock3 className="h-4 w-4 shrink-0 text-slate-400" /></button>)}
        </div>
      </section>}

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-amber-600 dark:text-amber-300">A good place to begin</p><h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">Popular tools</h2></div><button type="button" onClick={() => navigate('/tools')} className="text-xs font-bold text-violet-600 dark:text-violet-300">Browse {totalTools} tools <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURED_TOOLS.slice(0, 8).map((tool) => {
            const suite = SUITES_DATA[tool.suite];
            const favorite = isFavorite(tool.slug);
            return <div key={tool.slug} className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-white/10 dark:bg-[#111827]">
              <div className="flex items-center justify-between"><span className="rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: suite.accentColor + '18', color: suite.accentColor }}>{suite.name}</span><button type="button" onClick={() => toggleFavorite(tool.slug)} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'} title={favorite ? 'Remove from favorites' : 'Add to favorites'} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-500 dark:hover:bg-amber-400/10"><Star className={favorite ? 'h-4 w-4 fill-amber-400 text-amber-400' : 'h-4 w-4'} /></button></div>
              <button type="button" onClick={() => navigate('/tools/' + tool.slug)} className="mt-4 block w-full text-left"><h3 className="text-sm font-extrabold text-slate-900 transition group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-300">{tool.name}</h3><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500 dark:text-slate-400">{tool.description}</p><span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-300">Open tool <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span></button>
            </div>;
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <button type="button" onClick={() => navigate('/workflows')} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#30205E] via-[#25204E] to-[#102C45] p-6 text-left text-white sm:p-8">
          <div aria-hidden="true" className="absolute -right-10 -top-12 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl transition group-hover:bg-cyan-300/25" />
          <div className="relative"><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-200"><GitBranch className="h-4 w-4" /> NOVA Flow</span><h3 className="mt-5 max-w-md text-2xl font-extrabold tracking-tight sm:text-3xl">Make repeat tasks flow.</h3><p className="mt-3 max-w-md text-sm leading-6 text-indigo-100/75">Connect supported steps into a repeatable workflow and keep processing close to your browser.</p><span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-slate-900">Explore workflows <ArrowUpRight className="h-4 w-4" /></span></div>
        </button>
        <div className="flex flex-col justify-between rounded-3xl border border-emerald-500/20 bg-emerald-50/70 p-6 dark:bg-emerald-400/[.06] sm:p-8">
          <div><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-emerald-700 dark:text-emerald-300"><ShieldCheck className="h-4 w-4" /> Privacy by design</span><h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Your files stay yours.</h3><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Core utilities are designed to process data in your browser. Each tool should clearly explain when an external service is involved.</p></div>
          <button type="button" onClick={() => navigate('/settings')} className="mt-6 inline-flex items-center gap-2 self-start text-xs font-extrabold text-emerald-700 dark:text-emerald-300">Review privacy settings <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-slate-900/50 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">Find your lane</p><h2 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">Browse by category</h2></div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{favorites.length} saved favorites</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {SUITE_LIST.map((suite) => {
            const count = TOOLS_DATA.filter((tool) => tool.suite === suite.id).length;
            return <button key={suite.id} type="button" onClick={() => navigate('/tools?suite=' + suite.id)} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/70 bg-white px-3 py-3 text-left transition hover:border-violet-300 hover:bg-violet-50/50 dark:border-white/10 dark:bg-white/[.03] dark:hover:bg-violet-400/[.08]"><span className="min-w-0"><span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">{suite.name}</span><span className="mt-0.5 block text-[10px] text-slate-400">{count} tools</span></span><ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" /></button>;
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
        <span className="inline-flex items-center gap-1.5"><LockKeyhole className="h-3 w-3" /> No account needed</span>
        <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3" /> Free to use</span>
        <span className="inline-flex items-center gap-1.5"><WandSparkles className="h-3 w-3" /> Made for everyday work</span>
      </div>
    </div>
  );
};

export default HomePage;
