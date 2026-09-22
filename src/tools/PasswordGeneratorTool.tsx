import React, { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Check, Shield } from 'lucide-react';

export const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = useCallback(() => {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let nums = '0123456789';
    let syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (avoidAmbiguous) {
      upper = upper.replace(/[IO]/g, '');
      lower = lower.replace(/[lo]/g, '');
      nums = nums.replace(/[01]/g, '');
      syms = syms.replace(/[|;:,.]/g, '');
    }

    let charPool = '';
    const guaranteedChars: string[] = [];

    if (includeUpper) {
      charPool += upper;
      guaranteedChars.push(upper[Math.floor(Math.random() * upper.length)]);
    }
    if (includeLower) {
      charPool += lower;
      guaranteedChars.push(lower[Math.floor(Math.random() * lower.length)]);
    }
    if (includeNumbers) {
      charPool += nums;
      guaranteedChars.push(nums[Math.floor(Math.random() * nums.length)]);
    }
    if (includeSymbols) {
      charPool += syms;
      guaranteedChars.push(syms[Math.floor(Math.random() * syms.length)]);
    }

    if (!charPool) {
      setPassword('');
      return;
    }

    // Cryptographically secure random values via Web Crypto API
    const remainingLength = Math.max(0, length - guaranteedChars.length);
    const randomBytes = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomBytes);

    const generatedArray: string[] = [...guaranteedChars];
    for (let i = 0; i < remainingLength; i++) {
      const idx = randomBytes[i] % charPool.length;
      generatedArray.push(charPool[idx]);
    }

    // Shuffle using Fisher-Yates with crypto random
    const shuffleBytes = new Uint32Array(generatedArray.length);
    window.crypto.getRandomValues(shuffleBytes);
    for (let i = generatedArray.length - 1; i > 0; i--) {
      const j = shuffleBytes[i] % (i + 1);
      const temp = generatedArray[i];
      generatedArray[i] = generatedArray[j];
      generatedArray[j] = temp;
    }

    setPassword(generatedArray.join(''));
    setCopied(false);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, avoidAmbiguous]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Password Strength Evaluation
  const strength = React.useMemo(() => {
    if (!password) return { label: 'Empty', color: 'bg-neutral-300', percent: 0 };
    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (password.length >= 16) score += 20;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[a-z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;

    if (score < 40) return { label: 'Weak', color: 'bg-red-500', percent: 25 };
    if (score < 70) return { label: 'Moderate', color: 'bg-amber-500', percent: 50 };
    if (score < 90) return { label: 'Strong', color: 'bg-blue-500', percent: 75 };
    return { label: 'Very Strong', color: 'bg-emerald-500', percent: 100 };
  }, [password]);

  return (
    <div className="space-y-6">
      {/* Password Output Box */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 font-mono text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-wider break-all select-all">
            {password || <span className="text-neutral-400 font-sans text-sm">Select at least one character type</span>}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={generatePassword}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Regenerate password"
              aria-label="Regenerate password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!password}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="mt-4 pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500">Security:</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              {strength.label}
            </span>
          </div>

          <div className="w-24 sm:w-36 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="space-y-4">
        {/* Length Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="length-slider" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Password Length
            </label>
            <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
              {length} characters
            </span>
          </div>
          <input
            id="length-slider"
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Checkbox Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <span>Uppercase letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <span>Lowercase letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <span>Symbols (!@#$%^&*)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer sm:col-span-2">
            <input
              type="checkbox"
              checked={avoidAmbiguous}
              onChange={(e) => setAvoidAmbiguous(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <span>Avoid ambiguous characters (e.g. l, 1, I, O, 0)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
