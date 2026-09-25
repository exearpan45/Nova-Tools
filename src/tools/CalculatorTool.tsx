import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Delete, History, Trash2 } from 'lucide-react';
import { addScratchpadItem } from '../utils/scratchpad';

// Safe mathematical expression evaluator without eval()
export function safeEvaluateMath(expression: string): { result?: number; error?: string } {
  try {
    const cleanExpr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/MOD/gi, ' mod ')
      .trim();

    if (!cleanExpr) return { result: 0 };

    // Tokenize
    const rawTokens: string[] = [];
    let i = 0;
    while (i < cleanExpr.length) {
      const char = cleanExpr[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Check for 'mod' keyword
      if (cleanExpr.substring(i, i + 3).toLowerCase() === 'mod') {
        rawTokens.push('mod');
        i += 3;
        continue;
      }

      if (char === '+' || char === '-' || char === '*' || char === '/' || char === '(' || char === ')' || char === '%') {
        rawTokens.push(char);
        i++;
      } else if (/\d|\./.test(char)) {
        let numStr = '';
        let dotCount = 0;
        while (i < cleanExpr.length && (/\d|\./.test(cleanExpr[i]))) {
          if (cleanExpr[i] === '.') {
            dotCount++;
            if (dotCount > 1) return { error: 'Invalid decimal number' };
          }
          numStr += cleanExpr[i];
          i++;
        }
        rawTokens.push(numStr);
      } else {
        return { error: `Unexpected character: '${char}'` };
      }
    }

    if (rawTokens.length === 0) return { result: 0 };

    // Process unary operators and percentage:
    // If '-' is at the start or follows an operator or '(', it is unary minus.
    // If '%' follows a number or ')', it is unary postfix percentage (divide preceding operand by 100).
    const tokens: string[] = [];
    for (let j = 0; j < rawTokens.length; j++) {
      const token = rawTokens[j];
      const prev = j > 0 ? rawTokens[j - 1] : null;

      if (token === '-') {
        const isUnary = !prev || ['+', '-', '*', '/', 'mod', '('].includes(prev);
        if (isUnary) {
          tokens.push('u-');
          continue;
        }
      }

      if (token === '+') {
        const isUnary = !prev || ['+', '-', '*', '/', 'mod', '('].includes(prev);
        if (isUnary) {
          // Unary plus can be ignored
          continue;
        }
      }

      if (token === '%') {
        // Unary postfix percentage: converts preceding value to (val / 100)
        tokens.push('%');
        continue;
      }

      tokens.push(token);
    }

    // Shunting-yard algorithm to convert to RPN
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    const precedence: Record<string, number> = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
      'mod': 2,
      'u-': 3,
      '%': 4, // highest precedence for unary postfix percentage
    };

    for (const token of tokens) {
      if (!isNaN(Number(token))) {
        outputQueue.push(token);
      } else if (token === '%') {
        // Unary postfix % operates immediately on the operand
        outputQueue.push('%');
      } else if (token === 'u-') {
        operatorStack.push('u-');
      } else if (token in precedence) {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] in precedence &&
          precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        let matched = false;
        while (operatorStack.length > 0) {
          const top = operatorStack.pop()!;
          if (top === '(') {
            matched = true;
            break;
          }
          outputQueue.push(top);
        }
        if (!matched) return { error: 'Mismatched parentheses' };
      } else {
        return { error: `Invalid syntax near '${token}'` };
      }
    }

    while (operatorStack.length > 0) {
      const top = operatorStack.pop()!;
      if (top === '(' || top === ')') return { error: 'Mismatched parentheses' };
      outputQueue.push(top);
    }

    // Evaluate RPN
    const evalStack: number[] = [];
    for (const token of outputQueue) {
      if (!isNaN(Number(token))) {
        evalStack.push(Number(token));
      } else if (token === '%') {
        const val = evalStack.pop();
        if (val === undefined) return { error: 'Invalid expression' };
        evalStack.push(val / 100);
      } else if (token === 'u-') {
        const val = evalStack.pop();
        if (val === undefined) return { error: 'Invalid expression' };
        evalStack.push(-val);
      } else {
        const b = evalStack.pop();
        const a = evalStack.pop();
        if (b === undefined || a === undefined) return { error: 'Invalid expression' };

        let res = 0;
        switch (token) {
          case '+':
            res = a + b;
            break;
          case '-':
            res = a - b;
            break;
          case '*':
            res = a * b;
            break;
          case '/':
            if (b === 0) return { error: 'Cannot divide by zero' };
            res = a / b;
            break;
          case 'mod':
            if (b === 0) return { error: 'Cannot divide by zero' };
            res = a % b;
            break;
          default:
            return { error: 'Unknown operator' };
        }
        evalStack.push(res);
      }
    }

    if (evalStack.length !== 1) return { error: 'Invalid expression' };
    const finalVal = evalStack[0];
    if (isNaN(finalVal) || !isFinite(finalVal)) return { error: 'Math error' };

    // Floating-point precision normalization: 12 decimal places
    const normalized = Math.round(finalVal * 1e12) / 1e12;
    return { result: normalized };
  } catch {
    return { error: 'Invalid expression' };
  }
}

export const CalculatorTool: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInput = useCallback((val: string) => {
    setErrorMessage(null);
    setExpression((prev) => {
      // Prevent multiple consecutive decimal points or multiple decimals in the same number
      if (val === '.') {
        const lastPart = prev.split(/[\+\-\×\÷\*\/\(\)\s]|mod/i).pop() || '';
        if (lastPart.includes('.')) return prev;
        if (!lastPart) return prev + '0.';
      }
      // If typing an operator and previous is operator, replace it (unless it's unary minus)
      if (['+', '-', '×', '÷'].includes(val)) {
        const trimmed = prev.trim();
        if (trimmed && ['+', '-', '×', '÷', '*', '/'].includes(trimmed[trimmed.length - 1])) {
          if (val === '-' && trimmed[trimmed.length - 1] !== '-') {
            return prev + ' -';
          }
          return trimmed.slice(0, -1) + val;
        }
      }
      if (val === 'mod') {
        return prev + ' mod ';
      }
      return prev + val;
    });
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
    setErrorMessage(null);
  }, []);

  const handleBackspace = useCallback(() => {
    setErrorMessage(null);
    setExpression((prev) => {
      if (prev.endsWith(' mod ')) return prev.slice(0, -5);
      return prev.slice(0, -1);
    });
  }, []);

  const handleCalculate = useCallback(() => {
    if (!expression.trim()) return;
    const { result, error } = safeEvaluateMath(expression);
    if (error) {
      setErrorMessage(error);
    } else if (result !== undefined) {
      const resStr = result.toString();
      setHistory((prev) => [{ expr: expression, result: resStr }, ...prev.slice(0, 19)]);
      setExpression(resStr);
      setErrorMessage(null);
      addScratchpadItem('calculator', resStr, expression);
    }
  }, [expression]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an external text input is focused
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key;
      if (/\d/.test(key)) {
        handleInput(key);
      } else if (['+', '-', '(', ')', '%'].includes(key)) {
        handleInput(key);
      } else if (key === '*') {
        handleInput('×');
      } else if (key === '/') {
        e.preventDefault();
        handleInput('÷');
      } else if (key === '.') {
        handleInput('.');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleCalculate, handleBackspace, handleClear]);

  const auxButtons = [
    { label: 'C', action: handleClear, type: 'clear' },
    { label: '(', action: () => handleInput('('), type: 'fn' },
    { label: ')', action: () => handleInput(')'), type: 'fn' },
    { label: '%', action: () => handleInput('%'), type: 'fn', title: 'Percentage (÷ 100)' },
    { label: 'mod', action: () => handleInput('mod'), type: 'fn', title: 'Modulo / Remainder' },
  ];

  const mainButtons = [
    { label: '7', action: () => handleInput('7'), type: 'num' },
    { label: '8', action: () => handleInput('8'), type: 'num' },
    { label: '9', action: () => handleInput('9'), type: 'num' },
    { label: '÷', action: () => handleInput('÷'), type: 'op' },

    { label: '4', action: () => handleInput('4'), type: 'num' },
    { label: '5', action: () => handleInput('5'), type: 'num' },
    { label: '6', action: () => handleInput('6'), type: 'num' },
    { label: '×', action: () => handleInput('×'), type: 'op' },

    { label: '1', action: () => handleInput('1'), type: 'num' },
    { label: '2', action: () => handleInput('2'), type: 'num' },
    { label: '3', action: () => handleInput('3'), type: 'num' },
    { label: '-', action: () => handleInput('-'), type: 'op' },

    { label: '0', action: () => handleInput('0'), type: 'num' },
    { label: '.', action: () => handleInput('.'), type: 'num' },
    { label: '=', action: handleCalculate, type: 'equals' },
    { label: '+', action: () => handleInput('+'), type: 'op' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calculator Body */}
      <div className="flex-1 max-w-sm mx-auto w-full">
        {/* Display Area */}
        <div className="mb-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-right">
          <div className="min-h-[20px] text-xs text-neutral-400 font-mono overflow-x-auto whitespace-nowrap">
            {errorMessage ? (
              <span className="text-red-500 font-sans font-medium">{errorMessage}</span>
            ) : (
              expression ? 'Calculating...' : 'Ready'
            )}
          </div>
          <div
            data-action="output"
            className="text-2xl sm:text-3xl font-mono font-medium tracking-tight text-neutral-900 dark:text-neutral-100 overflow-x-auto whitespace-nowrap py-1"
          >
            {expression || '0'}
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800 text-[11px] text-neutral-400">
            <span>Keyboard supported</span>
            <button
              onClick={handleBackspace}
              className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              title="Backspace"
              aria-label="Backspace"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Function Distinction Note */}
        <div className="mb-3 px-3 py-1.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <span><strong>%</strong> = Percentage (÷ 100)</span>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <span><strong>mod</strong> = Remainder (e.g. 10 mod 3 = 1)</span>
        </div>

        {/* Top Auxiliary Row */}
        <div className="grid grid-cols-5 gap-1.5 mb-2">
          {auxButtons.map((btn, index) => {
            const isClear = btn.type === 'clear';
            return (
              <button
                key={index}
                onClick={btn.action}
                title={btn.title}
                data-action={isClear ? 'reset' : undefined}
                className={`h-10 rounded-lg border text-sm font-mono flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95 ${
                  isClear
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 border-red-200 dark:border-red-900/50 font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Main 4x4 Grid */}
        <div className="grid grid-cols-4 gap-2">
          {mainButtons.map((btn, index) => {
            let colorClasses = 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700/80';
            if (btn.type === 'op') {
              colorClasses = 'bg-neutral-100 dark:bg-neutral-700 text-blue-600 dark:text-blue-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 font-semibold border-neutral-200 dark:border-neutral-600';
            } else if (btn.type === 'equals') {
              colorClasses = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold border-blue-600';
            }

            return (
              <button
                key={index}
                onClick={btn.action}
                data-action={btn.type === 'equals' ? 'primary' : undefined}
                className={`h-12 rounded-lg border text-base font-mono flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95 ${colorClasses}`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* History Sidebar */}
      <div className="flex-1 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-4 md:pt-0 md:pl-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <History className="w-3.5 h-3.5" />
            <span>Calculation History</span>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="text-xs text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 italic py-4">
            Recent calculations will appear here.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setExpression(item.result)}
                className="w-full p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800 text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono truncate">
                  {item.expr} =
                </div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.result}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
