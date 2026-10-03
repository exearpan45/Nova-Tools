import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode, Link, Link2, Globe, Tag, Bot, FileCode, Server,
  Cpu, Eye, Check, Copy, Download, RefreshCw, Sparkles, ExternalLink
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface WebProps {
  toolSlug: string;
}

export const WebTools: React.FC<WebProps> = ({ toolSlug }) => {
  // QR Code states
  const [qrContent, setQrContent] = useState<string>('https://novatools.2bd.net');
  const [qrSize, setQrSize] = useState<number>(300);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // URL Parser & Cleaner
  const [urlInput, setUrlInput] = useState<string>(
    'https://example.com/shop/products?id=492&utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale&ref=promo#reviews'
  );

  // Meta Tags Builder
  const [metaTitle, setMetaTitle] = useState<string>('NOVA TOOLS — Production-Ready Toolbox');
  const [metaDesc, setMetaDesc] = useState<string>('100+ fast, private browser-based utilities for everyday productivity.');
  const [metaUrl, setMetaUrl] = useState<string>('https://novatools.2bd.net');
  const [metaImage, setMetaImage] = useState<string>('https://novatools.2bd.net/og-image.png');

  // Robots.txt states
  const [robotAgent, setRobotAgent] = useState<string>('*');
  const [robotDisallow, setRobotDisallow] = useState<string>('/admin/\n/api/\n/private/');
  const [robotSitemap, setRobotSitemap] = useState<string>('https://novatools.2bd.net/sitemap.xml');

  // Contrast Checker states
  const [fgColor, setFgColor] = useState<string>('#ffffff');
  const [bgColor, setBgColor] = useState<string>('#0f172a');

  // Generate QR Code
  useEffect(() => {
    if (toolSlug === 'qr-generator' && qrContent) {
      QRCode.toDataURL(qrContent, {
        width: qrSize,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    }
  }, [qrContent, qrSize, toolSlug]);

  // URL Parser logic
  const parsedUrl = React.useMemo(() => {
    try {
      const u = new URL(urlInput);
      const params: { key: string; value: string }[] = [];
      u.searchParams.forEach((val, key) => params.push({ key, value: val }));
      return {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || '(default)',
        pathname: u.pathname,
        search: u.search,
        hash: u.hash || '(none)',
        params,
        error: null,
      };
    } catch {
      return { error: 'Invalid URL format. Please include protocol (e.g., https://).' };
    }
  }, [urlInput]);

  // Clean URL (strip UTM & tracking)
  const cleanedUrl = React.useMemo(() => {
    try {
      const u = new URL(urlInput);
      const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref'];
      trackingKeys.forEach((k) => u.searchParams.delete(k));
      return u.toString();
    } catch {
      return urlInput;
    }
  }, [urlInput]);

  // Meta Tag HTML Snippet
  const metaHtml = `<!-- Primary Meta Tags -->
<title>${metaTitle}</title>
<meta name="title" content="${metaTitle}" />
<meta name="description" content="${metaDesc}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${metaUrl}" />
<meta property="og:title" content="${metaTitle}" />
<meta property="og:description" content="${metaDesc}" />
<meta property="og:image" content="${metaImage}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${metaUrl}" />
<meta property="twitter:title" content="${metaTitle}" />
<meta property="twitter:description" content="${metaDesc}" />
<meta property="twitter:image" content="${metaImage}" />`;

  // Robots.txt generated content
  const robotsTxt = `User-agent: ${robotAgent}
${robotDisallow
  .split('\n')
  .filter(Boolean)
  .map((d) => `Disallow: ${d.trim()}`)
  .join('\n')}

Sitemap: ${robotSitemap}`;

  // WCAG Contrast Calculation
  const contrastRatio = React.useMemo(() => {
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = (rgb & 0xff) / 255;
      const a = [r, g, b].map((v) =>
        v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      );
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    try {
      const l1 = getLuminance(fgColor);
      const l2 = getLuminance(bgColor);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return Number(ratio.toFixed(2));
    } catch {
      return 1;
    }
  }, [fgColor, bgColor]);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* QR Code Generator */}
      {toolSlug === 'qr-generator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                QR Content (URL, Text, or Wi-Fi)
              </label>
              <textarea
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
                placeholder="https://..."
                className="w-full h-32 p-3 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Pixel Size: {qrSize}px</label>
              <input
                type="range"
                min="150"
                max="600"
                step="50"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col items-center justify-center space-y-4 shadow-sm">
            {qrDataUrl ? (
              <>
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="w-56 h-56 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md p-2 bg-white"
                />
                <a
                  href={qrDataUrl}
                  download="nova-qrcode.png"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" /> Download High-Res PNG
                </a>
              </>
            ) : (
              <span className="text-xs text-slate-400">Enter text to generate QR code...</span>
            )}
          </div>
        </div>
      )}

      {/* URL Parser & Formatter */}
      {(toolSlug === 'url-parser' || toolSlug === 'url-shortener-ui') && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Enter Full URL
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {toolSlug === 'url-shortener-ui' && (
            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 space-y-2">
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 block">
                Cleaned URL (Tracking & Marketing Tags Removed)
              </span>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-teal-500/30 text-xs font-mono text-slate-800 dark:text-slate-200 break-all">
                <span>{cleanedUrl}</span>
                <button
                  onClick={() => handleCopy(cleanedUrl)}
                  className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs font-sans shrink-0 font-medium"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {!parsedUrl.error ? (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Deconstructed Components
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-sans text-slate-400 block">Protocol</span>
                  <span className="font-bold text-slate-900 dark:text-white">{parsedUrl.protocol}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-sans text-slate-400 block">Hostname</span>
                  <span className="font-bold text-teal-500">{parsedUrl.hostname}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-sans text-slate-400 block">Pathname</span>
                  <span className="font-bold text-slate-900 dark:text-white">{parsedUrl.pathname}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-sans text-slate-400 block">Port</span>
                  <span className="font-bold text-slate-900 dark:text-white">{parsedUrl.port}</span>
                </div>
              </div>

              {parsedUrl.params && parsedUrl.params.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Query String Parameters ({parsedUrl.params.length})
                  </span>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left font-mono">
                      <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-sans">
                        <tr>
                          <th className="p-2.5">Key</th>
                          <th className="p-2.5">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {parsedUrl.params.map((p, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="p-2.5 text-teal-500 font-semibold">{p.key}</td>
                            <td className="p-2.5 text-slate-700 dark:text-slate-300 break-all">{p.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-rose-500/10 text-rose-500 text-xs">{parsedUrl.error}</div>
          )}
        </div>
      )}

      {/* Meta Tag Generator */}
      {toolSlug === 'meta-tag-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Page Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Description (Max 160 chars recommended)</label>
              <textarea
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full h-20 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Canonical URL</label>
              <input
                type="text"
                value={metaUrl}
                onChange={(e) => setMetaUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">OpenGraph Image URL</label>
              <input
                type="text"
                value={metaImage}
                onChange={(e) => setMetaImage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated HTML</span>
              <button
                onClick={() => handleCopy(metaHtml)}
                className="text-xs flex items-center gap-1.5 text-teal-500 hover:underline font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy HTML'}
              </button>
            </div>
            <textarea
              readOnly
              value={metaHtml}
              className="w-full h-72 p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      )}

      {/* Contrast Checker */}
      {toolSlug === 'hex-color-tools' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Text Color (Hex)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 uppercase"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Background Color (Hex)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 uppercase"
                />
              </div>
            </div>
          </div>

          <div
            className="p-8 rounded-2xl border shadow-inner flex flex-col items-center justify-center text-center space-y-2"
            style={{ backgroundColor: bgColor, color: fgColor, borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <h4 className="text-2xl font-bold">Contrast Ratio: {contrastRatio} : 1</h4>
            <p className="text-sm max-w-md">
              The quick brown fox jumps over the lazy dog. Previewing live text rendering under selected colors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-bold">
            <div
              className={`p-3 rounded-xl border ${
                contrastRatio >= 4.5
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
              }`}
            >
              WCAG AA Normal ({contrastRatio >= 4.5 ? 'PASS' : 'FAIL'})
            </div>
            <div
              className={`p-3 rounded-xl border ${
                contrastRatio >= 3.0
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
              }`}
            >
              WCAG AA Large ({contrastRatio >= 3.0 ? 'PASS' : 'FAIL'})
            </div>
            <div
              className={`p-3 rounded-xl border ${
                contrastRatio >= 7.0
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
              }`}
            >
              WCAG AAA Normal ({contrastRatio >= 7.0 ? 'PASS' : 'FAIL'})
            </div>
            <div
              className={`p-3 rounded-xl border ${
                contrastRatio >= 4.5
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
              }`}
            >
              WCAG AAA Large ({contrastRatio >= 4.5 ? 'PASS' : 'FAIL'})
            </div>
          </div>
        </div>
      )}

      {/* Robots.txt Generator */}
      {toolSlug === 'robots-txt-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">User Agent</label>
              <input
                type="text"
                value={robotAgent}
                onChange={(e) => setRobotAgent(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Disallowed Paths (one per line)</label>
              <textarea
                value={robotDisallow}
                onChange={(e) => setRobotDisallow(e.target.value)}
                className="w-full h-32 px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Sitemap URL</label>
              <input
                type="text"
                value={robotSitemap}
                onChange={(e) => setRobotSitemap(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">robots.txt File</span>
              <button
                onClick={() => handleCopy(robotsTxt)}
                className="text-xs text-teal-500 hover:underline font-medium"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={robotsTxt}
              className="w-full h-72 p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
            />
          </div>
        </div>
      )}
    </div>
  );
};
