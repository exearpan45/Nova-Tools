import React, { useState, useMemo } from 'react';
import {
  Palette, Sparkles, Box, SquareDashedBottomCode, Eye, Type, Image as ImageIcon, Download, Copy, Check, Shapes
} from 'lucide-react';
import { DesignTools } from '../tools/designTools';
import { WebTools } from '../tools/webTools';
import { copyToClipboard } from '../utils/clipboard';
import { sanitizeSvgContent } from '../utils/fileSignatures';

type DesignTab =
  | 'gradient-generator'
  | 'box-shadow-generator'
  | 'glassmorphism-generator'
  | 'css-button-generator'
  | 'contrast-checker'
  | 'palette-studio'
  | 'typography-preview'
  | 'svg-favicon-studio';

const DESIGN_TABS: { id: DesignTab; label: string; icon: React.ElementType }[] = [
  { id: 'gradient-generator', label: 'Gradients', icon: Palette },
  { id: 'palette-studio', label: 'Palette & Picker', icon: Sparkles },
  { id: 'box-shadow-generator', label: 'Box Shadow', icon: Box },
  { id: 'glassmorphism-generator', label: 'Glassmorphism', icon: SquareDashedBottomCode },
  { id: 'css-button-generator', label: 'Buttons & Radius', icon: SquareDashedBottomCode },
  { id: 'contrast-checker', label: 'WCAG Contrast', icon: Eye },
  { id: 'typography-preview', label: 'Typography', icon: Type },
  { id: 'svg-favicon-studio', label: 'SVG & Favicon', icon: Shapes },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16) || 0;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

export const DesignStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DesignTab>('gradient-generator');
  const [copied, setCopied] = useState<string | null>(null);

  // Palette Studio state
  const [baseColor, setBaseColor] = useState<string>('#7657ff');
  // Typography Preview state
  const [fontSize, setFontSize] = useState<number>(32);
  const [lineHeight, setLineHeight] = useState<number>(1.35);
  const [letterSpacing, setLetterSpacing] = useState<number>(-0.02);
  const [sampleHeading, setSampleHeading] = useState<string>('Designed with precision and restraint.');
  // SVG & Favicon Studio state
  const [favLetter, setFavLetter] = useState<string>('N');
  const [favBg, setFavBg] = useState<string>('#6366f1');
  const [favFg, setFavFg] = useState<string>('#ffffff');
  const [favRadius, setFavRadius] = useState<number>(28);
  const [rawSvgInput, setRawSvgInput] = useState<string>(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#06b6d4"/><path d="M20 44V20h6l12 15V20h6v24h-6L26 29v15z" fill="#fff"/></svg>'
  );

  const paletteSwatches = useMemo(() => {
    const { r, g, b } = hexToRgb(baseColor);
    const mix = (target: number, factor: number) => Math.round(target * (1 - factor) + 255 * factor);
    const shade = (target: number, factor: number) => Math.round(target * (1 - factor));
    return [
      { name: '100 Tint', hex: rgbToHex(mix(r, 0.85), mix(g, 0.85), mix(b, 0.85)) },
      { name: '300 Light', hex: rgbToHex(mix(r, 0.5), mix(g, 0.5), mix(b, 0.5)) },
      { name: '500 Base', hex: baseColor.toLowerCase() },
      { name: '700 Deep', hex: rgbToHex(shade(r, 0.3), shade(g, 0.3), shade(b, 0.3)) },
      { name: '900 Dark', hex: rgbToHex(shade(r, 0.6), shade(g, 0.6), shade(b, 0.6)) },
      { name: 'Complementary', hex: rgbToHex(255 - r, 255 - g, 255 - b) },
    ];
  }, [baseColor]);

  const sanitizedSvg = useMemo(() => sanitizeSvgContent(rawSvgInput), [rawSvgInput]);
  const optimizedSvg = useMemo(
    () =>
      sanitizedSvg
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/>\s+</g, '><')
        .trim(),
    [sanitizedSvg]
  );

  const faviconSvg = useMemo(() => {
    const safeChar = (favLetter.trim().slice(0, 2) || 'N').replace(/[<>&"]/g, '');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128"><rect width="128" height="128" rx="${favRadius}" fill="${favBg}"/><text x="64" y="82" text-anchor="middle" font-family="system-ui, sans-serif" font-size="68" font-weight="800" fill="${favFg}">${safeChar}</text></svg>`;
  }, [favLetter, favBg, favFg, favRadius]);

  const handleCopy = (label: string, value: string) => {
    copyToClipboard(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadFaviconPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([faviconSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 180, 180);
      URL.revokeObjectURL(url);
      canvas.toBlob((png) => {
        if (!png) return;
        const pUrl = URL.createObjectURL(png);
        const a = document.createElement('a');
        a.href = pUrl;
        a.download = 'favicon-180x180.png';
        a.click();
        URL.revokeObjectURL(pUrl);
      }, 'image/png');
    };
    img.src = url;
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400">
          NOVA Design Studio
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
          CSS, Color, Typography & Vector Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Build gradients, palettes, WCAG-checked contrast pairs, glass cards, SVG favicons, and clean CSS snippets locally.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/70 overflow-x-auto no-scrollbar">
        {DESIGN_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xs">
        {(activeTab === 'gradient-generator' ||
          activeTab === 'box-shadow-generator' ||
          activeTab === 'glassmorphism-generator' ||
          activeTab === 'css-button-generator') && <DesignTools toolSlug={activeTab} />}

        {activeTab === 'contrast-checker' && <WebTools toolSlug="contrast-checker" />}

        {activeTab === 'palette-studio' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Base Seed Color</span>
                  <span className="text-xs font-mono uppercase text-slate-500">{baseColor}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      'css-vars',
                      paletteSwatches.map((s) => `--color-${s.name.toLowerCase().replace(/\s+/g, '-')}: ${s.hex};`).join('\n')
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:border-fuchsia-500"
                >
                  {copied === 'css-vars' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy CSS Variables</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadFile(JSON.stringify(paletteSwatches, null, 2), 'nova-palette.json', 'application/json')
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {paletteSwatches.map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => handleCopy(swatch.name, swatch.hex)}
                  className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-left space-y-2 hover:border-fuchsia-500 transition-colors"
                >
                  <div className="h-20 rounded-xl border border-black/5" style={{ backgroundColor: swatch.hex }} />
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block">{swatch.name}</span>
                    <span className="text-[11px] font-mono uppercase text-slate-500">
                      {copied === swatch.name ? 'Copied!' : swatch.hex}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'typography-preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Sample Headline Text
                </label>
                <input
                  type="text"
                  value={sampleHeading}
                  onChange={(e) => setSampleHeading(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1 font-mono tabular-nums">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="14"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1 font-mono tabular-nums">
                  Line Height: {lineHeight}
                </label>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.05"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1 font-mono tabular-nums">
                  Letter Spacing: {letterSpacing}em
                </label>
                <input
                  type="range"
                  min="-0.06"
                  max="0.12"
                  step="0.01"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    'typo',
                    `font-size: ${fontSize}px;\nline-height: ${lineHeight};\nletter-spacing: ${letterSpacing}em;`
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold"
              >
                {copied === 'typo' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'typo' ? 'Copied CSS' : 'Copy Typography CSS'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center">
              <p
                className="font-bold text-slate-900 dark:text-white break-words"
                style={{ fontSize: `${fontSize}px`, lineHeight, letterSpacing: `${letterSpacing}em` }}
              >
                {sampleHeading}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
                Clean body prose at 14px–16px pairs with generous whitespace to create calm reading rhythm across light and dark themes.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'svg-favicon-studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Favicon Builder */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-fuchsia-500" />
                <span>App Favicon Generator</span>
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Initials (1–2 chars)</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={favLetter}
                    onChange={(e) => setFavLetter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono tabular-nums">Corner Radius ({favRadius}px)</label>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    value={favRadius}
                    onChange={(e) => setFavRadius(Number(e.target.value))}
                    className="w-full accent-fuchsia-500 mt-2"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Background</label>
                  <input type="color" value={favBg} onChange={(e) => setFavBg(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Letter Color</label>
                  <input type="color" value={favFg} onChange={(e) => setFavFg(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <iframe
                  title="Favicon preview"
                  sandbox=""
                  srcDoc={`<!doctype html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:transparent;">${faviconSvg}</body></html>`}
                  className="w-20 h-20 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadFile(faviconSvg, 'favicon.svg', 'image/svg+xml')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-fuchsia-600 text-white text-xs font-bold"
                  >
                    <Download className="w-3.5 h-3.5" /> SVG
                  </button>
                  <button
                    type="button"
                    onClick={downloadFaviconPng}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <Download className="w-3.5 h-3.5" /> 180px PNG
                  </button>
                </div>
              </div>
            </div>

            {/* SVG Sanitizer & Optimizer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Safe SVG Preview & Optimizer</h2>
                <span className="text-[11px] font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  {rawSvgInput.length}B → {optimizedSvg.length}B
                </span>
              </div>
              <textarea
                value={rawSvgInput}
                onChange={(e) => setRawSvgInput(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs"
              />
              <div className="flex items-center justify-between gap-2">
                <iframe
                  title="Sanitized SVG Output Preview"
                  sandbox=""
                  srcDoc={`<!doctype html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:transparent;">${optimizedSvg}</body></html>`}
                  className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy('svg-opt', optimizedSvg)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    {copied === 'svg-opt' ? 'Copied' : 'Copy Minified SVG'}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile(optimizedSvg, 'optimized.svg', 'image/svg+xml')}
                    className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold"
                  >
                    Download SVG
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
