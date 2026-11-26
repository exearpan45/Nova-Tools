import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  QrCode, Wifi, Mail, Phone, User, MapPin, Link2, Type,
  Download, Printer, Camera, CameraOff, Barcode, Layers, AlertTriangle,
  Check, Copy, FileArchive, Trash2, Upload
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { useToast } from '../context/ToastContext';
import { copyToClipboard } from '../utils/clipboard';
import { generateCode128Svg } from '../utils/barcode';
import { buildZipBlob } from '../utils/zipBuilder';

type QrMode = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'vcard' | 'geo';
type StudioSection = 'single' | 'batch' | 'barcode' | 'scanner';

export const QrStudioPage: React.FC = () => {
  const { triggerSound, pushNotification } = useNova();
  const { showToast } = useToast();

  const [section, setSection] = useState<StudioSection>('single');
  const [qrMode, setQrMode] = useState<QrMode>('url');

  // QR Field States
  const [urlVal, setUrlVal] = useState('https://nova-tools2.pages.dev');
  const [textVal, setTextVal] = useState('Hello from NOVA Tools 2.0');
  const [wifiSsid, setWifiSsid] = useState('Office_Guest');
  const [wifiPass, setWifiPass] = useState('secure-pass-2026');
  const [wifiSec, setWifiSec] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [emailTo, setEmailTo] = useState('hello@example.com');
  const [emailSubj, setEmailSubj] = useState('Quick Question');
  const [phoneNum, setPhoneNum] = useState('+15551234567');
  const [vcardName, setVcardName] = useState('Arpan Goswami');
  const [vcardPhone, setVcardPhone] = useState('+15551234567');
  const [vcardEmail, setVcardEmail] = useState('contact@example.com');
  const [geoLat, setGeoLat] = useState('28.6139');
  const [geoLng, setGeoLng] = useState('77.2090');

  // Visual Options
  const [qrSize, setQrSize] = useState<number>(320);
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [ecc, setEcc] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoRatioPct, setLogoRatioPct] = useState<number>(18);

  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvgStr, setQrSvgStr] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Batch QR State
  const [batchLines, setBatchLines] = useState<string>(
    'https://nova-tools2.pages.dev\nhttps://nova-tools2.pages.dev/workspace\nhttps://nova-tools2.pages.dev/file-studio'
  );
  const [batchItems, setBatchItems] = useState<{ text: string; dataUrl: string }[]>([]);

  // Barcode State
  const [barcodeText, setBarcodeText] = useState<string>('NOVA-2026-8841');

  // Camera Scanner State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<number | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const hasBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;

  const encodedPayload = useMemo(() => {
    switch (qrMode) {
      case 'url':
        return urlVal.trim();
      case 'text':
        return textVal;
      case 'wifi':
        return `WIFI:T:${wifiSec};S:${wifiSsid};P:${wifiSec === 'nopass' ? '' : wifiPass};;`;
      case 'email':
        return `mailto:${emailTo.trim()}?subject=${encodeURIComponent(emailSubj)}`;
      case 'phone':
        return `tel:${phoneNum.trim()}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      case 'geo':
        return `geo:${geoLat.trim()},${geoLng.trim()}`;
      default:
        return '';
    }
  }, [qrMode, urlVal, textVal, wifiSsid, wifiPass, wifiSec, emailTo, emailSubj, phoneNum, vcardName, vcardPhone, vcardEmail, geoLat, geoLng]);

  const effectiveEcc = logoDataUrl && logoRatioPct > 18 ? 'H' : ecc;
  const logoTooLarge = Boolean(logoDataUrl && logoRatioPct > 22);

  // Render QR PNG (with optional centered logo composited cleanly via Canvas) & SVG
  useEffect(() => {
    if (!encodedPayload) {
      setQrPngUrl('');
      setQrSvgStr('');
      return;
    }

    let cancelled = false;
    const opts = {
      width: qrSize,
      margin: 2,
      errorCorrectionLevel: effectiveEcc,
      color: { dark: fgColor, light: bgColor },
    };

    QRCode.toString(encodedPayload, { ...opts, type: 'svg' })
      .then((svg) => {
        if (!cancelled) setQrSvgStr(svg);
      })
      .catch(() => {});

    QRCode.toDataURL(encodedPayload, opts)
      .then((url) => {
        if (cancelled) return;
        if (!logoDataUrl) {
          setQrPngUrl(url);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = qrSize;
        canvas.height = qrSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setQrPngUrl(url);
          return;
        }
        const baseImg = new Image();
        baseImg.onload = () => {
          if (cancelled) return;
          ctx.drawImage(baseImg, 0, 0, qrSize, qrSize);
          const logoImg = new Image();
          logoImg.onload = () => {
            if (cancelled) return;
            const logoSide = Math.round((qrSize * logoRatioPct) / 100);
            const pad = Math.round(logoSide * 0.14);
            const x = Math.round((qrSize - logoSide) / 2);
            const y = Math.round((qrSize - logoSide) / 2);
            ctx.fillStyle = bgColor;
            ctx.fillRect(x - pad, y - pad, logoSide + pad * 2, logoSide + pad * 2);
            ctx.drawImage(logoImg, x, y, logoSide, logoSide);
            setQrPngUrl(canvas.toDataURL('image/png'));
          };
          logoImg.src = logoDataUrl;
        };
        baseImg.src = url;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [encodedPayload, qrSize, fgColor, bgColor, effectiveEcc, logoDataUrl, logoRatioPct]);

  // Batch generation
  useEffect(() => {
    if (section !== 'batch') return;
    let cancelled = false;
    const entries = batchLines
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 24);

    Promise.all(
      entries.map(async (text) => {
        const dataUrl = await QRCode.toDataURL(text, {
          width: 240,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: { dark: fgColor, light: bgColor },
        });
        return { text, dataUrl };
      })
    )
      .then((res) => {
        if (!cancelled) setBatchItems(res);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [section, batchLines, fgColor, bgColor]);

  // Barcode SVG
  const barcodeResult = useMemo(
    () => generateCode128Svg(barcodeText, { fg: fgColor, bg: bgColor }),
    [barcodeText, fgColor, bgColor]
  );

  // Stop camera helper & unmount cleanup
  const stopCamera = () => {
    if (scanTimerRef.current !== null) {
      window.clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCameraScan = async () => {
    setScanError(null);
    setScanResult(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setScanError('Camera access is not supported in this browser context (requires HTTPS or localhost).');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 60);

      if (hasBarcodeDetector) {
        const DetectorClass = (window as any).BarcodeDetector;
        const detector = new DetectorClass({ formats: ['qr_code', 'code_128', 'ean_13', 'ean_8'] });

        scanTimerRef.current = window.setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length > 0) {
              const raw = codes[0].rawValue;
              setScanResult(raw);
              triggerSound('success');
              showToast('QR / Barcode detected!', 'success');
              stopCamera();
            }
          } catch {
            // Frame not ready
          }
        }, 350);
      } else {
        setScanError('Live camera feed opened, but your browser lacks the native BarcodeDetector API. Use Chromium/Chrome/Edge or paste/scan directly on mobile.');
      }
    } catch (err: any) {
      setScanError(err?.message || 'Camera permission was denied or unavailable.');
      stopCamera();
    }
  };

  const handleBatchZip = async () => {
    if (batchItems.length === 0) return;
    const entries = await Promise.all(
      batchItems.map(async (item, idx) => {
        const res = await fetch(item.dataUrl);
        const buf = await res.arrayBuffer();
        return { name: `qr-${idx + 1}.png`, data: new Uint8Array(buf) };
      })
    );
    const zip = buildZipBlob(entries);
    const url = URL.createObjectURL(zip);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-qr-batch-${batchItems.length}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSound('success');
    pushNotification('Batch QR ZIP Ready', `Exported ${batchItems.length} QR codes in one ZIP archive.`, 'success');
  };

  const qrModes: { id: QrMode; label: string; icon: React.ElementType }[] = [
    { id: 'url', label: 'URL', icon: Link2 },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'vcard', label: 'Contact', icon: User },
    { id: 'geo', label: 'Location', icon: MapPin },
  ];

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
            NOVA QR & Barcode Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            QR Generator, Barcodes & Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create URL, Wi-Fi, vCard, Geo QR codes with custom logos, Code 128 barcodes, batch ZIP packs, and printable sheets.
          </p>
        </div>

        {/* Studio Section Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 self-start">
          {[
            { id: 'single', label: 'QR Builder', icon: QrCode },
            { id: 'batch', label: 'Batch & Print', icon: Layers },
            { id: 'barcode', label: 'Barcode', icon: Barcode },
            { id: 'scanner', label: 'Scanner', icon: Camera },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id !== 'scanner') stopCamera();
                  setSection(tab.id as StudioSection);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  section === tab.id
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: SINGLE QR BUILDER */}
      {section === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-5">
            {/* QR Type Selector */}
            <div className="flex flex-wrap gap-1.5">
              {qrModes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setQrMode(m.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      qrMode === m.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Inputs */}
            <div className="space-y-3 text-xs">
              {qrMode === 'url' && (
                <div>
                  <label className="text-slate-400 block mb-1">Website URL</label>
                  <input type="url" value={urlVal} onChange={(e) => setUrlVal(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-mono" />
                </div>
              )}
              {qrMode === 'text' && (
                <div>
                  <label className="text-slate-400 block mb-1">Plain Text</label>
                  <textarea value={textVal} onChange={(e) => setTextVal(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
                </div>
              )}
              {qrMode === 'wifi' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-slate-400 block mb-1">Network Name (SSID)</label>
                    <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Password</label>
                    <input type="text" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Security</label>
                    <select value={wifiSec} onChange={(e) => setWifiSec(e.target.value as any)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Open (No Password)</option>
                    </select>
                  </div>
                </div>
              )}
              {qrMode === 'email' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-slate-400 block mb-1">Recipient Email</label>
                    <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Subject</label>
                    <input type="text" value={emailSubj} onChange={(e) => setEmailSubj(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
                  </div>
                </div>
              )}
              {qrMode === 'phone' && (
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number</label>
                  <input type="tel" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-mono" />
                </div>
              )}
              {qrMode === 'vcard' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-slate-400 block mb-1">Full Name</label>
                    <input type="text" value={vcardName} onChange={(e) => setVcardName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Phone</label>
                    <input type="tel" value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Email</label>
                    <input type="email" value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800" />
                  </div>
                </div>
              )}
              {qrMode === 'geo' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-slate-400 block mb-1">Latitude</label>
                    <input type="text" value={geoLat} onChange={(e) => setGeoLat(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Longitude</label>
                    <input type="text" value={geoLng} onChange={(e) => setGeoLng(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-mono" />
                  </div>
                </div>
              )}
            </div>

            {/* Styling & Logo Overlay */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/70 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Foreground</label>
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Background</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-mono tabular-nums">Size ({qrSize}px)</label>
                <input type="range" min="180" max="600" step="20" value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} className="w-full accent-teal-500 mt-2" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Correction</label>
                <select value={effectiveEcc} onChange={(e) => setEcc(e.target.value as any)} className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 font-mono">
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%)</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%)</option>
                </select>
              </div>
            </div>

            {/* Center Logo Overlay */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">Center Logo Overlay (Optional)</span>
                {logoDataUrl ? (
                  <button type="button" onClick={() => setLogoDataUrl(null)} className="text-rose-500 font-semibold flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                ) : (
                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-teal-500/20 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const r = new FileReader();
                        r.onload = (ev) => setLogoDataUrl(ev.target?.result as string);
                        r.readAsDataURL(f);
                        e.target.value = '';
                      }}
                    />
                  </label>
                )}
              </div>

              {logoDataUrl && (
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-mono tabular-nums block">
                    Logo Scale: {logoRatioPct}% of width
                  </label>
                  <input type="range" min="10" max="32" value={logoRatioPct} onChange={(e) => setLogoRatioPct(Number(e.target.value))} className="w-full accent-teal-500" />
                </div>
              )}

              {logoTooLarge && (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 flex items-center gap-2 text-[11px]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Logo covers over 22% of code width. Keep under 22% to guarantee reliable scanning.</span>
                </div>
              )}
            </div>
          </div>

          {/* Preview & Export */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col items-center space-y-5">
            {qrPngUrl ? (
              <>
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" style={{ backgroundColor: bgColor }}>
                  <img src={qrPngUrl} alt="Generated QR code" className="w-60 h-60 object-contain" />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <a
                    href={qrPngUrl}
                    download={`nova-qr-${qrMode}.png`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> PNG
                  </a>
                  {qrSvgStr && !logoDataUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([qrSvgStr], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `nova-qr-${qrMode}.svg`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                    >
                      <Download className="w-3.5 h-3.5" /> SVG Vector
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(encodedPayload);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1800);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Payload' : 'Copy Payload'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 py-16">Enter valid content to generate a QR code.</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: BATCH QR & PRINTABLE SHEET */}
      {section === 'batch' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Batch QR Sheet (Up to 24 lines)</h2>
                <p className="text-xs text-slate-500">Enter one URL, ID, or string per line.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  disabled={batchItems.length === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Sheet
                </button>
                <button
                  type="button"
                  onClick={handleBatchZip}
                  disabled={batchItems.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
                >
                  <FileArchive className="w-3.5 h-3.5" /> Download ZIP ({batchItems.length})
                </button>
              </div>
            </div>

            <textarea
              value={batchLines}
              onChange={(e) => setBatchLines(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {batchItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col items-center text-center space-y-2">
                <img src={item.dataUrl} alt={item.text} className="w-32 h-32 rounded-lg" />
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate w-full">{item.text}</span>
                <a href={item.dataUrl} download={`qr-${idx + 1}.png`} className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline">
                  Download PNG
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: CODE 128 BARCODE GENERATOR */}
      {section === 'barcode' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Code 128B Linear Barcode Generator</h2>
            <div>
              <label className="text-slate-400 block mb-1">Barcode Payload (ASCII)</label>
              <input
                type="text"
                value={barcodeText}
                onChange={(e) => setBarcodeText(e.target.value)}
                placeholder="e.g. SKU-99402-A"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Bar Color</label>
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Background</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" />
              </div>
            </div>
            {barcodeResult.error && (
              <p className="text-rose-500 font-medium">{barcodeResult.error}</p>
            )}
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col items-center justify-center space-y-4">
            {barcodeResult.svg ? (
              <>
                <iframe
                  title="Generated Code 128 Barcode"
                  sandbox=""
                  srcDoc={`<!doctype html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:${bgColor};">${barcodeResult.svg}</body></html>`}
                  className="w-full max-w-md h-36 rounded-xl border border-slate-200 dark:border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([barcodeResult.svg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `barcode-${barcodeText}.svg`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" /> Download Barcode SVG
                </button>
              </>
            ) : (
              <p className="text-xs text-slate-400">Enter text to render Code 128 barcode.</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: CAMERA QR SCANNER */}
      {section === 'scanner' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 max-w-2xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Camera QR & Barcode Scanner</h2>
              <p className="text-xs text-slate-500">Camera access only starts when clicked and stops immediately when closed.</p>
            </div>
            {cameraActive ? (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                <CameraOff className="w-4 h-4" /> Stop Camera
              </button>
            ) : (
              <button
                type="button"
                onClick={startCameraScan}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
              >
                <Camera className="w-4 h-4" /> Start Camera Scan
              </button>
            )}
          </div>

          {!hasBarcodeDetector && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              Note: Native in-browser <code className="font-mono">BarcodeDetector</code> is supported on Chrome/Edge/Android WebView; other browsers may preview video without automatic frame decoding.
            </div>
          )}

          {cameraActive && (
            <div className="aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
              <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
            </div>
          )}

          {scanError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
              {scanError}
            </div>
          )}

          {scanResult && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Scanned Result</span>
              <p className="font-mono text-xs text-slate-900 dark:text-white break-all">{scanResult}</p>
              <button
                type="button"
                onClick={() => {
                  copyToClipboard(scanResult);
                  showToast('Scanned payload copied!', 'success');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Result
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
