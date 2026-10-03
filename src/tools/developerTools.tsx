import React, { useState, useMemo } from 'react';
import {
  Code2, Copy, Check, Braces, RefreshCw, Key, Shield,
  Link, Unlink, Lock, Clock, Terminal, Sparkles, FileJson, Play
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface DevProps {
  toolSlug: string;
}

export const DeveloperTools: React.FC<DevProps> = ({ toolSlug }) => {
  const [inputVal, setInputVal] = useState<string>(
    toolSlug.includes('json')
      ? '{"name":"NOVA TOOLS","type":"Productivity Suite","features":["100+ Tools","Client-Side","Zero-Upload"]}'
      : toolSlug.includes('jwt')
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFycGFuIEdvc3dhbWkiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTgwMDAwMDAwMH0.signature'
      : toolSlug.includes('regex')
      ? 'hello from nova@novatools.2bd.net and support@novatools.com'
      : 'Hello NOVA TOOLS!'
  );

  const [regexPattern, setRegexPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [regexFlags, setRegexFlags] = useState<string>('g');
  const [copied, setCopied] = useState<boolean>(false);

  // UUID batch count
  const [uuidCount, setUuidCount] = useState<number>(5);
  // Hash algorithm
  const [hashResults, setHashResults] = useState<{ sha256: string; sha512: string; sha384: string; sha1: string }>({
    sha256: '',
    sha512: '',
    sha384: '',
    sha1: ''
  });

  // Timestamp
  const [epochInput, setEpochInput] = useState<string>(Math.floor(Date.now() / 1000).toString());

  // Random string generator
  const [strLength, setStrLength] = useState<number>(32);
  const [charSet, setCharSet] = useState<{ upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }>({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });

  // Color converter states
  const [hexInput, setHexInput] = useState<string>('#3b82f6');

  // Trigger hash calculation when input changes for hash-generator
  React.useEffect(() => {
    if (toolSlug === 'hash-generator') {
      const calcHashes = async () => {
        const encoder = new TextEncoder();
        const data = encoder.encode(inputVal);
        const toHex = (buf: ArrayBuffer) =>
          Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        try {
          const s256 = await crypto.subtle.digest('SHA-256', data);
          const s512 = await crypto.subtle.digest('SHA-512', data);
          const s384 = await crypto.subtle.digest('SHA-384', data);
          const s1 = await crypto.subtle.digest('SHA-1', data);
          setHashResults({
            sha256: toHex(s256),
            sha512: toHex(s512),
            sha384: toHex(s384),
            sha1: toHex(s1),
          });
        } catch {}
      };
      calcHashes();
    }
  }, [inputVal, toolSlug]);

  // Main output processing
  const { outputText, error } = useMemo(() => {
    try {
      switch (toolSlug) {
        case 'json-formatter':
        case 'json-validator': {
          const parsed = JSON.parse(inputVal);
          return { outputText: JSON.stringify(parsed, null, 2), error: null };
        }
        case 'json-minifier': {
          const parsed = JSON.parse(inputVal);
          return { outputText: JSON.stringify(parsed), error: null };
        }
        case 'json-to-csv': {
          const parsed = JSON.parse(inputVal);
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          if (arr.length === 0) return { outputText: '', error: null };
          const keys = Object.keys(arr[0]);
          const csvLines = [
            keys.join(','),
            ...arr.map((row) => keys.map((k) => JSON.stringify(row[k] ?? '')).join(',')),
          ];
          return { outputText: csvLines.join('\n'), error: null };
        }
        case 'csv-to-json': {
          const lines = inputVal.trim().split('\n');
          if (lines.length === 0) return { outputText: '[]', error: null };
          const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
          const rows = lines.slice(1).map((line) => {
            const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
            const obj: Record<string, any> = {};
            headers.forEach((h, i) => {
              const val = values[i];
              obj[h] = !isNaN(Number(val)) && val !== '' ? Number(val) : val;
            });
            return obj;
          });
          return { outputText: JSON.stringify(rows, null, 2), error: null };
        }
        case 'base64-encoder':
          return { outputText: btoa(unescape(encodeURIComponent(inputVal))), error: null };
        case 'base64-decoder':
          return { outputText: decodeURIComponent(escape(atob(inputVal))), error: null };
        case 'url-encoder':
          return { outputText: encodeURIComponent(inputVal), error: null };
        case 'url-decoder':
          return { outputText: decodeURIComponent(inputVal), error: null };
        case 'uuid-generator': {
          const list = Array.from({ length: uuidCount }, () => crypto.randomUUID());
          return { outputText: list.join('\n'), error: null };
        }
        case 'jwt-decoder': {
          const parts = inputVal.split('.');
          if (parts.length < 2) throw new Error('Invalid JWT format (must have 3 parts separated by dots).');
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          const res = {
            header,
            payload,
            expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiration',
            issuedAt: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'Unknown',
          };
          return { outputText: JSON.stringify(res, null, 2), error: null };
        }
        case 'html-entity-encoder': {
          const enc = inputVal
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
          return { outputText: enc, error: null };
        }
        case 'html-entity-decoder': {
          const doc = new DOMParser().parseFromString(inputVal, 'text/html');
          return { outputText: doc.documentElement.textContent || '', error: null };
        }
        case 'random-string-generator': {
          let pool = '';
          if (charSet.upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          if (charSet.lower) pool += 'abcdefghijklmnopqrstuvwxyz';
          if (charSet.numbers) pool += '0123456789';
          if (charSet.symbols) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?';
          if (!pool) pool = 'abcdefghijklmnopqrstuvwxyz';
          const randomVals = new Uint32Array(strLength);
          crypto.getRandomValues(randomVals);
          let res = '';
          for (let i = 0; i < strLength; i++) {
            res += pool[randomVals[i] % pool.length];
          }
          return { outputText: res, error: null };
        }
        case 'user-agent-parser': {
          const ua = navigator.userAgent;
          const info = {
            userAgent: ua,
            platform: navigator.platform,
            language: navigator.language,
            cores: navigator.hardwareConcurrency || 'Unknown',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: `${window.screen.colorDepth}-bit`,
            online: navigator.onLine,
          };
          return { outputText: JSON.stringify(info, null, 2), error: null };
        }
        default:
          return { outputText: inputVal, error: null };
      }
    } catch (e: any) {
      return { outputText: '', error: e.message || 'Syntax Error' };
    }
  }, [inputVal, toolSlug, uuidCount, strLength, charSet]);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Special Control Header for UUID & Random String */}
      {toolSlug === 'uuid-generator' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Batch Count:</span>
            <input
              type="number"
              min="1"
              max="50"
              value={uuidCount}
              onChange={(e) => setUuidCount(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-16 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => setUuidCount((c) => c)}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-Generate UUIDs
          </button>
        </div>
      )}

      {toolSlug === 'random-string-generator' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Length: {strLength} chars</span>
            <input
              type="range"
              min="8"
              max="128"
              value={strLength}
              onChange={(e) => setStrLength(Number(e.target.value))}
              className="w-48 accent-emerald-500"
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={charSet.upper}
                onChange={(e) => setCharSet({ ...charSet, upper: e.target.checked })}
                className="rounded text-emerald-500"
              />
              Uppercase (A-Z)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={charSet.lower}
                onChange={(e) => setCharSet({ ...charSet, lower: e.target.checked })}
                className="rounded text-emerald-500"
              />
              Lowercase (a-z)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={charSet.numbers}
                onChange={(e) => setCharSet({ ...charSet, numbers: e.target.checked })}
                className="rounded text-emerald-500"
              />
              Numbers (0-9)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={charSet.symbols}
                onChange={(e) => setCharSet({ ...charSet, symbols: e.target.checked })}
                className="rounded text-emerald-500"
              />
              Symbols (!@#$)
            </label>
          </div>
        </div>
      )}

      {/* Regex Live Tester Special View */}
      {toolSlug === 'regex-tester' && (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Regular Expression Pattern
              </label>
              <div className="flex items-center font-mono text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
                <span className="px-3 text-slate-400">/</span>
                <input
                  type="text"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  className="w-full py-2 bg-transparent text-emerald-600 dark:text-emerald-400 focus:outline-none"
                />
                <span className="px-3 text-slate-400">/</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Flags</label>
              <input
                type="text"
                value={regexFlags}
                onChange={(e) => setRegexFlags(e.target.value)}
                placeholder="g, i, m"
                className="w-full px-3 py-2 font-mono text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hash Generator Special View */}
      {toolSlug === 'hash-generator' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Input String to Hash
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 font-mono text-xs">
            {Object.entries(hashResults).map(([algo, h]) => (
              <div
                key={algo}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 block">
                    {algo.toUpperCase()}
                  </span>
                  <span className="text-slate-900 dark:text-slate-200 break-all">{h}</span>
                </div>
                <button
                  onClick={() => handleCopy(h)}
                  className="text-xs text-emerald-500 hover:underline shrink-0 self-start sm:self-center"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unix Timestamp Converter Special View */}
      {toolSlug === 'timestamp-converter' && (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Unix Epoch Seconds
            </label>
            <button
              onClick={() => setEpochInput(Math.floor(Date.now() / 1000).toString())}
              className="text-xs text-emerald-500 hover:underline"
            >
              Current Epoch Time
            </button>
          </div>
          <input
            type="number"
            value={epochInput}
            onChange={(e) => setEpochInput(e.target.value)}
            className="w-full px-4 py-2.5 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-sans">GMT / UTC</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {new Date(Number(epochInput) * 1000).toUTCString()}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-sans">Local Time</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {new Date(Number(epochInput) * 1000).toString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Standard Dual Pane Layout for Formatter/Decoder/Encoder */}
      {toolSlug !== 'hash-generator' && toolSlug !== 'timestamp-converter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Input</span>
              <button
                onClick={() => setInputVal('')}
                className="text-xs text-rose-500 hover:underline"
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full h-80 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              placeholder="Paste code or data here..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {error ? 'Status' : 'Output'}
              </span>
              {!error && (
                <button
                  onClick={() => handleCopy(outputText)}
                  className="text-xs flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {error ? (
              <div className="w-full h-80 p-6 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-mono">
                <span className="font-bold block mb-2">Validation Error:</span>
                {error}
              </div>
            ) : (
              <textarea
                readOnly
                value={outputText}
                className="w-full h-80 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-emerald-600 dark:text-emerald-400 shadow-inner"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
