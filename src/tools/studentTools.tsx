import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  GraduationCap, Calculator, Percent, Clock, Timer, Hourglass,
  Scale, Calendar, Award, Play, Pause, RotateCcw, Shuffle, Check, Plus, Trash2,
  Atom, Search, Copy, Flag
} from 'lucide-react';
import { evaluateSafeMath } from '../utils/safeMath';
import {
  PERIODIC_ELEMENTS,
  CATEGORY_META,
  ElementCategory,
  ChemicalElement,
} from '../data/periodicTableData';
import { useNova } from '../context/NovaContext';
import { copyToClipboard } from '../utils/clipboard';

interface StudentProps {
  toolSlug: string;
}

export const StudentTools: React.FC<StudentProps> = ({ toolSlug }) => {
  const { triggerSound } = useNova();

  // Periodic Table States
  const [elementSearch, setElementSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeElementNum, setActiveElementNum] = useState<number>(6); // Carbon default
  const [copiedElem, setCopiedElem] = useState<boolean>(false);

  // Percentage calculator states
  const [percMode, setPercMode] = useState<'whatIs' | 'isWhat' | 'increase'>('whatIs');
  const [pVal1, setPVal1] = useState<number>(20);
  const [pVal2, setPVal2] = useState<number>(150);

  // CGPA & GPA courses
  const [courses, setCourses] = useState<{ name: string; credits: number; grade: number }[]>([
    { name: 'Mathematics', credits: 4, grade: 9 },
    { name: 'Computer Science', credits: 4, grade: 10 },
    { name: 'Physics', credits: 3, grade: 8 },
    { name: 'Technical Writing', credits: 2, grade: 9 },
  ]);

  // Ratio states (A / B = C / D)
  const [ratioA, setRatioA] = useState<string>('3');
  const [ratioB, setRatioB] = useState<string>('4');
  const [ratioC, setRatioC] = useState<string>('9');
  const [ratioD, setRatioD] = useState<string>('');

  // Fraction states
  const [num1, setNum1] = useState<number>(1);
  const [den1, setDen1] = useState<number>(2);
  const [fracOp, setFracOp] = useState<'+' | '-' | '*' | '/'>('+');
  const [num2, setNum2] = useState<number>(3);
  const [den2, setDen2] = useState<number>(4);

  // Timer states (Pomodoro / Stopwatch / Countdown)
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [pomoMode, setPomoMode] = useState<'work' | 'short' | 'long'>('work');
  const [laps, setLaps] = useState<number[]>([]);

  // Scientific Calc display
  const [calcDisplay, setCalcDisplay] = useState<string>('0');

  // Random Question picker
  const [questionsInput, setQuestionsInput] = useState<string>(
    'What is Newton\'s second law of motion?\nExplain the concept of recursion with an example.\nWhat is the difference between TCP and UDP?\nDerive the quadratic formula.'
  );
  const [pickedQuestion, setPickedQuestion] = useState<string | null>(null);

  // Sync initial timer value when switching timer tools
  useEffect(() => {
    setIsTimerRunning(false);
    setLaps([]);
    if (toolSlug === 'stopwatch') {
      setTimerSeconds(0);
    } else if (toolSlug === 'pomodoro-timer' || toolSlug === 'study-timer') {
      setPomoMode('work');
      setTimerSeconds(25 * 60);
    }
  }, [toolSlug]);

  // Pomodoro interval handler
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (toolSlug === 'stopwatch') return prev + 1;
          if (prev <= 1) {
            setIsTimerRunning(false);
            triggerSound('chime');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, toolSlug]);

  const switchPomo = (mode: 'work' | 'short' | 'long') => {
    setPomoMode(mode);
    setIsTimerRunning(false);
    if (mode === 'work') setTimerSeconds(25 * 60);
    if (mode === 'short') setTimerSeconds(5 * 60);
    if (mode === 'long') setTimerSeconds(15 * 60);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // GPA calculation
  const calculatedGpa = useMemo(() => {
    const totalCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
    if (totalCredits === 0) return 0;
    const totalPoints = courses.reduce((acc, c) => acc + (Number(c.credits) || 0) * (Number(c.grade) || 0), 0);
    return (totalPoints / totalCredits).toFixed(2);
  }, [courses]);

  // Fraction Math
  const fractionResult = useMemo(() => {
    let rNum = 0;
    let rDen = 1;
    if (fracOp === '+') {
      rNum = num1 * den2 + num2 * den1;
      rDen = den1 * den2;
    } else if (fracOp === '-') {
      rNum = num1 * den2 - num2 * den1;
      rDen = den1 * den2;
    } else if (fracOp === '*') {
      rNum = num1 * num2;
      rDen = den1 * den2;
    } else if (fracOp === '/') {
      rNum = num1 * den2;
      rDen = den1 * num2;
    }

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = Math.abs(gcd(rNum, rDen)) || 1;
    const sNum = rNum / divisor;
    const sDen = rDen / divisor;

    return {
      simplified: `${sNum} / ${sDen}`,
      decimal: (rNum / (rDen || 1)).toFixed(4),
    };
  }, [num1, den1, fracOp, num2, den2]);

  // Scientific Calc Handlers
  const handleCalcButton = (btn: string) => {
    if (btn === 'C') {
      setCalcDisplay('0');
    } else if (btn === '=') {
      const evaluation = evaluateSafeMath(calcDisplay);
      if (evaluation.error || evaluation.result === undefined) {
        setCalcDisplay('Error');
      } else {
        setCalcDisplay(String(evaluation.result));
      }
    } else {
      setCalcDisplay((prev) => (prev === '0' || prev === 'Error' ? btn : prev + btn));
    }
  };

  const handlePickQuestion = () => {
    const list = questionsInput
      .split('\n')
      .map((q) => q.trim())
      .filter(Boolean);
    if (list.length === 0) return;
    const random = list[Math.floor(Math.random() * list.length)];
    setPickedQuestion(random);
    triggerSound('click');
  };

  // Periodic table derived state
  const activeElement: ChemicalElement = useMemo(() => {
    return PERIODIC_ELEMENTS.find((e) => e.number === activeElementNum) || PERIODIC_ELEMENTS[0];
  }, [activeElementNum]);

  const matchingNumbers = useMemo(() => {
    const q = elementSearch.trim().toLowerCase();
    return new Set(
      PERIODIC_ELEMENTS.filter((el) => {
        const catMatch = selectedCategory === 'all' || el.category === selectedCategory;
        if (!catMatch) return false;
        if (!q) return true;
        return (
          el.name.toLowerCase().includes(q) ||
          el.symbol.toLowerCase().includes(q) ||
          String(el.number) === q
        );
      }).map((el) => el.number)
    );
  }, [elementSearch, selectedCategory]);

  const hasActiveFilter = elementSearch.trim().length > 0 || selectedCategory !== 'all';

  return (
    <div className="space-y-6">
      {/* Percentage Calculator */}
      {toolSlug === 'percentage-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'whatIs', label: 'What is X% of Y?' },
              { id: 'isWhat', label: 'X is what % of Y?' },
              { id: 'increase', label: 'Percentage Change from X to Y' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPercMode(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  percMode === tab.id
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {percMode === 'whatIs' ? 'Percentage (X %)' : 'First Value (X)'}
              </label>
              <input
                type="number"
                value={pVal1}
                onChange={(e) => setPVal1(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-base font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {percMode === 'whatIs' ? 'Total (Y)' : 'Second Value (Y)'}
              </label>
              <input
                type="number"
                value={pVal2}
                onChange={(e) => setPVal2(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-base font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center">
            <span className="text-xs text-violet-600 dark:text-violet-400 font-medium block mb-1">Result</span>
            <span className="text-3xl font-extrabold font-mono text-violet-600 dark:text-violet-400">
              {percMode === 'whatIs'
                ? ((pVal1 / 100) * pVal2).toFixed(2)
                : percMode === 'isWhat'
                ? `${(((pVal1 || 0) / (pVal2 || 1)) * 100).toFixed(2)}%`
                : `${((((pVal2 || 0) - (pVal1 || 0)) / (pVal1 || 1)) * 100).toFixed(2)}%`}
            </span>
          </div>
        </div>
      )}

      {/* CGPA / GPA Calculator */}
      {(toolSlug === 'cgpa-calculator' || toolSlug === 'gpa-calculator') && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Courses & Grades</span>
            <button
              onClick={() =>
                setCourses([
                  ...courses,
                  { name: `Course ${courses.length + 1}`, credits: 3, grade: 9 },
                ])
              }
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500"
            >
              <Plus className="w-3.5 h-3.5" /> Add Course
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
              >
                <div className="col-span-6 sm:col-span-5">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => {
                      const updated = [...courses];
                      updated[idx].name = e.target.value;
                      setCourses(updated);
                    }}
                    className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="col-span-3 sm:col-span-3">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Credits"
                    value={course.credits}
                    onChange={(e) => {
                      const updated = [...courses];
                      updated[idx].credits = Number(e.target.value);
                      setCourses(updated);
                    }}
                    className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center"
                  />
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    placeholder="Grade (0-10)"
                    value={course.grade}
                    onChange={(e) => {
                      const updated = [...courses];
                      updated[idx].grade = Number(e.target.value);
                      setCourses(updated);
                    }}
                    className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => setCourses(courses.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-pink-600/10 border border-violet-500/25 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Estimated Grade Point Average
            </span>
            <span className="text-4xl font-extrabold font-mono text-violet-600 dark:text-violet-400">
              {calculatedGpa} / 10.0
            </span>
          </div>
        </div>
      )}

      {/* Pomodoro & Timers */}
      {(toolSlug === 'pomodoro-timer' || toolSlug === 'study-timer' || toolSlug === 'stopwatch') && (
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col items-center text-center space-y-6">
          {toolSlug === 'pomodoro-timer' && (
            <div className="flex gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              {(['work', 'short', 'long'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchPomo(m)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    pomoMode === m
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m === 'work' ? 'Focus (25m)' : m === 'short' ? 'Short Break (5m)' : 'Long Break (15m)'}
                </button>
              ))}
            </div>
          )}

          <div className="w-56 h-56 rounded-full border-4 border-violet-500/30 flex items-center justify-center shadow-lg relative bg-violet-500/5">
            <span className="text-5xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
              {formatTimer(timerSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-all"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(toolSlug === 'stopwatch' ? 0 : 25 * 60);
              }}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Fraction Calculator */}
      {toolSlug === 'fraction-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
            <div className="flex flex-col items-center gap-1 w-20">
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(Number(e.target.value))}
                className="w-full text-center py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
              />
              <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700" />
              <input
                type="number"
                value={den1}
                onChange={(e) => setDen1(Number(e.target.value))}
                className="w-full text-center py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
              />
            </div>

            <div className="flex gap-1">
              {(['+', '-', '*', '/'] as const).map((op) => (
                <button
                  key={op}
                  onClick={() => setFracOp(op)}
                  className={`w-8 h-8 rounded-lg font-bold ${
                    fracOp === op ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {op === '*' ? '×' : op === '/' ? '÷' : op}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1 w-20">
              <input
                type="number"
                value={num2}
                onChange={(e) => setNum2(Number(e.target.value))}
                className="w-full text-center py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
              />
              <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700" />
              <input
                type="number"
                value={den2}
                onChange={(e) => setDen2(Number(e.target.value))}
                className="w-full text-center py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center">
            <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold block mb-1">
              Simplified Fraction Result
            </span>
            <span className="text-3xl font-extrabold font-mono text-violet-600 dark:text-violet-400">
              {fractionResult.simplified}
            </span>
            <span className="text-xs text-slate-400 block mt-1">Decimal: {fractionResult.decimal}</span>
          </div>
        </div>
      )}

      {/* Scientific Calculator */}
      {toolSlug === 'scientific-calculator' && (
        <div className="max-w-md mx-auto p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg space-y-4">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 text-right overflow-x-auto border border-slate-200 dark:border-slate-800">
            <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
              {calcDisplay}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
            {['sin(', 'cos(', 'tan(', 'C', 'sqrt(', 'log(', 'π', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '(', ')'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcButton(btn)}
                className={`py-3 rounded-xl transition-colors ${
                  btn === 'C'
                    ? 'bg-rose-500/15 text-rose-600 hover:bg-rose-500/25'
                    : ['÷', '×', '-', '+'].includes(btn)
                    ? 'bg-violet-600 text-white hover:bg-violet-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => handleCalcButton('=')}
              className="col-span-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow"
            >
              =
            </button>
          </div>
        </div>
      )}

      {/* Random Question / Name Picker */}
      {toolSlug === 'random-question-picker' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            List of Questions / Names (One per line)
          </label>
          <textarea
            value={questionsInput}
            onChange={(e) => setQuestionsInput(e.target.value)}
            className="w-full h-40 p-3 text-xs font-sans rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
          <button
            onClick={handlePickQuestion}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
          >
            <Shuffle className="w-4 h-4" /> Pick a Random Item
          </button>
          {pickedQuestion && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/15 to-purple-600/15 border border-violet-500/30 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-500 block mb-2">
                Randomly Selected:
              </span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{pickedQuestion}</p>
            </div>
          )}
        </div>
      )}

      {/* Interactive Chemistry Periodic Table (118 Elements) */}
      {toolSlug === 'periodic-table' && (
        <div className="space-y-5">
          {/* Search & Category Controls */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={elementSearch}
                  onChange={(e) => setElementSearch(e.target.value)}
                  placeholder="Search by element name, symbol (Fe), or atomic # (26)..."
                  aria-label="Search chemical elements"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <Atom className="w-4 h-4 text-violet-500" />
                <span>{matchingNumbers.size} / 118 elements highlighted</span>
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setElementSearch('');
                      setSelectedCategory('all');
                    }}
                    className="ml-2 text-violet-600 dark:text-violet-400 font-sans font-semibold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                All Elements
              </button>
              {(Object.entries(CATEGORY_META) as [ElementCategory, typeof CATEGORY_META[ElementCategory]][]).map(
                ([catKey, meta]) => (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCategory(selectedCategory === catKey ? 'all' : catKey)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all whitespace-nowrap ${
                      selectedCategory === catKey
                        ? `${meta.badgeClass} ring-1 ring-current`
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {meta.label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Element Detail Inspector Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${
                    CATEGORY_META[activeElement.category].cellClass
                  }`}
                >
                  <span className="text-[11px] font-mono font-bold tabular-nums opacity-80">
                    {activeElement.number}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none my-0.5">
                    {activeElement.symbol}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums opacity-80">
                    {activeElement.mass}
                  </span>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {activeElement.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        CATEGORY_META[activeElement.category].badgeClass
                      }`}
                    >
                      {CATEGORY_META[activeElement.category].label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {activeElement.summary}
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(
                          `${activeElement.name} (${activeElement.symbol}) — Z=${activeElement.number}, Mass=${activeElement.mass} u, Config=${activeElement.electronConfig}`
                        );
                        setCopiedElem(true);
                        triggerSound('click');
                        setTimeout(() => setCopiedElem(false), 1800);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-violet-500 transition-colors"
                    >
                      {copiedElem ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedElem ? 'Copied Element Info' : 'Copy Element Summary'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2.5 shrink-0 text-xs min-w-[240px]">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Electron Config
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {activeElement.electronConfig}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Group / Period
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums mt-0.5 block">
                    G{activeElement.group} · P{activeElement.period}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Standard Phase
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                    {activeElement.phase}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Electronegativity
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums mt-0.5 block">
                    {activeElement.electronegativity}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1 md:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Discovered
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums mt-0.5 block">
                    {activeElement.discovered}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 18-Column Periodic Table Matrix (Horizontally scrollable on narrow screens) */}
          <div className="p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-x-auto">
            <div
              className="grid gap-1 min-w-[760px]"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(38px, 1fr))',
                gridTemplateRows: 'repeat(10, auto)',
              }}
              role="grid"
              aria-label="Periodic Table of Elements"
            >
              {/* Series placeholders in rows 6 & 7 col 3 */}
              <div
                style={{ gridColumn: 3, gridRow: 6 }}
                className="p-1 rounded-lg border border-dashed border-indigo-400/40 bg-indigo-500/5 flex flex-col items-center justify-center text-[9px] font-mono text-indigo-500"
                title="Lanthanides (57–71) shown below"
              >
                <span>57–71</span>
                <span className="font-bold">La–Lu</span>
              </div>
              <div
                style={{ gridColumn: 3, gridRow: 7 }}
                className="p-1 rounded-lg border border-dashed border-pink-400/40 bg-pink-500/5 flex flex-col items-center justify-center text-[9px] font-mono text-pink-500"
                title="Actinides (89–103) shown below"
              >
                <span>89–103</span>
                <span className="font-bold">Ac–Lr</span>
              </div>

              {/* Row 8 spacer */}
              <div style={{ gridColumn: '1 / 19', gridRow: 8 }} className="h-3" />

              {PERIODIC_ELEMENTS.map((el) => {
                const isSelected = activeElementNum === el.number;
                const isMatch = matchingNumbers.has(el.number);
                const meta = CATEGORY_META[el.category];

                return (
                  <button
                    key={el.number}
                    type="button"
                    onClick={() => {
                      setActiveElementNum(el.number);
                      triggerSound('click');
                    }}
                    style={{ gridColumn: el.col, gridRow: el.row }}
                    title={`${el.number} ${el.name} (${el.symbol}) — ${el.mass}`}
                    aria-pressed={isSelected}
                    className={`p-1 rounded-lg border text-left transition-all flex flex-col justify-between min-h-[46px] ${
                      meta.cellClass
                    } ${
                      isSelected
                        ? 'ring-2 ring-slate-900 dark:ring-white scale-105 z-10 shadow-md'
                        : ''
                    } ${hasActiveFilter && !isMatch ? 'opacity-20' : 'opacity-100'}`}
                  >
                    <span className="text-[8px] font-mono leading-none tabular-nums opacity-80">
                      {el.number}
                    </span>
                    <span className="text-xs font-black leading-tight tracking-tight text-center">
                      {el.symbol}
                    </span>
                    <span className="text-[7px] leading-none truncate opacity-75 text-center">
                      {el.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
