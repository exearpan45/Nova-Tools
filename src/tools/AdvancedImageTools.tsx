import React, { useEffect, useMemo, useState } from 'react';
import { Download, ImagePlus, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Sparkles, Upload } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

type ImageMime = 'image/png' | 'image/jpeg' | 'image/webp';

const imageTools = new Set([
  'image-cropper', 'image-format-converter', 'png-to-jpg', 'jpg-to-png', 'webp-converter',
  'image-to-pdf', 'image-rotator', 'image-flipper', 'image-watermark', 'image-overlay',
  'background-color-changer', 'image-grayscale', 'image-brightness', 'image-contrast',
  'image-saturation', 'image-blur', 'image-sharpen', 'image-pixelator'
]);

const titles: Record<string, string> = {
  'image-cropper': 'Crop image',
  'image-format-converter': 'Convert image format',
  'png-to-jpg': 'PNG to JPG',
  'jpg-to-png': 'JPG to PNG',
  'webp-converter': 'WebP converter',
  'image-to-pdf': 'Image to PDF',
  'image-rotator': 'Rotate image',
  'image-flipper': 'Flip image',
  'image-watermark': 'Add text watermark',
  'image-overlay': 'Overlay another image',
  'background-color-changer': 'Change transparent background',
  'image-grayscale': 'Grayscale image',
  'image-brightness': 'Adjust brightness',
  'image-contrast': 'Adjust contrast',
  'image-saturation': 'Adjust saturation',
  'image-blur': 'Blur image',
  'image-sharpen': 'Sharpen image',
  'image-pixelator': 'Pixelate image'
};

const defaultMime = (slug: string): ImageMime => {
  if (slug === 'jpg-to-png') return 'image/png';
  if (slug === 'webp-converter') return 'image/webp';
  if (slug === 'image-to-pdf' || slug === 'png-to-jpg') return 'image/jpeg';
  return 'image/png';
};

const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('This image could not be decoded. Try a JPG, PNG, or WebP file.'));
  image.src = src;
});

const asBlob = (canvas: HTMLCanvasElement, mime: ImageMime, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Your browser could not export this image. Try another format.')), mime, quality);
  });

const prettyBytes = (bytes: number) => bytes < 1024 ? bytes + ' B' : bytes < 1024 * 1024 ? (bytes / 1024).toFixed(1) + ' KB' : (bytes / (1024 * 1024)).toFixed(2) + ' MB';

interface AdvancedImageToolsProps {
  toolSlug: string;
}

export const AdvancedImageTools: React.FC<AdvancedImageToolsProps> = ({ toolSlug }) => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputMime, setOutputMime] = useState<ImageMime>(defaultMime(toolSlug));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(0);
  const [cropH, setCropH] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [quality, setQuality] = useState(88);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(4);
  const [pixelSize, setPixelSize] = useState(12);
  const [watermark, setWatermark] = useState('NOVA TOOLS');
  const [overlayOpacity, setOverlayOpacity] = useState(45);
  const [background, setBackground] = useState('#ffffff');

  useEffect(() => {
    setOutputMime(defaultMime(toolSlug));
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setBrightness(0);
    setContrast(100);
    setSaturation(100);
    setBlur(4);
    setPixelSize(12);
    setError('');
  }, [toolSlug]);

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  }, [sourceUrl]);

  useEffect(() => () => {
    if (overlayUrl) URL.revokeObjectURL(overlayUrl);
  }, [overlayUrl]);

  useEffect(() => () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
  }, [outputUrl]);

  const isConverter = useMemo(() => ['image-format-converter', 'png-to-jpg', 'jpg-to-png', 'webp-converter', 'image-to-pdf'].includes(toolSlug), [toolSlug]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!sourceUrl) {
        setOutputBlob(null);
        setOutputUrl(null);
        return;
      }
      setBusy(true);
      setError('');
      try {
        const source = await loadImage(sourceUrl);
        const width = source.naturalWidth;
        const height = source.naturalHeight;
        if (!width || !height || width * height > 25000000) {
          throw new Error('For smooth performance, use an image smaller than 25 megapixels.');
        }
        const sx = toolSlug === 'image-cropper' ? Math.max(0, Math.min(width - 1, Math.floor(cropX))) : 0;
        const sy = toolSlug === 'image-cropper' ? Math.max(0, Math.min(height - 1, Math.floor(cropY))) : 0;
        const sw = toolSlug === 'image-cropper' ? Math.max(1, Math.min(width - sx, Math.floor(cropW || width))) : width;
        const sh = toolSlug === 'image-cropper' ? Math.max(1, Math.min(height - sy, Math.floor(cropH || height))) : height;
        const turn = ((rotation % 360) + 360) % 360;
        const swap = turn === 90 || turn === 270;
        const canvas = document.createElement('canvas');
        canvas.width = swap ? sh : sw;
        canvas.height = swap ? sw : sh;
        const ctx = canvas.getContext('2d', { willReadFrequently: toolSlug === 'image-sharpen' });
        if (!ctx) throw new Error('Canvas is unavailable in this browser.');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        if (outputMime === 'image/jpeg') {
          ctx.fillStyle = toolSlug === 'background-color-changer' ? background : '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (toolSlug === 'background-color-changer') {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(turn * Math.PI / 180);
        ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        const filterParts: string[] = [];
        if (toolSlug === 'image-grayscale') filterParts.push('grayscale(1)');
        if (toolSlug === 'image-brightness') filterParts.push('brightness(' + Math.max(0, 100 + brightness) + '%)');
        if (toolSlug === 'image-contrast') filterParts.push('contrast(' + contrast + '%)');
        if (toolSlug === 'image-saturation') filterParts.push('saturate(' + saturation + '%)');
        if (toolSlug === 'image-blur') filterParts.push('blur(' + blur + 'px)');
        if (filterParts.length) ctx.filter = filterParts.join(' ');
        if (toolSlug === 'image-pixelator') {
          const tiny = document.createElement('canvas');
          tiny.width = Math.max(1, Math.ceil(sw / pixelSize));
          tiny.height = Math.max(1, Math.ceil(sh / pixelSize));
          const tinyCtx = tiny.getContext('2d');
          if (!tinyCtx) throw new Error('Canvas is unavailable in this browser.');
          tinyCtx.drawImage(source, sx, sy, sw, sh, 0, 0, tiny.width, tiny.height);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tiny, -sw / 2, -sh / 2, sw, sh);
        } else {
          ctx.drawImage(source, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);
        }
        ctx.restore();
        ctx.filter = 'none';

        if (toolSlug === 'image-sharpen') {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const input = imageData.data;
          const copy = new Uint8ClampedArray(input);
          const w = canvas.width;
          const h = canvas.height;
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const i = (y * w + x) * 4;
              for (let c = 0; c < 3; c++) {
                const value = 5 * copy[i + c] - copy[i - 4 + c] - copy[i + 4 + c] - copy[i - w * 4 + c] - copy[i + w * 4 + c];
                input[i + c] = Math.max(0, Math.min(255, value));
              }
            }
          }
          ctx.putImageData(imageData, 0, 0);
        }

        if (toolSlug === 'image-watermark' && watermark.trim()) {
          ctx.save();
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = Math.max(1, canvas.width / 700);
          ctx.textAlign = 'center';
          ctx.font = 'bold ' + Math.max(18, Math.round(canvas.width / 18)) + 'px sans-serif';
          ctx.strokeText(watermark.trim(), canvas.width / 2, canvas.height - Math.max(24, canvas.height / 14));
          ctx.fillText(watermark.trim(), canvas.width / 2, canvas.height - Math.max(24, canvas.height / 14));
          ctx.restore();
        }

        if (toolSlug === 'image-overlay' && overlayUrl) {
          const overlay = await loadImage(overlayUrl);
          if (cancelled) return;
          const maxW = canvas.width * 0.42;
          const maxH = canvas.height * 0.42;
          const scale = Math.min(maxW / overlay.naturalWidth, maxH / overlay.naturalHeight, 1);
          const ow = Math.max(1, overlay.naturalWidth * scale);
          const oh = Math.max(1, overlay.naturalHeight * scale);
          ctx.save();
          ctx.globalAlpha = overlayOpacity / 100;
          ctx.drawImage(overlay, (canvas.width - ow) / 2, (canvas.height - oh) / 2, ow, oh);
          ctx.restore();
        }

        const blob = await asBlob(canvas, outputMime, quality / 100);
        if (cancelled) return;
        if (toolSlug === 'webp-converter' && blob.type !== 'image/webp') {
          throw new Error('This browser cannot export WebP from canvas. Try Chrome or choose PNG/JPG in the format converter.');
        }
        setOutputBlob(blob);
        setOutputUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return URL.createObjectURL(blob);
        });
      } catch (err) {
        if (!cancelled) {
          setOutputBlob(null);
          setOutputUrl(null);
          setError(err instanceof Error ? err.message : 'Image processing failed. Try another file or format.');
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [sourceUrl, overlayUrl, toolSlug, outputMime, quality, cropX, cropY, cropW, cropH, rotation, flipX, flipY, brightness, contrast, saturation, blur, pixelSize, watermark, overlayOpacity, background]);

  const chooseSource = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      return;
    }
    if (file.size > 40 * 1024 * 1024) {
      setError('Please choose an image smaller than 40 MB for reliable browser performance.');
      return;
    }
    setSourceFile(file);
    setSourceUrl(URL.createObjectURL(file));
    setOutputBlob(null);
    setOutputUrl(null);
    setError('');
    const probe = new Image();
    probe.onload = () => {
      setCropX(0);
      setCropY(0);
      setCropW(probe.naturalWidth);
      setCropH(probe.naturalHeight);
    };
    probe.src = URL.createObjectURL(file);
  };

  const chooseOverlay = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose a valid image for the overlay.');
      return;
    }
    setOverlayUrl(URL.createObjectURL(file));
  };

  const downloadImage = () => {
    if (!outputUrl || !outputBlob) return;
    const extension = outputBlob.type.split('/')[1] || 'png';
    const link = document.createElement('a');
    link.href = outputUrl;
    link.download = 'nova-' + toolSlug + '.' + extension;
    link.click();
  };

  const downloadPdf = async () => {
    if (!outputBlob) return;
    setBusy(true);
    setError('');
    try {
      const pdf = await PDFDocument.create();
      const bytes = new Uint8Array(await outputBlob.arrayBuffer());
      const embedded = outputBlob.type === 'image/png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
      const page = pdf.addPage([embedded.width * 0.75, embedded.height * 0.75]);
      page.drawImage(embedded, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'nova-image.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create a PDF from this image.');
    } finally {
      setBusy(false);
    }
  };

  if (!imageTools.has(toolSlug)) return null;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"><Sparkles className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{titles[toolSlug] || 'Image tool'}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Runs locally in your browser. Your image is not uploaded. Very large images may be limited by available memory.</p>
          </div>
        </div>

        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-950/40">
          <Upload className="mb-2 h-6 w-6 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{sourceFile ? 'Choose a different image' : 'Choose an image to begin'}</span>
          <span className="mt-1 text-xs text-slate-500">JPG, PNG, or WebP · up to 40 MB</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="sr-only" onChange={(event) => chooseSource(event.target.files?.[0])} />
        </label>

        {sourceFile && <p className="mt-3 break-all text-xs text-slate-500">{sourceFile.name} · {prettyBytes(sourceFile.size)}</p>}

        {sourceUrl && (
          <div className="mt-5 space-y-4">
            {toolSlug === 'image-cropper' && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[['Crop X', cropX, setCropX], ['Crop Y', cropY, setCropY], ['Width', cropW, setCropW], ['Height', cropH, setCropH]].map(([label, value, setter]) => (
                  <label key={String(label)} className="text-xs font-semibold text-slate-600 dark:text-slate-300">{String(label)} (px)
                    <input type="number" min="0" value={Number(value)} onChange={(event) => (setter as (n: number) => void)(Math.max(0, Number(event.target.value) || 0))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
                  </label>
                ))}
              </div>
            )}

            {isConverter && toolSlug !== 'image-to-pdf' && toolSlug !== 'webp-converter' && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold text-slate-500">Output format</span>
                {(['image/png', 'image/jpeg', 'image/webp'] as ImageMime[]).map((mime) => (
                  <button type="button" key={mime} onClick={() => setOutputMime(mime)} className={'rounded-lg px-3 py-2 text-xs font-bold uppercase ' + (outputMime === mime ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200')}>{mime.split('/')[1]}</button>
                ))}
              </div>
            )}

            {toolSlug === 'image-to-pdf' && <p className="text-xs text-slate-500">The image is fitted to one PDF page. Transparent areas are flattened to white for PDF compatibility.</p>}

            {toolSlug === 'image-rotator' && (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setRotation((v) => (v + 270) % 360)} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-slate-800"><RotateCcw className="h-4 w-4" /> Rotate left</button>
                <button type="button" onClick={() => setRotation((v) => (v + 90) % 360)} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-slate-800"><RotateCw className="h-4 w-4" /> Rotate right</button>
              </div>
            )}

            {toolSlug === 'image-flipper' && (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setFlipX((v) => !v)} className={'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ' + (flipX ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200')}><FlipHorizontal className="h-4 w-4" /> Flip horizontal</button>
                <button type="button" onClick={() => setFlipY((v) => !v)} className={'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ' + (flipY ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200')}><FlipVertical className="h-4 w-4" /> Flip vertical</button>
              </div>
            )}

            {toolSlug === 'image-watermark' && (
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Watermark text
                <input value={watermark} onChange={(event) => setWatermark(event.target.value.slice(0, 80))} maxLength={80} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
              </label>
            )}

            {toolSlug === 'image-overlay' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Overlay image
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => chooseOverlay(event.target.files?.[0])} className="mt-1 block w-full text-xs" />
                </label>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Overlay opacity: {overlayOpacity}%
                  <input type="range" min="5" max="100" value={overlayOpacity} onChange={(event) => setOverlayOpacity(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
                </label>
              </div>
            )}

            {toolSlug === 'background-color-changer' && (
              <label className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Background color <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-10 w-16 cursor-pointer rounded border-0 bg-transparent" /></label>
            )}

            {toolSlug === 'image-brightness' && (
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Brightness: {brightness > 0 ? '+' : ''}{brightness}
                <input type="range" min="-80" max="80" value={brightness} onChange={(event) => setBrightness(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
              </label>
            )}
            {toolSlug === 'image-contrast' && (
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Contrast: {contrast}%
                <input type="range" min="50" max="200" value={contrast} onChange={(event) => setContrast(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
              </label>
            )}
            {toolSlug === 'image-saturation' && (
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Saturation: {saturation}%
                <input type="range" min="0" max="200" value={saturation} onChange={(event) => setSaturation(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
              </label>
            )}
            {toolSlug === 'image-blur' && (
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Blur: {blur}px
                <input type="range" min="0" max="20" value={blur} onChange={(event) => setBlur(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
              </label>
            )}
            {toolSlug === 'image-pixelator' && (
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Pixel block size: {pixelSize}px
                <input type="range" min="2" max="40" value={pixelSize} onChange={(event) => setPixelSize(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
              </label>
            )}

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Quality: {quality}%
                <input type="range" min="30" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="ml-2 inline-block w-28 align-middle accent-cyan-500" />
              </label>
              <button type="button" onClick={() => { setRotation(0); setFlipX(false); setFlipY(false); setBrightness(0); setContrast(100); setSaturation(100); setBlur(4); setPixelSize(12); }} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"><RotateCcw className="h-3.5 w-3.5" /> Reset adjustments</button>
              <div className="flex-1" />
              <span className="text-xs text-slate-500" role="status">{busy ? 'Processing…' : outputBlob ? prettyBytes(outputBlob.size) : 'Ready'}</span>
              {toolSlug === 'image-to-pdf' ? (
                <button type="button" disabled={!outputBlob || busy} onClick={() => void downloadPdf()} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" /> Download PDF</button>
              ) : (
                <button type="button" disabled={!outputBlob || busy} onClick={downloadImage} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" /> Download image</button>
              )}
            </div>
            {error && <p className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-600 dark:text-rose-300" role="alert">{error}</p>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="mb-2 text-xs font-semibold text-slate-500">Original</p>
                <img src={sourceUrl} alt="Original image preview" className="max-h-80 w-full rounded-lg object-contain" />
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-slate-50 p-3 dark:border-cyan-500/30 dark:bg-slate-950/40">
                <p className="mb-2 text-xs font-semibold text-slate-500">Live result preview</p>
                {outputUrl ? <img src={outputUrl} alt="Processed image preview" className="max-h-80 w-full rounded-lg object-contain" /> : <div className="flex min-h-32 items-center justify-center text-xs text-slate-400">Your preview will appear here.</div>}
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="flex items-start gap-2 text-[11px] leading-5 text-slate-500"><ImagePlus className="mt-0.5 h-4 w-4 shrink-0" /> For privacy, image processing happens on this device. Output quality and supported formats depend on your browser. PNG keeps transparency unless you choose JPG or a background fill.</p>
    </div>
  );
};
