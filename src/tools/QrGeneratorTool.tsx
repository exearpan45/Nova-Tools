import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, RotateCcw, AlertCircle, QrCode } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

type QrType = 'URL' | 'Text' | 'Email' | 'Phone';

export const QrGeneratorTool: React.FC = () => {
  const { showToast } = useToast();
  const [type, setType] = useState<QrType>('URL');
  const [content, setContent] = useState<string>('https://novatools.net');
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Validate and format payload
  const payloadData = useMemo(() => {
    const raw = content.trim();
    if (!raw) {
      return { payload: '', valid: false, error: 'Please enter content to generate a QR code.' };
    }

    if (type === 'Email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const cleanEmail = raw.replace(/^mailto:/i, '').trim();
      if (!emailRegex.test(cleanEmail)) {
        return { payload: '', valid: false, error: 'Please enter a valid email address.' };
      }
      return { payload: `mailto:${cleanEmail}`, valid: true, error: null };
    }

    if (type === 'Phone') {
      const cleanPhone = raw.replace(/^tel:/i, '').trim();
      if (!/^[+]?[\d\s\-().]{5,20}$/.test(cleanPhone)) {
        return { payload: '', valid: false, error: 'Please enter a valid telephone number.' };
      }
      return { payload: `tel:${cleanPhone.replace(/\s+/g, '')}`, valid: true, error: null };
    }

    if (type === 'URL') {
      let formattedUrl = raw;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      try {
        new URL(formattedUrl);
        return { payload: formattedUrl, valid: true, error: null };
      } catch {
        return { payload: '', valid: false, error: 'Please enter a valid web URL.' };
      }
    }

    return { payload: raw, valid: true, error: null };
  }, [content, type]);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!payloadData.valid || !payloadData.payload) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }

    QRCode.toCanvas(
      canvasRef.current,
      payloadData.payload,
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
  }, [payloadData]);

  const handleDownload = () => {
    if (!canvasRef.current || !payloadData.valid) return;
    const link = document.createElement('a');
    link.download = `nova-qr-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    showToast('Downloaded QR code PNG', 'success');
  };

  const handleCopyLink = async () => {
    if (!content.trim()) return;
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Copied content to clipboard', 'success');
      addScratchpadItem('qr-generator', content, `${type} QR Payload`);
    }
  };

  const handleReset = () => {
    setType('URL');
    setContent('https://novatools.net');
    showToast('Reset to default URL', 'info');
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
                else if (t === 'Text') setContent('Simple tools. Done well.');
                else if (t === 'Email') setContent('hello@novatools.net');
                else if (t === 'Phone') setContent('+1234567890');
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                type === t
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
        {/* Input */}
        <div className="space-y-3">
          <div>
            <label htmlFor="qr-content-input" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
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
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            ) : (
              <input
                id="qr-content-input"
                type={type === 'Email' ? 'email' : type === 'Phone' ? 'tel' : 'text'}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === 'URL'
                    ? 'https://novatools.net'
                    : type === 'Email'
                    ? 'contact@novatools.net'
                    : '+1 555 0199'
                }
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            )}
          </div>

          {/* Validation error */}
          {!payloadData.valid && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{payloadData.error}</span>
            </div>
          )}

          <p className="text-[11px] text-neutral-500">
            Generated client-side inside your browser. No data is sent over the network.
          </p>
        </div>

        {/* QR Preview & Actions */}
        <div className="flex flex-col items-center p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#18181b] w-full sm:w-auto animate-result-in">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-neutral-100 dark:border-neutral-800 min-w-[200px] min-h-[200px] flex items-center justify-center">
            {payloadData.valid ? (
              <canvas
                ref={canvasRef}
                role="img"
                aria-label="Generated QR Code preview"
                className="block w-48 h-48 sm:w-56 sm:h-56"
              />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-neutral-400 text-xs text-center p-4">
                <QrCode className="w-12 h-12 stroke-[1.5] text-neutral-300 dark:text-neutral-600 mb-2" />
                <span>Enter valid content to generate preview</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 w-full">
            <button
              type="button"
              data-action="primary"
              disabled={!payloadData.valid}
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={!content.trim()}
              title="Copy input text"
              className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
