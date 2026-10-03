import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  GraduationCap, Calculator, Percent, Clock, Timer, Hourglass,
  Scale, Calendar, Award, Play, Pause, RotateCcw, Shuffle, Check, Plus, Trash2
} from 'lucide-react';
import { evaluateSafeMath } from '../utils/safeMath';

interface StudentProps {
  toolSlug: string;
}

export const StudentTools: React.FC<StudentProps> = ({ toolSlug }) => {
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

  // Pomodoro interval handler
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (toolSlug === 'stopwatch') return prev + 1;
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
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
  };

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
    </div>
  );
};
