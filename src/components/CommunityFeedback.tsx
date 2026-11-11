import React, { useEffect, useState } from 'react';
import { Bug, Lightbulb, MessageSquare, Send, Star } from 'lucide-react';

type FeedbackKind = 'bug' | 'suggestion' | 'feature';
type RatingSummary = { average: number; count: number };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const enabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

async function supabaseRequest(path: string, init: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Community backend is not configured yet.');
  const response = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!response.ok) throw new Error('Request failed. Please try again later.');
  return response;
}

interface CommunityFeedbackProps {
  toolSlug: string;
  toolName: string;
}

export const CommunityFeedback: React.FC<CommunityFeedbackProps> = ({ toolSlug, toolName }) => {
  const [rating, setRating] = useState(0);
  const [summary, setSummary] = useState<RatingSummary>({ average: 0, count: 0 });
  const [kind, setKind] = useState<FeedbackKind>('suggestion');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    supabaseRequest(`tool_ratings?select=rating&tool_slug=eq.${encodeURIComponent(toolSlug)}&limit=500`)
      .then(async (response) => {
        const rows = await response.json() as Array<{ rating: number }>;
        if (cancelled) return;
        const count = rows.length;
        setSummary({ count, average: count ? rows.reduce((sum, row) => sum + row.rating, 0) / count : 0 });
      })
      .catch(() => { /* Keep the tool usable when the community backend is unavailable. */ });
    try {
      const saved = localStorage.getItem(`nova-community-rating:${toolSlug}`);
      if (saved) setRating(Number(saved) || 0);
    } catch { /* Private browsing may block storage. */ }
    return () => { cancelled = true; };
  }, [toolSlug]);

  const submitRating = async (value: number) => {
    setStatus('');
    if (!enabled) { setStatus('Community ratings are not configured yet.'); return; }
    if (rating > 0) { setStatus('You have already rated this tool on this device.'); return; }
    setBusy(true);
    try {
      await supabaseRequest('tool_ratings', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ tool_slug: toolSlug, rating: value }),
      });
      setRating(value);
      try { localStorage.setItem(`nova-community-rating:${toolSlug}`, String(value)); } catch { /* Best effort only. */ }
      setSummary((current) => ({
        count: current.count + 1,
        average: ((current.average * current.count) + value) / (current.count + 1),
      }));
      setStatus('Thanks for rating this tool!');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not save your rating.');
    } finally { setBusy(false); }
  };

  const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    if (trap) return;
    const cleanTitle = title.trim();
    const cleanMessage = message.trim();
    if (cleanTitle.length < 3 || cleanTitle.length > 80 || cleanMessage.length < 8 || cleanMessage.length > 1000) {
      setStatus('Add a short title and a message between 8 and 1000 characters.');
      return;
    }
    if (!enabled) { setStatus('Feedback is not configured yet. Please try again later.'); return; }
    setBusy(true);
    try {
      await supabaseRequest('community_feedback', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ kind, tool_slug: toolSlug, title: cleanTitle, message: cleanMessage }),
      });
      setTitle('');
      setMessage('');
      setStatus('Sent! Thanks for helping improve NOVA Tools.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not send feedback.');
    } finally { setBusy(false); }
  };

  return (
    <section className="rounded-2xl border border-violet-200/80 dark:border-violet-900/60 bg-white/90 dark:bg-slate-900/50 p-4 sm:p-6 space-y-5" aria-labelledby="community-feedback-title">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Help shape NOVA</p>
        <h2 id="community-feedback-title" className="mt-1 text-lg font-black text-slate-900 dark:text-white">Rate & share feedback</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">No account or sign-in required. Please don't include personal or sensitive information.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between rounded-xl bg-slate-50 dark:bg-slate-950/50 p-3">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">How useful is {toolName}?</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {summary.count ? `Community average ${summary.average.toFixed(1)}/5 · ${summary.count} rating${summary.count === 1 ? '' : 's'}` : 'Be the first to rate it'}
          </p>
        </div>
        <div className="flex items-center gap-1" aria-label="Rate this tool out of five stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" disabled={busy || rating > 0} onClick={() => void submitRating(value)} aria-label={`${value} star rating`} className="rounded-md p-1 disabled:cursor-not-allowed hover:scale-110 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500">
              <Star className={`h-5 w-5 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={submitFeedback} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {([
            { value: 'suggestion', label: 'Feedback', icon: MessageSquare },
            { value: 'bug', label: 'Report a bug', icon: Bug },
            { value: 'feature', label: 'Request a feature', icon: Lightbulb },
          ] as const).map((option) => {
            const Icon = option.icon;
            return <button key={option.value} type="button" onClick={() => setKind(option.value)} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${kind === option.value ? 'border-violet-400 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'}`}><Icon className="h-3.5 w-3.5" />{option.label}</button>;
          })}
        </div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          Short title
          <input value={title} onChange={(event) => setTitle(event.target.value)} required minLength={3} maxLength={80} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder={kind === 'bug' ? 'What went wrong?' : kind === 'feature' ? 'What should we build?' : 'What could be better?'} />
        </label>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          Details
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={8} maxLength={1000} rows={3} className="mt-1 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder="Tell us what happened or what would help…" />
          <span className="mt-1 block text-right font-normal text-slate-400">{message.length}/1000</span>
        </label>
        <label className="hidden" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} /></label>
        <button type="submit" disabled={busy || !enabled} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">
          <Send className="h-4 w-4" />{busy ? 'Sending…' : 'Send feedback'}
        </button>
        {!enabled && <p className="text-xs text-amber-700 dark:text-amber-300">Supabase environment variables must be added in Cloudflare Pages to enable community features.</p>}
        {status && <p role="status" aria-live="polite" className="text-xs text-slate-600 dark:text-slate-300">{status}</p>}
      </form>
    </section>
  );
};
