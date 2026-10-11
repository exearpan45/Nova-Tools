import React, { useState, useRef } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
import {
  Upload, Download, FileText, Plus, Trash2, RotateCw, Check,
  Scissors, FileArchive, HardDrive, Fingerprint, FileSearch, RefreshCw
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface PdfProps {
  toolSlug: string;
}

export const PdfTools: React.FC<PdfProps> = ({ toolSlug }) => {
  // Common states
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>('output.pdf');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Split & Extract states
  const [pageRange, setPageRange] = useState<string>('1');
  const [totalPages, setTotalPages] = useState<number>(1);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [targetSizeValue, setTargetSizeValue] = useState<number>(1);
  const [targetSizeUnit, setTargetSizeUnit] = useState<'KB' | 'MB'>('MB');
  const [rasterizeForCompression, setRasterizeForCompression] = useState<boolean>(false);

  // Metadata states
  const [pdfMeta, setPdfMeta] = useState<{ title?: string; author?: string; subject?: string; creator?: string }>({});

  // File hash & size states
  const [fileHashes, setFileHashes] = useState<{ sha256: string; sha1: string; sha384: string } | null>(null);
  const [fileDetails, setFileDetails] = useState<{ size: number; name: string; type: string; lastModified: string } | null>(null);

  // File renamer
  const [renamePrefix, setRenamePrefix] = useState<string>('nova_');
  const [renameSuffix, setRenameSuffix] = useState<string>('');
  const [renameCase, setRenameCase] = useState<'none' | 'lower' | 'upper'>('none');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    setErrorMsg(null);
    setResultUrl(null);
    setFiles(selected);

    const first = selected[0];
    setFileDetails({
      size: first.size,
      name: first.name,
      type: first.type || 'application/octet-stream',
      lastModified: new Date(first.lastModified).toLocaleString(),
    });

    if (toolSlug === 'file-hash-checker') {
      calculateHashes(first);
    }

    if (first.type === 'application/pdf' || first.name.endsWith('.pdf')) {
      try {
        const buffer = await first.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        setTotalPages(doc.getPageCount());
        setPdfMeta({
          title: doc.getTitle() || '',
          author: doc.getAuthor() || '',
          subject: doc.getSubject() || '',
          creator: doc.getCreator() || '',
        });
      } catch (err: any) {
        console.warn('Could not parse PDF metadata:', err);
      }
    }
  };

  const calculateHashes = async (file: File) => {
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const sha256Buffer = await crypto.subtle.digest('SHA-256', buffer);
      const sha1Buffer = await crypto.subtle.digest('SHA-1', buffer);
      const sha384Buffer = await crypto.subtle.digest('SHA-384', buffer);

      const toHex = (buf: ArrayBuffer) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

      setFileHashes({
        sha256: toHex(sha256Buffer),
        sha1: toHex(sha1Buffer),
        sha384: toHex(sha384Buffer),
      });
    } catch (err: any) {
      setErrorMsg('Failed to compute cryptographic hashes.');
    } finally {
      setIsProcessing(false);
    }
  };

  const createRasterizedPdf = async (file: File, targetBytes: number) => {
    const sourceBytes = new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjsLib.getDocument({ data: sourceBytes });
    const sourcePdf = await loadingTask.promise;
    if (sourcePdf.numPages > 80) {
      await sourcePdf.destroy();
      throw new Error('For browser memory safety, rasterized target-size compression currently supports up to 80 pages per PDF. Use preserve-text mode for larger files.');
    }

    const attempts = [
      { scale: 1, quality: 0.82 },
      { scale: 0.85, quality: 0.72 },
      { scale: 0.7, quality: 0.62 },
      { scale: 0.55, quality: 0.52 },
      { scale: 0.4, quality: 0.42 },
      { scale: 0.3, quality: 0.32 },
    ];
    let bestBytes: Uint8Array | null = null;

    try {
      for (const attempt of attempts) {
        const outputPdf = await PDFDocument.create();
        for (let pageNumber = 1; pageNumber <= sourcePdf.numPages; pageNumber += 1) {
          const sourcePage = await sourcePdf.getPage(pageNumber);
          const viewport = sourcePage.getViewport({ scale: attempt.scale });
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.ceil(viewport.width));
          canvas.height = Math.max(1, Math.ceil(viewport.height));
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Your browser could not create a canvas for PDF compression.');
          await sourcePage.render({ canvasContext: context, viewport }).promise;
          const jpegBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not encode a PDF page image.')), 'image/jpeg', attempt.quality);
          });
          const jpegBytes = await jpegBlob.arrayBuffer();
          const embedded = await outputPdf.embedJpg(jpegBytes);
          const page = outputPdf.addPage([viewport.width / attempt.scale, viewport.height / attempt.scale]);
          page.drawImage(embedded, { x: 0, y: 0, width: viewport.width / attempt.scale, height: viewport.height / attempt.scale });
          canvas.width = 0;
          canvas.height = 0;
          sourcePage.cleanup();
        }

        const bytes = await outputPdf.save({ useObjectStreams: true });
        if (!bestBytes || bytes.byteLength < bestBytes.byteLength) bestBytes = bytes;
        if (bytes.byteLength <= targetBytes) {
          bestBytes = bytes;
          break;
        }
      }
    } finally {
      await sourcePdf.destroy();
    }

    if (!bestBytes) throw new Error('Could not compress this PDF. Please try another file.');
    return { bytes: bestBytes, targetReached: bestBytes.byteLength <= targetBytes };
  };

  const executePdfOperation = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      if (toolSlug === 'pdf-merger') {
        const mergedDoc = await PDFDocument.create();
        for (const file of files) {
          const buffer = await file.arrayBuffer();
          const doc = await PDFDocument.load(buffer);
          const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
          copiedPages.forEach((page) => mergedDoc.addPage(page));
        }
        const pdfBytes = await mergedDoc.save();
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName('merged-document.pdf');
        setStatusMessage(`Successfully combined ${files.length} PDF files.`);
      } else if (toolSlug === 'jpg-to-pdf') {
        const pdfDoc = await PDFDocument.create();
        for (const file of files) {
          const buffer = await file.arrayBuffer();
          let img;
          if (file.type === 'image/png' || file.name.endsWith('.png')) {
            img = await pdfDoc.embedPng(buffer);
          } else {
            img = await pdfDoc.embedJpg(buffer);
          }
          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const bytes = await pdfDoc.save();
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName('converted-images.pdf');
        setStatusMessage(`Converted ${files.length} images into a clean PDF.`);
      } else if (toolSlug === 'pdf-page-rotator') {
        const buffer = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        const pages = doc.getPages();
        pages.forEach((p) => {
          const currentRotation = p.getRotation().angle;
          p.setRotation(degrees((currentRotation + rotationAngle) % 360));
        });
        const bytes = await doc.save();
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName('rotated-document.pdf');
        setStatusMessage(`Rotated all ${pages.length} pages by ${rotationAngle}°.`);
      } else if (toolSlug === 'pdf-splitter' || toolSlug === 'pdf-page-extractor') {
        const buffer = await files[0].arrayBuffer();
        const sourceDoc = await PDFDocument.load(buffer);
        const targetDoc = await PDFDocument.create();

        // Parse 1-based page ranges like "1, 3, 5-7"
        const requestedIndices = new Set<number>();
        const parts = pageRange.split(',').map((s) => s.trim());
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) {
                if (i >= 1 && i <= sourceDoc.getPageCount()) requestedIndices.add(i - 1);
              }
            }
          } else {
            const num = Number(part);
            if (!isNaN(num) && num >= 1 && num <= sourceDoc.getPageCount()) {
              requestedIndices.add(num - 1);
            }
          }
        }

        const indicesArray = Array.from(requestedIndices).sort((a, b) => a - b);
        if (indicesArray.length === 0) {
          throw new Error('Please specify valid page numbers within the document range.');
        }

        const pages = await targetDoc.copyPages(sourceDoc, indicesArray);
        pages.forEach((p) => targetDoc.addPage(p));

        const bytes = await targetDoc.save();
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResultUrl(URL.createObjectURL(blob));
        setResultFileName('extracted-pages.pdf');
        setStatusMessage(`Extracted ${pages.length} pages successfully.`);
      } else if (toolSlug === 'pdf-compressor') {
        const targetBytes = Math.max(1, targetSizeValue) * (targetSizeUnit === 'MB' ? 1024 * 1024 : 1024);
        let bytes: Uint8Array;
        let targetReached: boolean;
        if (rasterizeForCompression) {
          const compressed = await createRasterizedPdf(files[0], targetBytes);
          bytes = compressed.bytes;
          targetReached = compressed.targetReached;
        } else {
          const buffer = await files[0].arrayBuffer();
          const doc = await PDFDocument.load(buffer);
          // Preserve selectable text and vector content in the default safe mode.
          bytes = await doc.save({ useObjectStreams: true });
          targetReached = bytes.byteLength <= targetBytes;
        }
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResultUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return URL.createObjectURL(blob);
        });
        setResultFileName('compressed-document.pdf');
        const reduction = files[0].size > 0 ? Math.round((1 - blob.size / files[0].size) * 100) : 0;
        setStatusMessage(targetReached
          ? `Target reached: ${formatBytes(blob.size)} (target ${targetSizeValue} ${targetSizeUnit}). Size change: ${reduction}%. ${rasterizeForCompression ? 'Pages were rasterized, so text is no longer selectable.' : 'Text and vector content were preserved.'}`
          : `Best result: ${formatBytes(blob.size)}; target was ${targetSizeValue} ${targetSizeUnit}. ${rasterizeForCompression ? 'Even the lowest tested page quality did not reach the target.' : 'Try enabling rasterized compression to shrink image-heavy PDFs; this turns each page into an image and removes selectable text.'} Size change: ${reduction}%.`);
      } else if (toolSlug === 'pdf-page-deleter') {
        const buffer = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        const pageToDelete = Number(pageRange) - 1;
        if (pageToDelete >= 0 && pageToDelete < doc.getPageCount()) {
          doc.removePage(pageToDelete);
          const bytes = await doc.save();
          const blob = new Blob([bytes as any], { type: 'application/pdf' });
          setResultUrl(URL.createObjectURL(blob));
          setResultFileName('page-removed.pdf');
          setStatusMessage(`Removed page ${pageToDelete + 1}.`);
        } else {
          throw new Error('Invalid page number to delete.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing document. Ensure file is not password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {files.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center p-10 md:p-14 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-rose-500 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 cursor-pointer transition-all duration-200"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={toolSlug === 'pdf-merger' || toolSlug === 'jpg-to-pdf'}
            accept={
              toolSlug.includes('jpg-to-pdf')
                ? 'image/jpeg,image/png,image/webp'
                : toolSlug.includes('file-')
                ? '*/*'
                : 'application/pdf'
            }
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 dark:bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            {toolSlug === 'pdf-merger'
              ? 'Select multiple PDF documents to merge'
              : toolSlug === 'jpg-to-pdf'
              ? 'Select JPG/PNG images to convert to PDF'
              : 'Choose a file to process'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-sm">
            Zero upload delay. Everything processes locally in your browser memory.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Roster */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Loaded Files ({files.length})
              </span>
              <button
                onClick={() => {
                  setFiles([]);
                  setResultUrl(null);
                  setFileHashes(null);
                  setFileDetails(null);
                }}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-medium text-slate-900 dark:text-white truncate">{f.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono shrink-0 ml-2">{formatBytes(f.size)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operation Controls */}
          {toolSlug === 'pdf-compressor' && (
            <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Target PDF size</label>
              <div className="flex flex-wrap items-center gap-2">
                <input aria-label="Target PDF size" type="number" min="1" max={targetSizeUnit === 'MB' ? 500 : 512000} value={targetSizeValue} onChange={(e) => setTargetSizeValue(Math.max(1, Number(e.target.value) || 1))} className="w-28 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                <select aria-label="Target PDF size unit" value={targetSizeUnit} onChange={(e) => setTargetSizeUnit(e.target.value as 'KB' | 'MB')} className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <option value="KB">KB</option><option value="MB">MB</option>
                </select>
              </div>
              <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                <input type="checkbox" checked={rasterizeForCompression} onChange={(e) => setRasterizeForCompression(e.target.checked)} className="mt-0.5 rounded accent-rose-500" />
                <span><strong>Rasterize pages for stronger compression</strong><br /><span className="text-slate-500 dark:text-slate-400">Can reduce scanned/photo PDFs much more. It converts each page into an image, so text will no longer be selectable/searchable. Up to 80 pages per file.</span></span>
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">Preserve-text mode is safer but may not hit the target. Rasterized mode tries multiple image quality/resolution levels and reports the actual output size.</p>
            </div>
          )}
          {(toolSlug === 'pdf-splitter' || toolSlug === 'pdf-page-extractor') && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Pages to Extract (Total: {totalPages} pages)
                </label>
                <span className="text-xs text-slate-500">Example: 1, 3, 5-8</span>
              </div>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="1, 2, 4-6"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {toolSlug === 'pdf-page-deleter' && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Page Number to Remove (1 to {totalPages})
              </label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="w-32 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {toolSlug === 'pdf-page-rotator' && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Rotation Angle
              </span>
              <div className="flex gap-2">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotationAngle(deg)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      rotationAngle === deg
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" /> {deg}° Clockwise
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button for PDF Operations */}
          {toolSlug.startsWith('pdf-') || toolSlug === 'jpg-to-pdf' ? (
            <div className="flex flex-wrap items-center gap-4">
              <button
                disabled={isProcessing}
                onClick={executePdfOperation}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Processing in Browser...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" /> Run Operation
                  </>
                )}
              </button>

              {resultUrl && (
                <a
                  href={resultUrl}
                  download={resultFileName}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Result PDF
                </a>
              )}
            </div>
          ) : null}

          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4" /> {statusMessage}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Special view for File Hash Checker */}
          {toolSlug === 'file-hash-checker' && fileHashes && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Cryptographic Hashes
              </span>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block font-sans text-[11px] mb-1">SHA-256 (Standard)</span>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-800 dark:text-slate-200 break-all">
                    <span>{fileHashes.sha256}</span>
                    <button
                      onClick={() => copyToClipboard(fileHashes.sha256)}
                      className="ml-2 text-rose-500 hover:underline shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[11px] mb-1">SHA-1 (Legacy)</span>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-800 dark:text-slate-200 break-all">
                    <span>{fileHashes.sha1}</span>
                    <button
                      onClick={() => copyToClipboard(fileHashes.sha1)}
                      className="ml-2 text-rose-500 hover:underline shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* File Size & Type Inspector View */}
          {(toolSlug === 'file-size-checker' || toolSlug === 'file-type-detector') && fileDetails && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                File Breakdown
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">Raw Bytes</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {fileDetails.size.toLocaleString()} bytes
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">Human Readable</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    {formatBytes(fileDetails.size)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">MIME Type</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white truncate block">
                    {fileDetails.type}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">Last Modified</span>
                  <span className="font-mono text-slate-900 dark:text-white truncate block">
                    {fileDetails.lastModified}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
