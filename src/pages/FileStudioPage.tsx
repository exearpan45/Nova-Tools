import React, { useState, useRef, useEffect } from 'react';
import {
  FolderOpen, Upload, Play, Trash2, Download, RefreshCw, CheckCircle2,
  AlertCircle, FileArchive, ShieldCheck, X, Pause, Eye, ArrowRight
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { useToast } from '../context/ToastContext';
import { inspectFileSignature, sanitizeSvgContent, SignatureInspection } from '../utils/fileSignatures';
import { buildZipBlob } from '../utils/zipBuilder';

interface StudioFileItem {
  id: string;
  file: File;
  inspection?: SignatureInspection;
  previewUrl?: string;
  svgMarkup?: string;
  textSample?: string;
  status: 'queued' | 'processing' | 'done' | 'error' | 'cancelled';
  progress: number;
  outputBlob?: Blob;
  outputUrl?: string;
  outputName?: string;
  outputSize?: number;
  errorMsg?: string;
}

type BatchAction = 'compress-webp' | 'convert-png' | 'convert-jpeg' | 'resize-1280' | 'format-json';

export const FileStudioPage: React.FC = () => {
  const { navigate, triggerSound, pushNotification } = useNova();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cancelFlagRef = useRef<boolean>(false);

  const [items, setItems] = useState<StudioFileItem[]>([]);
  const [selectedAction, setSelectedAction] = useState<BatchAction>('compress-webp');
  const [quality, setQuality] = useState<number>(82);
  const [maxWidth, setMaxWidth] = useState<number>(1280);
  const [concurrency, setConcurrency] = useState<number>(2);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inspectedItemId, setInspectedItemId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
        if (it.outputUrl) URL.revokeObjectURL(it.outputUrl);
      });
    };
  }, []);

  const addFiles = async (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    const prepared: StudioFileItem[] = [];
    for (const file of incoming) {
      const inspection = await inspectFileSignature(file);
      let previewUrl: string | undefined;
      let svgMarkup: string | undefined;
      let textSample: string | undefined;

      if (inspection.detectedMime === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        const rawText = await file.text();
        svgMarkup = sanitizeSvgContent(rawText);
      } else if (inspection.detectedMime.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      } else if (
        inspection.detectedMime.startsWith('text/') ||
        inspection.detectedMime === 'application/json' ||
        /\.(txt|md|csv|json|xml)$/i.test(file.name)
      ) {
        textSample = (await file.slice(0, 8192).text()).slice(0, 1200);
      }

      prepared.push({
        id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        inspection,
        previewUrl,
        svgMarkup,
        textSample,
        status: inspection.isValidSize ? 'queued' : 'error',
        progress: 0,
        errorMsg: inspection.isValidSize ? undefined : inspection.warning,
      });
    }

    setItems((prev) => [...prev, ...prepared]);
    if (!inspectedItemId && prepared[0]) setInspectedItemId(prepared[0].id);
    triggerSound('click');
  };

  const processSingleItem = async (item: StudioFileItem): Promise<Partial<StudioFileItem>> => {
    const isImage = item.inspection?.detectedMime.startsWith('image/') && item.inspection.detectedMime !== 'image/svg+xml';

    if (selectedAction === 'format-json') {
      const text = await item.file.text();
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      const blob = new Blob([formatted], { type: 'application/json' });
      const outputUrl = URL.createObjectURL(blob);
      const base = item.file.name.replace(/\.[^/.]+$/, '');
      return {
        status: 'done',
        progress: 100,
        outputBlob: blob,
        outputUrl,
        outputName: `${base}.formatted.json`,
        outputSize: blob.size,
      };
    }

    if (!isImage) {
      throw new Error(`Unsupported format (${item.inspection?.detectedFormat || item.file.type || 'unknown'}) for image batch operation.`);
    }

    const objUrl = URL.createObjectURL(item.file);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to decode raster image.'));
        img.src = objUrl;
      });

      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;

      if (selectedAction === 'resize-1280' || maxWidth > 0) {
        const limit = selectedAction === 'resize-1280' ? Math.max(100, maxWidth) : 4096;
        if (w > limit) {
          h = Math.round((h * limit) / w);
          w = limit;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable.');

      if (selectedAction === 'convert-jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);

      const targetMime =
        selectedAction === 'convert-png'
          ? 'image/png'
          : selectedAction === 'convert-jpeg'
          ? 'image/jpeg'
          : 'image/webp';
      const ext = targetMime === 'image/png' ? 'png' : targetMime === 'image/jpeg' ? 'jpg' : 'webp';

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (res) => (res ? resolve(res) : reject(new Error(`Browser could not encode ${ext.toUpperCase()}.`))),
          targetMime,
          quality / 100
        );
      });

      const outputUrl = URL.createObjectURL(blob);
      const base = item.file.name.replace(/\.[^/.]+$/, '');
      return {
        status: 'done',
        progress: 100,
        outputBlob: blob,
        outputUrl,
        outputName: `${base}.${ext}`,
        outputSize: blob.size,
      };
    } finally {
      URL.revokeObjectURL(objUrl);
    }
  };

  const runQueue = async (onlyFailedOrQueued = true) => {
    const queue = items.filter((it) =>
      onlyFailedOrQueued ? it.status === 'queued' || it.status === 'error' || it.status === 'cancelled' : true
    );
    if (queue.length === 0) {
      showToast('Add queued files or select items to process.', 'info');
      return;
    }

    cancelFlagRef.current = false;
    setIsRunning(true);

    let cursor = 0;
    let successCount = 0;
    let failCount = 0;

    const worker = async () => {
      while (cursor < queue.length) {
        if (cancelFlagRef.current) break;
        const current = queue[cursor++];
        if (!current) break;

        setItems((prev) =>
          prev.map((it) => (it.id === current.id ? { ...it, status: 'processing', progress: 45, errorMsg: undefined } : it))
        );

        try {
          const result = await processSingleItem(current);
          if (cancelFlagRef.current) {
            setItems((prev) =>
              prev.map((it) => (it.id === current.id ? { ...it, status: 'cancelled', progress: 0 } : it))
            );
            break;
          }
          successCount++;
          setItems((prev) => prev.map((it) => (it.id === current.id ? { ...it, ...result } : it)));
        } catch (err: any) {
          failCount++;
          setItems((prev) =>
            prev.map((it) =>
              it.id === current.id
                ? { ...it, status: 'error', progress: 0, errorMsg: err?.message || 'Processing failed' }
                : it
            )
          );
        }
      }
    };

    const poolSize = Math.max(1, Math.min(concurrency, queue.length));
    await Promise.all(Array.from({ length: poolSize }, () => worker()));

    setIsRunning(false);
    if (cancelFlagRef.current) {
      showToast('Batch queue cancelled.', 'info');
    } else if (failCount === 0) {
      triggerSound('success');
      showToast(`Processed ${successCount} file(s) locally in browser.`, 'success');
      pushNotification('File Studio Batch Complete', `${successCount} file(s) processed locally.`, 'success');
    } else {
      showToast(`Completed: ${successCount} succeeded, ${failCount} failed.`, 'error');
      pushNotification('File Studio Finished with Errors', `${successCount} succeeded, ${failCount} failed.`, 'error');
    }
  };

  const retrySingle = async (itemId: string) => {
    const target = items.find((i) => i.id === itemId);
    if (!target) return;
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, status: 'processing', progress: 50, errorMsg: undefined } : it)));
    try {
      const res = await processSingleItem(target);
      setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, ...res } : it)));
      triggerSound('success');
    } catch (err: any) {
      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, status: 'error', progress: 0, errorMsg: err?.message || 'Retry failed' } : it))
      );
    }
  };

  const downloadZip = async () => {
    const ready = items.filter((it) => it.status === 'done' && it.outputBlob && it.outputName);
    if (ready.length === 0) {
      showToast('No completed files available for ZIP export yet.', 'error');
      return;
    }

    const zipInputs = await Promise.all(
      ready.map(async (it) => ({
        name: it.outputName!,
        data: new Uint8Array(await it.outputBlob!.arrayBuffer()),
      }))
    );

    const zipBlob = buildZipBlob(zipInputs);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-file-studio-batch-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerSound('success');
    showToast(`Exported ${ready.length} file(s) as ZIP.`, 'success');
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.outputUrl) URL.revokeObjectURL(target.outputUrl);
      return prev.filter((i) => i.id !== id);
    });
    if (inspectedItemId === id) setInspectedItemId(null);
  };

  const clearAll = () => {
    items.forEach((it) => {
      if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
      if (it.outputUrl) URL.revokeObjectURL(it.outputUrl);
    });
    setItems([]);
    setInspectedItemId(null);
    triggerSound('delete');
  };

  const completedCount = items.filter((i) => i.status === 'done').length;
  const overallProgress = items.length > 0 ? Math.round((items.reduce((s, i) => s + i.progress, 0)) / items.length) : 0;
  const inspectedItem = items.find((i) => i.id === inspectedItemId) || items[0] || null;

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            File Studio & Batch Processing Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Local Batch File Workbench
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inspect file signatures, safely preview files, run multi-file conversions, and bundle outputs into a ZIP locally.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/tools/file-inspector')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-500"
          >
            <span>Hex Inspector</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/tools/pdf-merger')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-violet-500"
          >
            <span>PDF Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dropzone & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="lg:col-span-2 p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-white dark:bg-slate-900/40 cursor-pointer flex flex-col items-center justify-center text-center space-y-3 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports PNG, JPEG, WebP, GIF, sanitized SVG, PDF, CSV, JSON, and Markdown. Processed strictly in browser RAM.
            </p>
          </div>
        </div>

        {/* Batch Settings */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Batch Pipeline</h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Local Only
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Operation Target
              </label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value as BatchAction)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
              >
                <option value="compress-webp">Optimize & Convert to WebP</option>
                <option value="convert-png">Convert Images to PNG</option>
                <option value="convert-jpeg">Convert Images to JPEG</option>
                <option value="resize-1280">Resize & Compress WebP</option>
                <option value="format-json">Pretty-Format JSON Files</option>
              </select>
            </div>

            {selectedAction !== 'format-json' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-mono tabular-nums">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-mono tabular-nums">
                    Max Width ({maxWidth}px)
                  </label>
                  <input
                    type="number"
                    min="120"
                    max="4096"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-mono tabular-nums">
                Worker Concurrency: {concurrency} parallel
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={concurrency}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {!isRunning ? (
                <button
                  type="button"
                  onClick={() => runQueue(true)}
                  disabled={items.length === 0}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Process Queue</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    cancelFlagRef.current = true;
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}

              <button
                type="button"
                onClick={downloadZip}
                disabled={completedCount === 0}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
              >
                <FileArchive className="w-3.5 h-3.5" />
                <span>ZIP ({completedCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Queue + Preview Split */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* File Queue List */}
          <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Processing Queue ({items.length})
                </h2>
                <span className="text-xs font-mono tabular-nums text-cyan-600 dark:text-cyan-400">
                  {overallProgress}%
                </span>
              </div>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Temporary Files</span>
              </button>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setInspectedItemId(item.id)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    inspectedItem?.id === item.id
                      ? 'border-cyan-500/60 bg-cyan-500/5'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.file.name}
                      </span>
                      <span className="text-[11px] font-mono tabular-nums text-slate-500 shrink-0">
                        {Math.max(1, Math.round(item.file.size / 1024))} KB
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{item.inspection?.detectedFormat || 'Detecting...'}</span>
                      {item.status === 'done' && item.outputSize !== undefined && (
                        <>
                          <span>→</span>
                          <span className="font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                            {Math.max(1, Math.round(item.outputSize / 1024))} KB ({item.outputName})
                          </span>
                        </>
                      )}
                      {item.errorMsg && (
                        <span className="text-rose-500 font-medium">{item.errorMsg}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {item.status === 'processing' && <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin" />}
                    {item.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {item.status === 'error' && (
                      <button
                        type="button"
                        onClick={() => retrySingle(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[11px] font-bold flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                    )}
                    {item.outputUrl && item.outputName && (
                      <a
                        href={item.outputUrl}
                        download={item.outputName}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Save
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Inspector & Safe Preview */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-violet-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">File Preview & Signature</h2>
            </div>

            {inspectedItem ? (
              <div className="space-y-3 text-xs">
                <div className="aspect-video rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-2">
                  {inspectedItem.previewUrl ? (
                    <img
                      src={inspectedItem.outputUrl || inspectedItem.previewUrl}
                      alt={inspectedItem.file.name}
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : inspectedItem.svgMarkup ? (
                    <iframe
                      title="Sanitized SVG Preview"
                      sandbox=""
                      srcDoc={`<!doctype html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#f8fafc;">${inspectedItem.svgMarkup}</body></html>`}
                      className="w-full h-full border-0 bg-white"
                    />
                  ) : inspectedItem.textSample ? (
                    <pre className="w-full h-full overflow-auto p-2 font-mono text-[10px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {inspectedItem.textSample}
                    </pre>
                  ) : (
                    <div className="text-center text-slate-400 space-y-1">
                      <FolderOpen className="w-7 h-7 mx-auto opacity-50" />
                      <span className="block">{inspectedItem.inspection?.detectedFormat}</span>
                    </div>
                  )}
                </div>

                <dl className="space-y-2 pt-1">
                  <div className="flex justify-between gap-2 border-b border-slate-100 dark:border-slate-800/70 pb-1.5">
                    <dt className="text-slate-400">Detected Type</dt>
                    <dd className="font-semibold text-slate-900 dark:text-white text-right">
                      {inspectedItem.inspection?.detectedFormat}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-slate-100 dark:border-slate-800/70 pb-1.5">
                    <dt className="text-slate-400">Verified MIME</dt>
                    <dd className="font-mono text-slate-700 dark:text-slate-300">{inspectedItem.inspection?.detectedMime}</dd>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-slate-100 dark:border-slate-800/70 pb-1.5">
                    <dt className="text-slate-400">Original Size</dt>
                    <dd className="font-mono tabular-nums text-slate-900 dark:text-white">
                      {inspectedItem.file.size.toLocaleString()} bytes
                    </dd>
                  </div>
                  {inspectedItem.inspection?.warning && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{inspectedItem.inspection.warning}</span>
                    </div>
                  )}
                </dl>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-8 text-center">Select a file in the queue to inspect details.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No files queued yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drop multiple images, SVGs, or JSON files above to inspect signatures and convert them in batch without uploading anything to a server.
          </p>
        </div>
      )}
    </div>
  );
};
