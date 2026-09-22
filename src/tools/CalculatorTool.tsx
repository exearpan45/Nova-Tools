import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Delete, History, Trash2 } from 'lucide-react';

// Safe mathematical expression evaluator without eval()
function safeEvaluateMath(expression: string): { result?: number; error?: string } {
  try {
    const cleanExpr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\s+/g, '');

    if (!cleanExpr) return { result: 0 };

    // Tokenize
    const tokens: string[] = [];
    let i = 0;
    while (i < cleanExpr.length) {
      const char = cleanExpr[i];

      if (char === '+' || char === '-' || char === '*' || char === '/' || char === '(' || char === ')' || char === '%') {
        // Handle unary minus
        if (char === '-' && (i === 0 || ['+', '-', '*', '/', '('].includes(cleanExpr[i - 1]))) {
          let numStr = '-';
          i++;
          while (i < cleanExpr.length && (/\d|\./.test(cleanExpr[i]))) {
            numStr += cleanExpr[i];
            i++;
          }
          if (numStr === '-') return { error: 'Invalid expression' };
          tokens.push(numStr);
          continue;
        }
        tokens.push(char);
        i++;
      } else if (/\d|\./.test(char)) {
        let numStr = '';
        while (i < cleanExpr.length && (/\d|\./.test(cleanExpr[i]))) {
          numStr += cleanExpr[i];
          i++;
        }
        tokens.push(numStr);
      } else {
        return { error: 'Unexpected character: ' + char };
      }
    }

    // Shunting-yard algorithm to convert to RPN
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];
    const precedence: Record<string, number> = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
      '%': 2
    };

    for (let token of tokens) {
      if (!isNaN(Number(token))) {
        outputQueue.push(token);
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
      }
    }

    while (operatorStack.length > 0) {
      const top = operatorStack.pop()!;
      if (top === '(' || top === ')') return { error: 'Mismatched parentheses' };
      outputQueue.push(top);
    }

    // Evaluate RPN
    const evalStack: number[] = [];
    for (let token of outputQueue) {
      if (!isNaN(Number(token))) {
        evalStack.push(Number(token));
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
          case '%':
            res = (a * b) / 100;
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
    return { result: Math.round(finalVal * 1e10) / 1e10 };
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
    setExpression((prev) => prev + val);
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
    setErrorMessage(null);
  }, []);

  const handleBackspace = useCallback(() => {
    setErrorMessage(null);
    setExpression((prev) => prev.slice(0, -1));
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

  const buttons = [
    { label: 'C', action: handleClear, type: 'clear' },
    { label: '(', action: () => handleInput('('), type: 'fn' },
    { label: ')', action: () => handleInput(')'), type: 'fn' },
    { label: '÷', action: () => handleInput('÷'), type: 'op' },

    { label: '7', action: () => handleInput('7'), type: 'num' },
    { label: '8', action: () => handleInput('8'), type: 'num' },
    { label: '9', action: () => handleInput('9'), type: 'num' },
    { label: '×', action: () => handleInput('×'), type: 'op' },

    { label: '4', action: () => handleInput('4'), type: 'num' },
    { label: '5', action: () => handleInput('5'), type: 'num' },
    { label: '6', action: () => handleInput('6'), type: 'num' },
    { label: '-', action: () => handleInput('-'), type: 'op' },

    { label: '1', action: () => handleInput('1'), type: 'num' },
    { label: '2', action: () => handleInput('2'), type: 'num' },
    { label: '3', action: () => handleInput('3'), type: 'num' },
    { label: '+', action: () => handleInput('+'), type: 'op' },

    { label: '0', action: () => handleInput('0'), type: 'num' },
    { label: '.', action: () => handleInput('.'), type: 'num' },
    { label: '%', action: () => handleInput('%'), type: 'fn' },
    { label: '=', action: handleCalculate, type: 'equals' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calculator Body */}
      <div className="flex-1 max-w-sm mx-auto w-full">
        {/* Display Area */}
        <div className="mb-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-right">
          <div className="min-h-[20px] text-xs text-neutral-400 font-mono overflow-x-auto whitespace-nowrap">
            {errorMessage ? (
              <span className="text-red-500 font-sans">{errorMessage}</span>
            ) : (
              expression ? 'Calculating...' : 'Ready'
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-medium tracking-tight text-neutral-900 dark:text-neutral-100 overflow-x-auto whitespace-nowrap py-1">
            {expression || '0'}
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800 text-xs text-neutral-400">
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

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn, index) => {
            let colorClasses = 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700/80';
            if (btn.type === 'op') {
              colorClasses = 'bg-neutral-100 dark:bg-neutral-700 text-blue-600 dark:text-blue-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 font-semibold border-neutral-200 dark:border-neutral-600';
            } else if (btn.type === 'equals') {
              colorClasses = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold border-blue-600';
            } else if (btn.type === 'clear') {
              colorClasses = 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 border-red-200 dark:border-red-900/50';
            } else if (btn.type === 'fn') {
              colorClasses = 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700';
            }

            return (
              <button
                key={index}
                onClick={btn.action}
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
