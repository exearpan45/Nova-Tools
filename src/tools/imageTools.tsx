import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import {
  Upload, Download, RefreshCw, Copy, Check, Sliders, Maximize2,
  Crop, Eye, Pipette, Palette, FlipHorizontal, RotateCw, Contrast,
  FileCode, Sparkles, FileImage, Image as ImageIcon
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { AdvancedImageTools } from './AdvancedImageTools';

interface ImageProps {
  toolSlug: string;
}

export const ImageTools: React.FC<ImageProps> = ({ toolSlug }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imgNaturalWidth, setImgNaturalWidth] = useState<number>(0);
  const [imgNaturalHeight, setImgNaturalHeight] = useState<number>(0);
  const [originalSize, setOriginalSize] = useState<number>(0);

  // Compression & conversion states
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number>(0);
  const [targetSizeValue, setTargetSizeValue] = useState<number>(200);
  const [targetSizeUnit, setTargetSizeUnit] = useState<'KB' | 'MB'>('KB');
  const [compressionMessage, setCompressionMessage] = useState<string>('');
  const processSequenceRef = useRef<number>(0);

  // Resize states
  const [resizeWidth, setResizeWidth] = useState<number>(800);
  const [resizeHeight, setResizeHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  // Rotation & Flip
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Filters
  const [blurVal, setBlurVal] = useState<number>(5);
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);

  // Color picker & Palette
  const [pickedColor, setPickedColor] = useState<{ hex: string; rgb: string; hsl: string } | null>(null);
  const [palette, setPalette] = useState<string[]>([]);

  // Base64 & SVG
  const [base64String, setBase64String] = useState<string>('');
  const [svgInput, setSvgInput] = useState<string>('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" fill="#3b82f6" />\n  <path d="M30 50 L45 65 L70 35" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />\n</svg>');

  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Set default format based on tool
  useEffect(() => {
    if (toolSlug === 'jpg-to-png' || toolSlug === 'webp-to-png') setOutputFormat('image/png');
    else if (toolSlug === 'png-to-jpg' || toolSlug === 'webp-to-jpg') setOutputFormat('image/jpeg');
    else if (toolSlug === 'jpg-to-webp' || toolSlug === 'png-to-webp') setOutputFormat('image/webp');
    else if (toolSlug === 'image-grayscale') setIsGrayscale(true);
  }, [toolSlug]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImageSrc(dataUrl);

      const img = new Image();
      img.onload = () => {
        setImgNaturalWidth(img.width);
        setImgNaturalHeight(img.height);
        setResizeWidth(img.width);
        setResizeHeight(img.height);
        setBase64String(dataUrl);
        extractPalette(img);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (w: number) => {
    setResizeWidth(w);
    if (lockAspect && imgNaturalWidth > 0) {
      setResizeHeight(Math.round((w / imgNaturalWidth) * imgNaturalHeight));
    }
  };

  const handleHeightChange = (h: number) => {
    setResizeHeight(h);
    if (lockAspect && imgNaturalHeight > 0) {
      setResizeWidth(Math.round((h / imgNaturalHeight) * imgNaturalWidth));
    }
  };

  const processCanvas = (sourceImg?: HTMLImageElement) => {
    const sequence = ++processSequenceRef.current;
    const img = sourceImg || new Image();
    const run = async () => {
      const targetW = toolSlug === 'image-resizer' ? Math.max(1, Math.floor(resizeWidth)) : img.naturalWidth || img.width;
      const targetH = toolSlug === 'image-resizer' ? Math.max(1, Math.floor(resizeHeight)) : img.naturalHeight || img.height;
      const targetBytes = Math.max(1, targetSizeValue) * (targetSizeUnit === 'MB' ? 1024 * 1024 : 1024);
      const isTargetCompression = toolSlug === 'image-compressor';
      let bestBlob: Blob | null = null;
      let bestWidth = targetW;
      let bestHeight = targetH;
      const baseQuality = Math.min(1, Math.max(0.1, quality / 100));
      const scaleSteps = isTargetCompression ? [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25] : [1];
      const qualitySteps = isTargetCompression ? [...new Set([baseQuality, Math.min(baseQuality, 0.75), Math.min(baseQuality, 0.6), Math.min(baseQuality, 0.45), Math.min(baseQuality, 0.3), Math.min(baseQuality, 0.2)])] : [baseQuality];

      for (const scale of scaleSteps) {
        const width = Math.max(1, Math.round(targetW * scale));
        const height = Math.max(1, Math.round(targetH * scale));
        const canvas = document.createElement('canvas');
        const swapped = rotation % 180 !== 0;
        canvas.width = swapped ? height : width;
        canvas.height = swapped ? width : height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Your browser could not create an image canvas.');
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        if (toolSlug === 'image-blur') ctx.filter = `blur(${blurVal}px)`;
        else if (toolSlug === 'image-grayscale' || isGrayscale) ctx.filter = 'grayscale(100%)';
        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        }
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();

        for (const q of qualitySteps) {
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputFormat, q));
          if (!blob) continue;
          if (!bestBlob || blob.size < bestBlob.size) {
            bestBlob = blob;
            bestWidth = width;
            bestHeight = height;
          }
          if (!isTargetCompression || blob.size <= targetBytes) {
            bestBlob = blob;
            bestWidth = width;
            bestHeight = height;
            break;
          }
        }
        if (bestBlob && (!isTargetCompression || bestBlob.size <= targetBytes)) break;
        if (!isTargetCompression) break;
      }

      if (sequence !== processSequenceRef.current || !bestBlob) return;
      setProcessedSize(bestBlob.size);
      setCompressionMessage(isTargetCompression
        ? bestBlob.size <= targetBytes
          ? `Target reached: ${formatBytes(bestBlob.size)} (target ${targetSizeValue} ${targetSizeUnit}). Dimensions may be reduced to meet the size.`
          : `Smallest result found: ${formatBytes(bestBlob.size)}. This image could not reach ${targetSizeValue} ${targetSizeUnit} with the selected format and browser encoder.`
        : '');
      setProcessedUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(bestBlob as Blob);
      });
    };

    if (sourceImg) {
      void run().catch((error) => setCompressionMessage(error instanceof Error ? error.message : 'Could not process this image.'));
    } else if (imageSrc) {
      img.onload = () => { void run().catch((error) => setCompressionMessage(error instanceof Error ? error.message : 'Could not process this image.')); };
      img.onerror = () => setCompressionMessage('This image format could not be opened by your browser. Try JPG, PNG, or WebP.');
      img.src = imageSrc;
    }
  };

  useEffect(() => {
    if (imageSrc) {
      processCanvas();
    }
  }, [imageSrc, quality, outputFormat, resizeWidth, resizeHeight, rotation, flipH, flipV, blurVal, isGrayscale, targetSizeValue, targetSizeUnit, toolSlug]);

  const extractPalette = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, 100, 100);
    const data = ctx.getImageData(0, 0, 100, 100).data;

    const colors: Record<string, number> = {};
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // round to 16 for clustering
      const qr = Math.round(r / 32) * 32;
      const qg = Math.round(g / 32) * 32;
      const qb = Math.round(b / 32) * 32;
      const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1)}`;
      colors[hex] = (colors[hex] || 0) + 1;
    }
    const sorted = Object.entries(colors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([hex]) => hex);
    setPalette(sorted);
  };

  const handleEyedropperCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const p = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1)}`;
    const rgb = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;

    // Calculate HSL
    const r = p[0] / 255;
    const g = p[1] / 255;
    const b = p[2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    setPickedColor({ hex, rgb, hsl });
  };

  // Render canvas preview for eyedropper
  useEffect(() => {
    if (canvasRef.current && imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Special case: SVG previewer
  if (['image-cropper', 'image-format-converter', 'png-to-jpg', 'jpg-to-png', 'webp-converter', 'image-to-pdf', 'image-rotator', 'image-flipper', 'image-watermark', 'image-overlay', 'background-color-changer', 'image-grayscale', 'image-brightness', 'image-contrast', 'image-saturation', 'image-blur'].includes(toolSlug)) {
    return <AdvancedImageTools toolSlug={toolSlug} />;
  }

  if (toolSlug === 'svg-previewer') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                SVG Code Input
              </label>
              <button
                onClick={() => handleCopy(svgInput)}
                className="text-xs flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy SVG'}
              </button>
            </div>
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              className="w-full h-72 font-mono text-xs p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Paste raw <svg> code here..."
            />
          </div>
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Scaled Preview
            </span>
            <div className="h-72 flex items-center justify-center p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 overflow-hidden shadow-inner">
              <div
                className="max-h-full max-w-full flex items-center justify-center"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(svgInput, {
                    USE_PROFILES: { svg: true, svgFilters: true },
                    ADD_TAGS: ['use'],
                  }),
                }}
              />
            </div>
            <div className="flex justify-end">
              <a
                href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgInput)}`}
                download="vector-asset.svg"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" /> Download .svg
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Dropzone */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center p-6 sm:p-10 md:p-14 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-400 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 cursor-pointer transition-all duration-200 text-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-1">
            Choose an image or drop it here
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 text-center max-w-sm">
            PNG, JPG, WebP, SVG, AVIF · 100% private in browser
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs"
            >
              Choose Image
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-900 dark:text-white">
                Original: {imgNaturalWidth} × {imgNaturalHeight}px ({formatBytes(originalSize)})
              </span>
              {processedSize > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Output: {formatBytes(processedSize)}
                    {originalSize > 0 && (
                      <span className="ml-1 text-[11px] font-normal">
                        ({Math.round(((originalSize - processedSize) / originalSize) * 100)}% saved)
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setImageFile(null);
                  setImageSrc(null);
                  setProcessedUrl(null);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Choose Another Image
              </button>
              {processedUrl && (
                <a
                  href={processedUrl}
                  download={`nova-${toolSlug}.${outputFormat.split('/')[1]}`}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              )}
            </div>
          </div>

          {compressionMessage && toolSlug === 'image-compressor' && (
            <div role="status" className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-slate-700 dark:text-slate-200">{compressionMessage}</div>
          )}

          {/* Tool Specific Config Controls */}
          {(toolSlug === 'image-compressor' || toolSlug === 'image-converter' || toolSlug.includes('to-')) && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Quality & Compression
                </span>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              {toolSlug === 'image-compressor' && (
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Target file size</label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">NOVA will lower quality and, if needed, image dimensions to get as close as possible.</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input aria-label="Target image size" type="number" min="1" max={targetSizeUnit === 'MB' ? 100 : 102400} value={targetSizeValue} onChange={(e) => setTargetSizeValue(Math.max(1, Number(e.target.value) || 1))} className="w-24 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                    <select aria-label="Target image size unit" value={targetSizeUnit} onChange={(e) => setTargetSizeUnit(e.target.value as 'KB' | 'MB')} className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                      <option value="KB">KB</option><option value="MB">MB</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-slate-500 mr-2">Target Format:</span>
                {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors ${
                      outputFormat === fmt
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {fmt.split('/')[1]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {toolSlug === 'image-resizer' && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Dimensions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={resizeWidth}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={resizeHeight}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300 pt-1">
                <input
                  type="checkbox"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-500"
                />
                Maintain aspect ratio
              </label>
            </div>
          )}

          {(toolSlug === 'image-rotate' || toolSlug === 'image-flip') && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCw className="w-4 h-4 text-cyan-500" /> Rotate 90° Clockwise
              </button>
              <button
                onClick={() => setFlipH((f) => !f)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  flipH ? 'bg-cyan-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <FlipHorizontal className="w-4 h-4" /> Flip Horizontal
              </button>
              <button
                onClick={() => setFlipV((f) => !f)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  flipV ? 'bg-cyan-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                Flip Vertical
              </button>
            </div>
          )}

          {toolSlug === 'image-blur' && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Blur Intensity</span>
                <span className="font-mono text-cyan-500">{blurVal}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={blurVal}
                onChange={(e) => setBlurVal(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          )}

          {/* Interactive Eyedropper / Palette Result */}
          {toolSlug === 'color-picker-image' && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click anywhere on the preview image below to inspect color values:
              </p>
              {pickedColor ? (
                <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div
                    className="w-12 h-12 rounded-xl shadow-md border border-white/20 shrink-0"
                    style={{ backgroundColor: pickedColor.hex }}
                  />
                  <div className="flex flex-wrap gap-4 text-xs font-mono">
                    <button
                      onClick={() => handleCopy(pickedColor.hex)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-500"
                    >
                      <span className="text-slate-400 font-sans">HEX:</span> {pickedColor.hex}
                    </button>
                    <button
                      onClick={() => handleCopy(pickedColor.rgb)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-500"
                    >
                      <span className="text-slate-400 font-sans">RGB:</span> {pickedColor.rgb}
                    </button>
                    <button
                      onClick={() => handleCopy(pickedColor.hsl)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-500"
                    >
                      <span className="text-slate-400 font-sans">HSL:</span> {pickedColor.hsl}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs italic text-slate-400">Click on the image to sample a color pixel.</div>
              )}
            </div>
          )}

          {toolSlug === 'color-palette-generator' && palette.length > 0 && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Extracted Color Palette
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {palette.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopy(color)}
                    className="group flex flex-col items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                  >
                    <div
                      className="w-full h-16 rounded-lg shadow-inner border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300 group-hover:text-cyan-500 font-semibold">
                      {color}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {toolSlug === 'image-base64' && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Base64 Data URL ({base64String.length.toLocaleString()} chars)
                </span>
                <button
                  onClick={() => handleCopy(base64String)}
                  className="text-xs flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Data URL'}
                </button>
              </div>
              <textarea
                readOnly
                value={base64String}
                className="w-full h-32 text-xs font-mono p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              />
            </div>
          )}

          {/* Full-size before / after workspace */}
          <section className="space-y-3" aria-label="Full image preview comparison">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Full image preview</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Original stays unchanged</span>
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/40">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Original</span>
                  <span className="text-[11px] text-slate-500">{imgNaturalWidth} × {imgNaturalHeight}px · {formatBytes(originalSize)}</span>
                </div>
                <div className="flex min-h-[320px] items-center justify-center p-3 sm:p-5">
                  {imageSrc && <img src={imageSrc} alt="Original uploaded image full preview" className="max-h-[620px] max-w-full object-contain" />}
                </div>
                {imageSrc && <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3"><a href={imageSrc} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 hover:underline">Open original at full size</a></div>}
              </div>
              <div className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-100/60 dark:bg-slate-950/40">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{toolSlug === 'color-picker-image' ? 'Color picker canvas' : 'Processed output'}</span>
                  {processedSize > 0 && <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{formatBytes(processedSize)} output</span>}
                </div>
                <div className="flex min-h-[320px] items-center justify-center p-3 sm:p-5">
                  {toolSlug === 'color-picker-image' ? (
                    <canvas ref={canvasRef} onClick={handleEyedropperCanvasClick} aria-label="Click image to inspect a color" className="max-h-[620px] max-w-full rounded-lg cursor-crosshair shadow-md object-contain" />
                  ) : processedUrl ? (
                    <img src={processedUrl} alt="Processed image full preview" className="max-h-[620px] max-w-full rounded-lg shadow-md object-contain transition-all" />
                  ) : (
                    <div className="text-xs text-slate-400" role="status">Preparing preview…</div>
                  )}
                </div>
                {processedUrl && <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3"><a href={processedUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 hover:underline">Open processed image at full size</a></div>}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
