import React, { useState, useEffect } from 'react';
import { Upload, X, ArrowRight, Image, FileText, Code2, Sparkles } from 'lucide-react';
import { useNova } from '../context/NovaContext';

export const SmartDropZone: React.FC = () => {
  const { navigate, smartDropFile, setSmartDropFile } = useNova();
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.relatedTarget === null) {
        setIsDragActive(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        setSmartDropFile(file);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [setSmartDropFile]);

  // Determine suggested tools based on file extension & MIME type
  const suggestions = React.useMemo(() => {
    if (!smartDropFile) return [];
    const name = smartDropFile.name.toLowerCase();
    const type = smartDropFile.type;

    if (type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg|avif)$/.test(name)) {
      const supportsImageToPdf = type === 'image/jpeg' || type === 'image/png' || /\.(jpe?g|png)$/.test(name);
      return [
        { name: 'Compress Image', slug: 'image-compressor', desc: 'Reduce file size with an adjustable quality setting' },
        { name: 'Resize Image', slug: 'image-resizer', desc: 'Change pixel dimensions or scale' },
        ...(supportsImageToPdf ? [{ name: 'Convert Images to PDF', slug: 'jpg-to-pdf', desc: 'Place supported JPG and PNG images in a PDF' }] : []),
        { name: 'Check File Size', slug: 'file-size-checker', desc: 'Inspect exact bytes and file metadata' },
        { name: 'Calculate File Hash', slug: 'file-hash-checker', desc: 'Create a checksum to compare file integrity' },
      ];
    }

    if (type === 'application/pdf' || name.endsWith('.pdf')) {
      return [
        { name: 'Merge PDFs', slug: 'pdf-merger', desc: 'Combine multiple PDF documents' },
        { name: 'Split PDF', slug: 'pdf-splitter', desc: 'Split a document into smaller files' },
        { name: 'Extract Pages', slug: 'pdf-page-extractor', desc: 'Save selected pages by page number or range' },
        { name: 'Rotate Pages', slug: 'pdf-page-rotator', desc: 'Rotate PDF pages by a selected angle' },
        { name: 'Delete a Page', slug: 'pdf-page-deleter', desc: 'Remove a page and save the remaining document' },
      ];
    }

    if (name.endsWith('.json') || type === 'application/json') {
      return [
        { name: 'Format & Beautify JSON', slug: 'json-formatter', desc: 'Pretty print with indentation' },
        { name: 'Minify JSON Payload', slug: 'json-minifier', desc: 'Remove whitespace for APIs' },
        { name: 'Convert JSON to CSV', slug: 'json-to-csv', desc: 'Export tabular spreadsheet' },
        { name: 'Validate JSON Syntax', slug: 'json-validator', desc: 'Detect exact error line numbers' },
      ];
    }

    if (name.endsWith('.csv') || type.includes('csv')) {
      return [
        { name: 'View CSV Data', slug: 'csv-viewer', desc: 'Inspect rows and columns in a table' },
        { name: 'Convert CSV to JSON', slug: 'csv-to-json', desc: 'Convert tabular rows into structured JSON' },
        { name: 'Inspect File Size', slug: 'file-size-checker', desc: 'Check the exact file size and metadata' },
      ];
    }

    // Default fallback tools for any file
    return [
      { name: 'File Hash & Checksum', slug: 'file-hash-checker', desc: 'Calculate SHA-256 / SHA-1 checksum' },
      { name: 'File Size & Speed Checker', slug: 'file-size-checker', desc: 'Calculate byte size and transfer speeds' },
      { name: 'Detect True File Type', slug: 'file-type-detector', desc: 'Inspect magic bytes signature' },
    ];
  }, [smartDropFile]);

  const openToolWithFile = (slug: string) => {
    setSmartDropFile(null);
    navigate(`/tools/${slug}`);
  };

  return (
    <>
      {/* Full-screen Drag Overlay */}
      {isDragActive && (
        <div className="fixed inset-0 z-50 bg-cyan-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 border-4 border-dashed border-cyan-400 pointer-events-none animate-pulse">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
            <Upload className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Drop File into NOVA TOOLS</h2>
          <p className="text-sm text-cyan-200">
            Instant client-side detection & tool suggestions
          </p>
        </div>
      )}

      {/* Suggested Actions Modal when file dropped */}
      {smartDropFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-[280px]">
                    {smartDropFile.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {(smartDropFile.size / 1024).toFixed(1)} KB · {smartDropFile.type || 'Custom file'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSmartDropFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Suggested Actions for this File
              </span>
              <div className="space-y-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => openToolWithFile(s.slug)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-cyan-500/5 transition-all text-left group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors block">
                        {s.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{s.desc}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
