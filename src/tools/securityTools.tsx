import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, KeyRound, Key, ShieldAlert, Fingerprint, Lock,
  FileCheck, Shield, Link, CheckCircle, RefreshCw, Copy, Check
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface SecurityProps {
  toolSlug: string;
}

export const SecurityTools: React.FC<SecurityProps> = ({ toolSlug }) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Password Generator states
  const [passLength, setPassLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNums, setIncludeNums] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  // Memorable passphrase states
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');
  const [passphrase, setPassphrase] = useState<string>('');

  // Password Strength Checker input
  const [testPassword, setTestPassword] = useState<string>('P@ssw0rd!2026Secure');

  // Checksum comparison
  const [expectedHash, setExpectedHash] = useState<string>('');
  const [actualInput, setActualInput] = useState<string>('Verify file authenticity');
  const [computedSha256, setComputedSha256] = useState<string>('');

  // Text Encryption / Decryption states
  const [cryptoText, setCryptoText] = useState<string>('Confidential NOVA notes and keys');
  const [cryptoPassword, setCryptoPassword] = useState<string>('SuperSecretPass123!');
  const [cryptoMode, setCryptoMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [cryptoResult, setCryptoResult] = useState<string>('');
  const [cryptoError, setCryptoError] = useState<string>('');

  const handleEncryptDecrypt = async () => {
    setCryptoError('');
    if (!cryptoPassword) {
      setCryptoError('Please enter a secret passphrase.');
      return;
    }
    try {
      const enc = new TextEncoder();
      const dec = new TextDecoder();
      const passKey = await crypto.subtle.importKey(
        'raw',
        enc.encode(cryptoPassword),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      const salt = new Uint8Array([110, 111, 118, 97, 95, 115, 101, 99, 117, 114, 101, 95, 115, 97, 108, 116]);
      const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        passKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      if (cryptoMode === 'encrypt') {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv },
          key,
          enc.encode(cryptoText)
        );
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encrypted), iv.length);
        const b64 = btoa(String.fromCharCode(...combined));
        setCryptoResult(b64);
      } else {
        const raw = atob(cryptoText.trim());
        const combined = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) combined[i] = raw.charCodeAt(i);
        if (combined.length < 13) throw new Error('Ciphertext is too short or malformed.');
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          key,
          data
        );
        setCryptoResult(dec.decode(decrypted));
      }
    } catch (err: any) {
      setCryptoError(cryptoMode === 'decrypt' ? 'Decryption failed. Incorrect password or corrupted ciphertext.' : err.message || 'Encryption error');
      setCryptoResult('');
    }
  };

  // Generate strong password
  const generateNewPassword = () => {
    let charset = '';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNums) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    const array = new Uint32Array(passLength);
    crypto.getRandomValues(array);
    let pwd = '';
    for (let i = 0; i < passLength; i++) {
      pwd += charset[array[i] % charset.length];
    }
    setGeneratedPassword(pwd);
  };

  // Generate memorable passphrase
  const generatePassphrase = () => {
    const dictionary = [
      'apple', 'beacon', 'breeze', 'canvas', 'castle', 'clover', 'cosmic', 'dragon',
      'echo', 'falcon', 'galaxy', 'harbor', 'island', 'jungle', 'knight', 'legend',
      'matrix', 'nebula', 'ocean', 'planet', 'quantum', 'river', 'shadow', 'timber',
      'voyage', 'whisper', 'zenith', 'autumn', 'horizon', 'glacier', 'meteor', 'spark'
    ];
    const array = new Uint32Array(wordCount);
    crypto.getRandomValues(array);
    const chosen = Array.from(array).map((val) => dictionary[val % dictionary.length]);
    setPassphrase(chosen.join(separator));
  };

  React.useEffect(() => {
    generateNewPassword();
    generatePassphrase();
  }, []);

  // Compute checksum for checksum-generator
  React.useEffect(() => {
    const calc = async () => {
      const data = new TextEncoder().encode(actualInput);
      const hashBuf = await crypto.subtle.digest('SHA-256', data);
      const hex = Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      setComputedSha256(hex);
    };
    calc();
  }, [actualInput]);

  // Password Entropy & Strength Evaluator
  const strengthResult = useMemo(() => {
    const pwd = testPassword;
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33;

    const entropy = pool > 0 ? Math.round(pwd.length * Math.log2(pool)) : 0;
    let status = 'Weak';
    let color = 'text-rose-500';
    let crackTime = 'A few seconds';

    if (entropy > 80) {
      status = 'Very Strong';
      color = 'text-emerald-500';
      crackTime = 'Several centuries';
    } else if (entropy > 60) {
      status = 'Strong';
      color = 'text-teal-500';
      crackTime = 'Several years';
    } else if (entropy > 40) {
      status = 'Moderate';
      color = 'text-amber-500';
      crackTime = 'A few days';
    }

    return { entropy, status, color, crackTime };
  }, [testPassword]);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Password Generator */}
      {toolSlug === 'password-generator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="font-mono text-lg font-bold text-slate-900 dark:text-white break-all">
              {generatedPassword}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(generatedPassword)}
                className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                title="Copy Password"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={generateNewPassword}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Password Length</span>
              <span className="font-mono font-bold text-red-500">{passLength} characters</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={passLength}
              onChange={(e) => setPassLength(Number(e.target.value))}
              className="w-full accent-red-500"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded text-red-500"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="rounded text-red-500"
                />
                Lowercase (a-z)
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNums}
                  onChange={(e) => setIncludeNums(e.target.checked)}
                  className="rounded text-red-500"
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded text-red-500"
                />
                Symbols (!@#$)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Memorable Passphrase */}
      {toolSlug === 'random-password' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="font-mono text-lg font-bold text-red-600 dark:text-red-400 break-all">
              {passphrase}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(passphrase)}
                className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={generatePassphrase}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Number of Words ({wordCount})</label>
              <input
                type="range"
                min="3"
                max="8"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Separator</label>
              <div className="flex gap-2">
                {['-', '.', '_', ' '].map((sep) => (
                  <button
                    key={sep}
                    onClick={() => setSeparator(sep)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold ${
                      separator === sep ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {sep === ' ' ? 'space' : sep}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Strength Checker */}
      {toolSlug === 'password-strength-checker' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Enter Password to Evaluate
            </label>
            <input
              type="text"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-base font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Strength Rating</span>
              <span className={`text-2xl font-bold font-mono ${strengthResult.color}`}>
                {strengthResult.status}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Entropy</span>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                ~{strengthResult.entropy} bits
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Estimated Crack Time</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {strengthResult.crackTime}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Checksum Generator & Validator */}
      {toolSlug === 'checksum-generator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Data String
            </label>
            <input
              type="text"
              value={actualInput}
              onChange={(e) => setActualInput(e.target.value)}
              className="w-full px-4 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">Computed SHA-256 Checksum:</span>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-red-500 break-all">
              {computedSha256}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Expected Hash (To Verify Integrity)
            </label>
            <input
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value.trim().toLowerCase())}
              placeholder="Paste checksum to compare..."
              className="w-full px-4 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          {expectedHash && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                expectedHash === computedSha256
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
              }`}
            >
              {expectedHash === computedSha256
                ? '✓ Checksums match perfectly. File integrity verified.'
                : '✕ Checksums do NOT match. File or data has been modified.'}
            </div>
          )}
        </div>
      )}
      {/* Text Encryption & Decryption (AES-GCM Web Crypto) */}
      {toolSlug === 'text-encrypt-decrypt' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-5">
          <div className="flex gap-2">
            <button
              onClick={() => { setCryptoMode('encrypt'); setCryptoResult(''); setCryptoError(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                cryptoMode === 'encrypt'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Encrypt (AES-GCM 256-bit)
            </button>
            <button
              onClick={() => { setCryptoMode('decrypt'); setCryptoResult(''); setCryptoError(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                cryptoMode === 'decrypt'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Decrypt
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {cryptoMode === 'encrypt' ? 'Plaintext to Encrypt' : 'Base64 Ciphertext to Decrypt'}
            </label>
            <textarea
              rows={4}
              value={cryptoText}
              onChange={(e) => setCryptoText(e.target.value)}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Secret Passphrase (Key Derivation)
            </label>
            <input
              type="password"
              value={cryptoPassword}
              onChange={(e) => setCryptoPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <button
            onClick={handleEncryptDecrypt}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{cryptoMode === 'encrypt' ? 'Encrypt Text Locally' : 'Decrypt Ciphertext'}</span>
          </button>

          {cryptoError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {cryptoError}
            </div>
          )}

          {cryptoResult && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {cryptoMode === 'encrypt' ? 'Encrypted Output (Base64)' : 'Decrypted Plaintext'}
                </span>
                <button
                  onClick={() => handleCopy(cryptoResult)}
                  className="text-xs flex items-center gap-1.5 text-red-500 hover:underline font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                rows={3}
                value={cryptoResult}
                className="w-full p-2.5 font-mono text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
