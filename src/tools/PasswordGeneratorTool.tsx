import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Copy, RefreshCw, Check, Shield, AlertCircle, Sparkles } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';
import { getSavedPreference, savePreference } from '../utils/storage';

interface PasswordPreferences {
  length: number;
  includeUpper: boolean;
  includeLower: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  avoidAmbiguous: boolean;
  noDuplicates: boolean;
}

const DEFAULT_PASSWORD_PREFS: PasswordPreferences = {
  length: 16,
  includeUpper: true,
  includeLower: true,
  includeNumbers: true,
  includeSymbols: true,
  avoidAmbiguous: false,
  noDuplicates: false,
};

/**
 * Cryptographically secure unbiased random integer in [0, max - 1]
 * Uses Web Crypto API with rejection sampling to eliminate modulo bias.
 */
export function secureRandomInt(max: number): number {
  if (max <= 1) return 0;
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
    const maxUint32 = 0x100000000; // 4294967296
    const limit = Math.floor(maxUint32 / max) * max;
    const buf = new Uint32Array(1);

    while (true) {
      window.crypto.getRandomValues(buf);
      const rand = buf[0];
      if (rand < limit) {
        return rand % max;
      }
    }
  }
  return Math.floor(Math.random() * max);
}

/**
 * Fisher-Yates array shuffle using cryptographically secure unbiased selection.
 */
export function secureShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export const PasswordGeneratorTool: React.FC = () => {
  const { showToast } = useToast();
  const initialPrefs = useMemo(() => {
    const saved = getSavedPreference<PasswordPreferences>('password-generator', DEFAULT_PASSWORD_PREFS);
    return {
      length: typeof saved?.length === 'number' && saved.length >= 4 && saved.length <= 128 ? saved.length : 16,
      includeUpper: typeof saved?.includeUpper === 'boolean' ? saved.includeUpper : true,
      includeLower: typeof saved?.includeLower === 'boolean' ? saved.includeLower : true,
      includeNumbers: typeof saved?.includeNumbers === 'boolean' ? saved.includeNumbers : true,
      includeSymbols: typeof saved?.includeSymbols === 'boolean' ? saved.includeSymbols : true,
      avoidAmbiguous: typeof saved?.avoidAmbiguous === 'boolean' ? saved.avoidAmbiguous : false,
      noDuplicates: typeof saved?.noDuplicates === 'boolean' ? saved.noDuplicates : false,
    };
  }, []);

  const [length, setLength] = useState<number>(initialPrefs.length);
  const [includeUpper, setIncludeUpper] = useState<boolean>(initialPrefs.includeUpper);
  const [includeLower, setIncludeLower] = useState<boolean>(initialPrefs.includeLower);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(initialPrefs.includeNumbers);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(initialPrefs.includeSymbols);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(initialPrefs.avoidAmbiguous);
  const [noDuplicates, setNoDuplicates] = useState<boolean>(initialPrefs.noDuplicates);

  // Sync harmless preferences across visits
  useEffect(() => {
    savePreference<PasswordPreferences>('password-generator', {
      length,
      includeUpper,
      includeLower,
      includeNumbers,
      includeSymbols,
      avoidAmbiguous,
      noDuplicates,
    });
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, avoidAmbiguous, noDuplicates]);

  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

    const categories: string[] = [];
    if (includeUpper && upper.length > 0) categories.push(upper);
    if (includeLower && lower.length > 0) categories.push(lower);
    if (includeNumbers && nums.length > 0) categories.push(nums);
    if (includeSymbols && syms.length > 0) categories.push(syms);

    if (categories.length === 0) {
      setPassword('');
      setError('Please select at least one character set.');
      return;
    }

    const combinedPool = categories.join('');
    const uniquePoolChars = Array.from(new Set(combinedPool));

    if (noDuplicates && length > uniquePoolChars.length) {
      setPassword('');
      setError(
        `Requested length (${length}) exceeds total unique characters in selected pool (${uniquePoolChars.length}). Disable "No duplicate characters" or increase pool.`
      );
      return;
    }

    setError(null);

    // 1. Guaranteed selection: pick at least one character from each enabled category (unbiased Web Crypto)
    const passwordChars: string[] = [];
    const usedChars = new Set<string>();

    for (const pool of categories) {
      let chosen: string;
      if (noDuplicates) {
        const available = Array.from(pool).filter((c) => !usedChars.has(c));
        if (available.length > 0) {
          chosen = available[secureRandomInt(available.length)];
          usedChars.add(chosen);
        } else {
          chosen = pool[secureRandomInt(pool.length)];
        }
      } else {
        chosen = pool[secureRandomInt(pool.length)];
      }
      passwordChars.push(chosen);
    }

    // 2. Fill remaining length with unbiased Web Crypto selection
    while (passwordChars.length < length) {
      if (noDuplicates) {
        const available = uniquePoolChars.filter((c) => !usedChars.has(c));
        if (available.length === 0) break;
        const chosen = available[secureRandomInt(available.length)];
        usedChars.add(chosen);
        passwordChars.push(chosen);
      } else {
        const chosen = combinedPool[secureRandomInt(combinedPool.length)];
        passwordChars.push(chosen);
      }
    }

    // If initial guaranteed categories exceeded requested length, truncate
    const trimmed = passwordChars.slice(0, length);

    // 3. Cryptographically secure Fisher-Yates shuffle
    const shuffled = secureShuffle(trimmed);
    const finalPassword = shuffled.join('');

    setPassword(finalPassword);
    setCopied(false);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, avoidAmbiguous, noDuplicates]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (!password) return;
    const ok = await copyToClipboard(password);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Password copied to clipboard', 'success');
      addScratchpadItem('password-generator', password, `${length} chars (Encrypted entropy)`);
    }
  };

  // Password Entropy & Strength Evaluation
  const strengthInfo = useMemo(() => {
    if (!password) return { label: 'None', color: 'bg-neutral-300 dark:bg-neutral-700', percent: 0, bits: 0 };

    let poolSize = 0;
    if (includeUpper) poolSize += avoidAmbiguous ? 24 : 26;
    if (includeLower) poolSize += avoidAmbiguous ? 24 : 26;
    if (includeNumbers) poolSize += avoidAmbiguous ? 8 : 10;
    if (includeSymbols) poolSize += avoidAmbiguous ? 21 : 26;

    const entropyBits = Math.round(password.length * (Math.log2(poolSize || 1)));

    if (entropyBits < 40) return { label: 'Weak', color: 'bg-red-500', percent: 25, bits: entropyBits };
    if (entropyBits < 64) return { label: 'Moderate', color: 'bg-amber-500', percent: 50, bits: entropyBits };
    if (entropyBits < 80) return { label: 'Strong', color: 'bg-blue-500', percent: 75, bits: entropyBits };
    return { label: 'Very Strong', color: 'bg-emerald-500', percent: 100, bits: entropyBits };
  }, [password, includeUpper, includeLower, includeNumbers, includeSymbols, avoidAmbiguous]);

  return (
    <div className="space-y-6">
      {/* Password Output Box */}
      <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-4 animate-result-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            data-action="output"
            className="flex-1 font-mono text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-wider break-all select-all py-1"
          >
            {password || <span className="text-neutral-400 font-sans text-sm font-normal">Select at least one character type</span>}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={generatePassword}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Regenerate password (crypto.getRandomValues)"
              aria-label="Regenerate password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              data-action="primary"
              onClick={handleCopy}
              disabled={!password}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Password'}</span>
            </button>
          </div>
        </div>

        {/* Strength & Entropy meter */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-neutral-500" />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                Strength: <strong>{strengthInfo.label}</strong>
              </span>
            </div>
            <span className="text-neutral-400 font-mono text-[11px]">
              ~{strengthInfo.bits} bits entropy (Web Crypto API)
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strengthInfo.color}`}
              style={{ width: `${strengthInfo.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Controls & Configuration */}
      <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-5">
        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              Password Length: <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{length}</span>
            </span>
            <div className="flex gap-1">
              {[8, 12, 16, 24, 32, 64].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    length === l
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <input
            type="range"
            min="4"
            max="128"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Character Sets Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Uppercase Letters</span>
              <span className="text-[11px] text-neutral-400 font-mono">A-Z</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Lowercase Letters</span>
              <span className="text-[11px] text-neutral-400 font-mono">a-z</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Numbers</span>
              <span className="text-[11px] text-neutral-400 font-mono">0-9</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Special Symbols</span>
              <span className="text-[11px] text-neutral-400 font-mono">!@#$%^&*...</span>
            </div>
          </label>
        </div>

        {/* Security Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={avoidAmbiguous}
              onChange={(e) => setAvoidAmbiguous(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>Exclude ambiguous characters (e.g. 0, O, 1, l, I)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={noDuplicates}
              onChange={(e) => setNoDuplicates(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>No duplicate characters</span>
          </label>
        </div>
      </div>
    </div>
  );
};
