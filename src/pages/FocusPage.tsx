import React, { useState, useEffect } from 'react';
import {
  Timer, Play, Pause, RotateCcw, Maximize2, Minimize2,
  Volume2, VolumeX, CheckSquare, Plus, Trash2, Flame, Clock
} from 'lucide-react';
import { useNova } from '../context/NovaContext';

type FocusMode = 'pomodoro' | 'countdown' | 'stopwatch';

interface PersistedTimerState {
  mode: FocusMode;
  pomodoroPhase: 'focus' | 'short-break' | 'long-break';
  targetEndMs: number | null;
  pausedRemainingMs: number;
  stopwatchStartMs: number | null;
  stopwatchAccumulatedMs: number;
  running: boolean;
  customMinutes: number;
}

const STORAGE_KEY = 'nova_v2_focus_timer_state';

export const FocusPage: React.FC = () => {
  const { focusSessions, addFocusSession, clearFocusSessions, settings, updateSettings, triggerSound } = useNova();

  const [timerState, setTimerState] = useState<PersistedTimerState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      mode: 'pomodoro',
      pomodoroPhase: 'focus',
      targetEndMs: null,
      pausedRemainingMs: 25 * 60 * 1000,
      stopwatchStartMs: null,
      stopwatchAccumulatedMs: 0,
      running: false,
      customMinutes: 15,
    };
  });

  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [distractionFree, setDistractionFree] = useState<boolean>(false);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('nova_v2_focus_goal')) || 90;
    } catch {
      return 90;
    }
  });
  const [focusTask, setFocusTask] = useState<string>('Deep work sprint');

  // Persist timer state across page refresh
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timerState));
    } catch {}
  }, [timerState]);

  useEffect(() => {
    try {
      localStorage.setItem('nova_v2_focus_goal', String(dailyGoalMinutes));
    } catch {}
  }, [dailyGoalMinutes]);

  // Timestamp-accurate ticker (recovers accurately even after browser tab suspension)
  useEffect(() => {
    if (!timerState.running) return;
    setNowMs(Date.now());
    const id = window.setInterval(() => {
      const currentNow = Date.now();
      setNowMs(currentNow);

      setTimerState((prev) => {
        if (!prev.running || prev.mode === 'stopwatch' || prev.targetEndMs === null) return prev;
        if (currentNow >= prev.targetEndMs) {
          const completedSeconds =
            prev.mode === 'pomodoro'
              ? (prev.pomodoroPhase === 'focus' ? 25 : prev.pomodoroPhase === 'short-break' ? 5 : 15) * 60
              : prev.customMinutes * 60;
          addFocusSession({
            mode: prev.mode,
            label: prev.mode === 'pomodoro' ? `Pomodoro (${prev.pomodoroPhase})` : `Countdown (${prev.customMinutes}m)`,
            durationSeconds: completedSeconds,
            completedAt: currentNow,
          });
          triggerSound('chime');
          return {
            ...prev,
            running: false,
            targetEndMs: null,
            pausedRemainingMs: 0,
          };
        }
        return prev;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [timerState.running]);

  const displayMs = (() => {
    if (timerState.mode === 'stopwatch') {
      if (timerState.running && timerState.stopwatchStartMs !== null) {
        return timerState.stopwatchAccumulatedMs + Math.max(0, nowMs - timerState.stopwatchStartMs);
      }
      return timerState.stopwatchAccumulatedMs;
    }
    if (timerState.running && timerState.targetEndMs !== null) {
      return Math.max(0, timerState.targetEndMs - nowMs);
    }
    return timerState.pausedRemainingMs;
  })();

  const formatTime = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startPause = () => {
    const currentNow = Date.now();
    setNowMs(currentNow);

    if (timerState.running) {
      if (timerState.mode === 'stopwatch') {
        const added = timerState.stopwatchStartMs ? currentNow - timerState.stopwatchStartMs : 0;
        setTimerState((prev) => ({
          ...prev,
          running: false,
          stopwatchAccumulatedMs: prev.stopwatchAccumulatedMs + added,
          stopwatchStartMs: null,
        }));
      } else {
        const remaining = timerState.targetEndMs ? Math.max(0, timerState.targetEndMs - currentNow) : timerState.pausedRemainingMs;
        setTimerState((prev) => ({
          ...prev,
          running: false,
          pausedRemainingMs: remaining,
          targetEndMs: null,
        }));
      }
      triggerSound('click');
      return;
    }

    if (timerState.mode === 'stopwatch') {
      setTimerState((prev) => ({
        ...prev,
        running: true,
        stopwatchStartMs: currentNow,
      }));
    } else {
      const fallbackMs =
        timerState.mode === 'pomodoro'
          ? (timerState.pomodoroPhase === 'focus' ? 25 : timerState.pomodoroPhase === 'short-break' ? 5 : 15) * 60 * 1000
          : timerState.customMinutes * 60 * 1000;
      const baseMs = timerState.pausedRemainingMs > 0 ? timerState.pausedRemainingMs : fallbackMs;
      setTimerState((prev) => ({
        ...prev,
        running: true,
        targetEndMs: currentNow + baseMs,
        pausedRemainingMs: baseMs,
      }));
    }
    triggerSound('click');
  };

  const resetTimer = (overrideMode?: FocusMode, overridePhase?: PersistedTimerState['pomodoroPhase'], overrideMinutes?: number) => {
    const mode = overrideMode || timerState.mode;
    const phase = overridePhase || timerState.pomodoroPhase;
    const customMins = overrideMinutes ?? timerState.customMinutes;
    const durationMs =
      mode === 'pomodoro'
        ? (phase === 'focus' ? 25 : phase === 'short-break' ? 5 : 15) * 60 * 1000
        : mode === 'countdown'
        ? customMins * 60 * 1000
        : 0;

    setTimerState({
      mode,
      pomodoroPhase: phase,
      running: false,
      targetEndMs: null,
      pausedRemainingMs: durationMs,
      stopwatchStartMs: null,
      stopwatchAccumulatedMs: 0,
      customMinutes: customMins,
    });
  };

  const logStopwatchLap = () => {
    const secs = Math.floor(displayMs / 1000);
    if (secs < 5) return;
    addFocusSession({
      mode: 'stopwatch',
      label: focusTask || 'Stopwatch Session',
      durationSeconds: secs,
      completedAt: Date.now(),
    });
    triggerSound('success');
  };

  const todayMinutes = Math.round(
    focusSessions
      .filter((s) => new Date(s.completedAt).toDateString() === new Date().toDateString())
      .reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );

  const goalPct = Math.min(100, Math.round((todayMinutes / Math.max(1, dailyGoalMinutes)) * 100));

  return (
    <div
      className={
        distractionFree
          ? 'fixed inset-0 z-50 bg-slate-950 text-white p-6 flex flex-col items-center justify-center space-y-8'
          : 'space-y-6 animate-page-enter'
      }
    >
      {!distractionFree && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
              NOVA Focus Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Timestamp-Accurate Focus Timer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pomodoro, Countdown, and Stopwatch driven by system timestamps—stays accurate even if tabs sleep or refresh.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
            >
              {settings.soundEffects ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{settings.soundEffects ? 'Chime On' : 'Chime Muted'}</span>
            </button>
            <button
              type="button"
              onClick={() => setDistractionFree(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Zen Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Timer Surface */}
      <div className={`w-full ${distractionFree ? 'max-w-lg text-center space-y-6' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}`}>
        <div
          className={`${distractionFree ? '' : 'lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm'} flex flex-col items-center space-y-6`}
        >
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {[
              { id: 'pomodoro', label: 'Pomodoro' },
              { id: 'countdown', label: 'Countdown' },
              { id: 'stopwatch', label: 'Stopwatch' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => resetTimer(m.id as FocusMode)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  timerState.mode === m.id
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Pomodoro Sub-phases or Custom Presets */}
          {timerState.mode === 'pomodoro' && (
            <div className="flex items-center gap-2">
              {[
                { id: 'focus', label: '25m Focus' },
                { id: 'short-break', label: '5m Break' },
                { id: 'long-break', label: '15m Long Break' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => resetTimer('pomodoro', p.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    timerState.pomodoroPhase === p.id
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {timerState.mode === 'countdown' && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[5, 10, 15, 30, 45, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => resetTimer('countdown', undefined, m)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    timerState.customMinutes === m
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          )}

          {/* Readout */}
          <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tabular-nums tracking-tight text-slate-900 dark:text-white select-none">
            {formatTime(displayMs)}
          </div>

          <input
            type="text"
            value={focusTask}
            onChange={(e) => setFocusTask(e.target.value)}
            placeholder="Current focus objective..."
            className="w-full max-w-sm text-center px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200"
          />

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={startPause}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg"
            >
              {timerState.running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{timerState.running ? 'Pause' : 'Start'}</span>
            </button>
            <button
              type="button"
              onClick={() => resetTimer()}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            {timerState.mode === 'stopwatch' && displayMs >= 5000 && (
              <button
                type="button"
                onClick={logStopwatchLap}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Save Log
              </button>
            )}
            {distractionFree && (
              <button
                type="button"
                onClick={() => setDistractionFree(false)}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-700 text-xs font-bold text-slate-300"
              >
                <Minimize2 className="w-4 h-4" /> Exit Zen
              </button>
            )}
          </div>
        </div>

        {/* Daily Goal & Session History */}
        {!distractionFree && (
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Daily Focus Goal</span>
                </span>
                <span className="text-xs font-mono tabular-nums text-cyan-600 dark:text-cyan-400 font-bold">
                  {todayMinutes} / {dailyGoalMinutes} min ({goalPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all" style={{ width: `${goalPct}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Target minutes/day</span>
                <input
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(Math.max(15, Number(e.target.value)))}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs text-right"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/70 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-violet-500" />
                  <span>Session History ({focusSessions.length})</span>
                </span>
                {focusSessions.length > 0 && (
                  <button type="button" onClick={clearFocusSessions} className="text-[11px] text-slate-400 hover:text-rose-500">
                    Clear
                  </button>
                )}
              </div>

              {focusSessions.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {focusSessions.slice(0, 12).map((s) => (
                    <div key={s.id} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between text-xs">
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">{s.label}</span>
                        <span className="text-[10px] text-slate-400">{new Date(s.completedAt).toLocaleTimeString()}</span>
                      </div>
                      <span className="font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {Math.round(s.durationSeconds / 60)}m
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">Complete a timer session to record history locally.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
