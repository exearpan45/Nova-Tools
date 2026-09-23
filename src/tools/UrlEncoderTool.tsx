import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, ArrowLeftRight, Link2, KeyRound } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

export const UrlEncoderTool: React.FC = () => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [scope, setScope] = useState<'component' | 'full'>('component');
  const [input, setInput] = useState<string>(
    'https://novatools.net/search?query=simple tools&category=calculators & converters'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Compute output
  const output = useMemo(() => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        return scope === 'component' ? encodeURIComponent(input) : encodeURI(input);
      } else {
        return scope === 'component' ? decodeURIComponent(input) : decodeURI(input);
      }
    } catch (err: any) {
      return `[Error: Malformed URI sequence]`;
    }
  }, [input, mode, scope]);

  // Query parameter inspection table
  const queryParams = useMemo(() => {
    if (!input) return [];
    try {
      let searchStr = '';
      if (input.includes('?')) {
        searchStr = input.split('?')[1]?.split('#')[0] || '';
      } else if (input.includes('&') || input.includes('=')) {
        searchStr = input;
      }
      if (!searchStr) return [];

      const searchParams = new URLSearchParams(searchStr);
      const items: { key: string; value: string }[] = [];
      searchParams.forEach((value, key) => {
        items.push({ key, value });
      });
      return items;
    } catch {
      return [];
    }
  }, [input]);

  const handleCopy = async () => {
    if (!output || output.startsWith('[Error')) return;
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('URL output copied to clipboard', 'success');
      addScratchpadItem('url-encoder', output, mode === 'encode' ? 'Encoded URL' : 'Decoded URL');
    }
  };

  const handleSwap = () => {
    if (!output || output.startsWith('[Error')) return;
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    showToast('Swapped input and output', 'info');
  };

  const handleReset = () => {
    setInput('');
    showToast('Input cleared', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Configuration Controls Bar */}
      <div className="bg-white dark:bg-[#18181b] p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 flex flex-wrap items-center justify-between gap-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setMode('encode')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'encode'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'decode'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Decode
            </button>
          </div>

          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setScope('component')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                scope === 'component'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="encodeURIComponent / decodeURIComponent (Encodes symbols like &, =, /)"
            >
              Component
            </button>
            <button
              type="button"
              onClick={() => setScope('full')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                scope === 'full'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="encodeURI / decodeURI (Leaves protocol and path intact)"
            >
              Full URI
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSwap}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Swap input with output"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>
          <button
            type="button"
            data-action="reset"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Clear input (Esc)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input and Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-[#18181b] p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-2">
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            {mode === 'encode' ? 'Raw Text / URL to Encode' : 'Encoded URL to Decode'}
          </label>
          <textarea
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste URL or text component..."
            className="w-full p-3 font-mono text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-neutral-900 dark:text-neutral-100 resize-y"
          />
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-[#18181b] p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
              </label>
              <button
                type="button"
                data-action="primary"
                onClick={handleCopy}
                disabled={!output || output.startsWith('[Error')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              readOnly
              data-action="output"
              rows={6}
              value={output}
              className={`w-full p-3 font-mono text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border rounded-xl focus:outline-none select-all resize-y ${
                output.startsWith('[Error')
                  ? 'border-red-300 dark:border-red-900 text-red-600 dark:text-red-400'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Query Parameters Breakdown Inspector */}
      {queryParams.length > 0 && (
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 overflow-hidden">
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-blue-500" />
              Parsed Query Parameters ({queryParams.length})
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-100/60 dark:bg-neutral-800/50 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-2 font-semibold">Key</th>
                  <th className="px-4 py-2 font-semibold">Value</th>
                  <th className="px-4 py-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {queryParams.map((p, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="px-4 py-2.5 font-bold text-neutral-900 dark:text-neutral-100">
                      {p.key}
                    </td>
                    <td className="px-4 py-2.5 text-neutral-700 dark:text-neutral-300 break-all">
                      {p.value}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={async () => {
                          await copyToClipboard(p.value);
                          showToast(`Copied value for '${p.key}'`, 'success');
                        }}
                        className="p-1 text-neutral-400 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Copy parameter value"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
