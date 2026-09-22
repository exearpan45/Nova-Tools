import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, RotateCcw } from 'lucide-react';

type QrType = 'URL' | 'Text' | 'Email' | 'Phone';

export const QrGeneratorTool: React.FC = () => {
  const [type, setType] = useState<QrType>('URL');
  const [content, setContent] = useState<string>('https://novatools.net');
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let payload = content.trim();
    if (!payload) {
      payload = 'https://novatools.net';
    }

    if (type === 'Email' && !payload.startsWith('mailto:')) {
      payload = `mailto:${payload}`;
    } else if (type === 'Phone' && !payload.startsWith('tel:')) {
      payload = `tel:${payload}`;
    }

    QRCode.toCanvas(
      canvasRef.current,
      payload,
      {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      },
      (error) => {
        if (error) {
          console.error('QR code generation error:', error);
        }
      }
    );
  }, [content, type]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `nova-qr-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setType('URL');
    setContent('https://novatools.net');
  };

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60">
          {(['URL', 'Text', 'Email', 'Phone'] as QrType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                if (t === 'URL') setContent('https://novatools.net');
                else if (t === 'Text') setContent('Hello from NOVA TOOLS');
                else if (t === 'Email') setContent('hello@novatools.net');
                else if (t === 'Phone') setContent('+1234567890');
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                type === t
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
        {/* Input */}
        <div>
          <label htmlFor="qr-content-input" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            {type === 'URL' && 'Website URL'}
            {type === 'Text' && 'Plain Text'}
            {type === 'Email' && 'Email Address'}
            {type === 'Phone' && 'Phone Number'}
          </label>

          {type === 'Text' ? (
            <textarea
              id="qr-content-input"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter text for the QR code"
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <input
              id="qr-content-input"
              type={type === 'Email' ? 'email' : type === 'Phone' ? 'tel' : 'text'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === 'URL'
                  ? 'https://example.com'
                  : type === 'Email'
                  ? 'name@example.com'
                  : '+1 555 0199'
              }
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )}

          <p className="text-[11px] text-neutral-500 mt-2">
            Generated client-side inside your browser. No data is sent over the network.
          </p>
        </div>

        {/* QR Preview & Actions */}
        <div className="flex flex-col items-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 w-full sm:w-auto">
          <div className="p-3 bg-white rounded-lg shadow-2xs">
            <canvas ref={canvasRef} className="block w-48 h-48 sm:w-56 sm:h-56" />
          </div>

          <div className="flex items-center gap-2 mt-4 w-full">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy input text"
              className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
