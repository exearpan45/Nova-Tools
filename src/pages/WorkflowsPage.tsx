import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Play, Plus, Trash2, Clock, Check, ChevronRight,
  Upload, Download, AlertCircle, RefreshCw, Copy, FileText, FileImage
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { useToast } from '../context/ToastContext';
import { WorkflowDefinition, ToolSuite } from '../types';
import { SUITES_DATA } from '../data/suitesData';
import { TOOLS_DATA } from '../data/toolsData';
import { copyToClipboard } from '../utils/clipboard';
import { trackWorkflowExecuted } from '../utils/analytics';

export const WorkflowsPage: React.FC = () => {
  const { workflows, addWorkflow, deleteWorkflow, pushNotification, triggerSound } = useNova();
  const { showToast } = useToast();
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowDefinition | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [workflowInputFile, setWorkflowInputFile] = useState<File | null>(null);
  const [workflowPdfFiles, setWorkflowPdfFiles] = useState<File[]>([]);
  const [workflowInputText, setWorkflowInputText] = useState<string>('');
  const [executingStep, setExecutingStep] = useState<number>(-1);
  const [stepLogs, setStepLogs] = useState<Array<{ stepIndex: number; status: 'pending' | 'running' | 'done' | 'error'; message: string }>>([]);
  const [pipelineResult, setPipelineResult] = useState<{
    blobUrl?: string;
    textResult?: string;
    filename: string;
    originalSize?: number;
    finalSize?: number;
  } | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newSuite, setNewSuite] = useState<ToolSuite>('image');
  const [selectedToolSlugs, setSelectedToolSlugs] = useState<string[]>([]);

  const handleStartWorkflow = (wf: WorkflowDefinition) => {
    setActiveWorkflow(wf);
    setWorkflowInputFile(null);
    setWorkflowPdfFiles([]);
    setWorkflowInputText(
      wf.category === 'developer'
        ? '{\n  "name": "NOVA TOOLS",\n  "status": "ready",\n  "features": ["local", "fast", "secure"]\n}'
        : wf.category === 'data'
        ? 'id,name,role\n1,Alice,Engineer\n2,Bob,Designer\n1,Alice,Engineer\n'
        : ''
    );
    setExecutingStep(-1);
    setStepLogs([]);
    setPipelineResult(null);
    setPipelineError(null);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWorkflowInputFile(file);
    setPipelineError(null);
  };

  const handlePdfFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const invalid = files.find((file) => file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'));
    if (invalid) {
      setPipelineError('Please select PDF files only.');
      e.target.value = '';
      return;
    }
    setWorkflowPdfFiles(files);
    setPipelineError(null);
  };

  useEffect(() => () => {
    if (pipelineResult?.blobUrl) URL.revokeObjectURL(pipelineResult.blobUrl);
  }, [pipelineResult?.blobUrl]);

  const executePipeline = async () => {
    if (!activeWorkflow) return;
    setPipelineError(null);
    setPipelineResult(null);

    const builtInWorkflowIds = new Set(['wf-web-image-optimizer', 'wf-pdf-bundle', 'wf-developer-cleaner', 'wf-data-pipeline']);
    const effectiveCategory = activeWorkflow.category;

    if (!builtInWorkflowIds.has(activeWorkflow.id) && !['image', 'pdf', 'developer', 'data'].includes(effectiveCategory)) {
      setPipelineError('Automatic memory execution is supported for Image, PDF, Developer JSON, and Data CSV flows.');
      return;
    }

    const logs: Array<{ stepIndex: number; status: 'pending' | 'running' | 'done' | 'error'; message: string }> = activeWorkflow.steps.map((_, i) => ({
      stepIndex: i,
      status: 'pending',
      message: 'Waiting...',
    }));
    setStepLogs(logs);

    let currentStepIdx = 0;

    try {
      if (effectiveCategory === 'image') {
        if (!workflowInputFile) throw new Error('Please select an image file to begin this pipeline.');
        if (!workflowInputFile.type.startsWith('image/')) {
          throw new Error(`Incompatible format: Received ${workflowInputFile.type || 'unknown'}, expected PNG/JPG/WebP.`);
        }

        const originalSize = workflowInputFile.size;
        currentStepIdx = 0;
        setExecutingStep(0);
        logs[0] = { stepIndex: 0, status: 'running', message: 'Scaling dimensions to max 1280px...' };
        setStepLogs([...logs]);

        const img = new Image();
        const objectUrl = URL.createObjectURL(workflowInputFile);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('Failed to decode image data.'));
          img.src = objectUrl;
        });

        const maxDim = 1280;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not initialize 2D canvas context.');
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(objectUrl);

        logs[0] = { stepIndex: 0, status: 'done', message: `Scaled to ${w} × ${h}px` };
        setStepLogs([...logs]);

        currentStepIdx = Math.min(1, logs.length - 1);
        setExecutingStep(currentStepIdx);
        logs[currentStepIdx] = { stepIndex: currentStepIdx, status: 'running', message: 'Compressing & encoding WebP...' };
        setStepLogs([...logs]);

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (result) => (result ? resolve(result) : reject(new Error('WebP encoding unavailable in this browser.'))),
            'image/webp',
            0.8
          );
        });

        const finalUrl = URL.createObjectURL(blob);
        logs[currentStepIdx] = { stepIndex: currentStepIdx, status: 'done', message: `Exported WebP (${Math.round(blob.size / 1024)} KB)` };
        setStepLogs([...logs]);
        setExecutingStep(-1);

        setPipelineResult({
          blobUrl: finalUrl,
          filename: `optimized-${workflowInputFile.name.replace(/\.[^/.]+$/, '')}.webp`,
          originalSize,
          finalSize: blob.size,
        });
        trackWorkflowExecuted(activeWorkflow.id, 'success');
        triggerSound('success');
        pushNotification('Flow Completed', `${activeWorkflow.title} succeeded.`, 'success');
        return;
      }

      if (effectiveCategory === 'pdf') {
        if (workflowPdfFiles.length < 2) throw new Error('Please select at least two PDF files to merge.');
        const totalInputSize = workflowPdfFiles.reduce((sum, file) => sum + file.size, 0);
        setExecutingStep(0);
        logs[0] = { stepIndex: 0, status: 'running', message: `Merging ${workflowPdfFiles.length} PDF documents...` };
        setStepLogs([...logs]);

        const merged = await PDFDocument.create();
        for (const file of workflowPdfFiles) {
          const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
          const pages = await merged.copyPages(sourcePdf, sourcePdf.getPageIndices());
          pages.forEach((page) => merged.addPage(page));
        }
        const bytes = await merged.save();
        const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        logs[0] = { stepIndex: 0, status: 'done', message: `Merged ${workflowPdfFiles.length} PDFs (${merged.getPageCount()} pages)` };
        setStepLogs([...logs]);
        setExecutingStep(-1);
        setPipelineResult({
          blobUrl,
          filename: 'merged-documents.pdf',
          originalSize: totalInputSize,
          finalSize: blob.size,
        });
        trackWorkflowExecuted(activeWorkflow.id, 'success');
        triggerSound('success');
        pushNotification('PDF Flow Complete', `Merged ${merged.getPageCount()} pages locally.`, 'success');
        return;
      }

      if (effectiveCategory === 'developer') {
        const raw = workflowInputText.trim();
        if (!raw) throw new Error('Please input JSON text to execute this pipeline.');

        setExecutingStep(0);
        logs[0] = { stepIndex: 0, status: 'running', message: 'Validating JSON syntax...' };
        setStepLogs([...logs]);

        const parsed = JSON.parse(raw);
        logs[0] = { stepIndex: 0, status: 'done', message: 'JSON syntax valid' };
        setStepLogs([...logs]);

        if (logs[1]) {
          currentStepIdx = 1;
          setExecutingStep(1);
          logs[1] = { stepIndex: 1, status: 'done', message: `Formatted ${Object.keys(parsed).length} top-level keys` };
          setStepLogs([...logs]);
        }

        const minified = JSON.stringify(parsed);
        if (logs[2]) {
          currentStepIdx = 2;
          setExecutingStep(2);
          logs[2] = { stepIndex: 2, status: 'done', message: `Minified: ${raw.length} → ${minified.length} chars` };
          setStepLogs([...logs]);
        }

        setExecutingStep(-1);
        setPipelineResult({
          textResult: minified,
          filename: 'payload.min.json',
          originalSize: raw.length,
          finalSize: minified.length,
        });
        trackWorkflowExecuted(activeWorkflow.id, 'success');
        triggerSound('success');
        return;
      }

      if (effectiveCategory === 'data') {
        const raw = workflowInputText.trim();
        if (!raw) throw new Error('Please enter CSV rows to execute this pipeline.');

        setExecutingStep(0);
        const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row.');

        const uniqueLines = Array.from(new Set(lines));
        logs[0] = { stepIndex: 0, status: 'done', message: `Cleaned: ${lines.length} → ${uniqueLines.length} unique rows` };
        setStepLogs([...logs]);

        const headers = uniqueLines[0].split(',').map((h) => h.trim());
        const records = uniqueLines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim());
          const obj: Record<string, any> = {};
          headers.forEach((h, idx) => {
            const val = values[idx] ?? '';
            if (val !== '' && !isNaN(Number(val))) obj[h] = Number(val);
            else if (val.toLowerCase() === 'true') obj[h] = true;
            else if (val.toLowerCase() === 'false') obj[h] = false;
            else obj[h] = val;
          });
          return obj;
        });

        const jsonOut = JSON.stringify(records, null, 2);
        if (logs[1]) {
          logs[1] = { stepIndex: 1, status: 'done', message: `Generated ${records.length} JSON objects` };
          setStepLogs([...logs]);
        }
        setExecutingStep(-1);
        setPipelineResult({
          textResult: jsonOut,
          filename: 'dataset.json',
          originalSize: raw.length,
          finalSize: jsonOut.length,
        });
        trackWorkflowExecuted(activeWorkflow.id, 'success');
        triggerSound('success');
        return;
      }
    } catch (err: any) {
      setExecutingStep(-1);
      setPipelineError(err.message || 'An error occurred during pipeline execution.');
      trackWorkflowExecuted(activeWorkflow.id, 'error');
      logs[currentStepIdx] = {
        stepIndex: currentStepIdx,
        status: 'error',
        message: err.message || 'Step failed',
      };
      setStepLogs([...logs]);
    }
  };

  const exportWorkflowJson = (wf: WorkflowDefinition) => {
    const blob = new Blob([JSON.stringify(wf, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wf.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.flow.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Workflow exported as schema-validated JSON.', 'success');
  };

  const handleImportWorkflowJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((txt) => {
      try {
        const parsed = JSON.parse(txt);
        if (
          !parsed ||
          typeof parsed.title !== 'string' ||
          typeof parsed.category !== 'string' ||
          !Array.isArray(parsed.steps) ||
          parsed.steps.length === 0
        ) {
          showToast('Invalid workflow JSON schema.', 'error');
          return;
        }
        const sanitizedWf: WorkflowDefinition = {
          id: `wf-import-${Date.now()}`,
          title: parsed.title.slice(0, 80),
          description: typeof parsed.description === 'string' ? parsed.description.slice(0, 200) : 'Imported pipeline',
          category: (SUITES_DATA[parsed.category as ToolSuite] ? parsed.category : 'developer') as ToolSuite,
          icon: 'GitFork',
          estimatedTime: typeof parsed.estimatedTime === 'string' ? parsed.estimatedTime.slice(0, 24) : '< 30 sec',
          steps: parsed.steps
            .filter((s: any) => s && typeof s.toolSlug === 'string' && typeof s.name === 'string')
            .slice(0, 8)
            .map((s: any) => ({
              toolSlug: s.toolSlug,
              name: s.name,
              description: typeof s.description === 'string' ? s.description : '',
              inputHint: typeof s.inputHint === 'string' ? s.inputHint : 'Input',
              outputHint: typeof s.outputHint === 'string' ? s.outputHint : 'Output',
            })),
        };
        if (sanitizedWf.steps.length === 0) {
          showToast('Imported workflow contained no valid steps.', 'error');
          return;
        }
        addWorkflow(sanitizedWf);
        showToast(`Imported workflow "${sanitizedWf.title}".`, 'success');
      } catch {
        showToast('Failed to parse workflow JSON.', 'error');
      }
    });
    e.target.value = '';
  };

  const duplicateWorkflow = (wf: WorkflowDefinition) => {
    addWorkflow({
      ...wf,
      id: `wf-copy-${Date.now()}`,
      title: `${wf.title} (Copy)`,
    });
    showToast(`Duplicated "${wf.title}".`, 'success');
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || selectedToolSlugs.length === 0) return;

    const steps = selectedToolSlugs.map((slug) => {
      const tool = TOOLS_DATA.find((t) => t.slug === slug);
      return {
        toolSlug: slug,
        name: tool?.name || slug,
        description: tool?.description || '',
        inputHint: 'Pipeline payload',
        outputHint: 'Transformed data stream',
      };
    });

    addWorkflow({
      id: `wf-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Custom automated tool sequence.',
      category: newSuite,
      icon: 'GitFork',
      estimatedTime: '< 30 sec',
      steps,
    });

    setIsCreating(false);
    setNewTitle('');
    setNewDesc('');
    setSelectedToolSlugs([]);
    showToast('Custom workflow saved.', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">NOVA Flow</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Multi-Tool Workflow Pipelines
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chain operations, duplicate or import validated JSON flows, and execute pipelines directly in browser RAM.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <label className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer inline-flex items-center gap-1.5 hover:border-cyan-500">
            <Upload className="w-3.5 h-3.5" /> Import .JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImportWorkflowJson} />
          </label>
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> {isCreating ? 'Cancel' : 'New Workflow'}
          </button>
        </div>
      </div>

      {/* Active Pipeline Execution Workbench */}
      {activeWorkflow && (
        <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/40 bg-white dark:bg-slate-900/70 shadow-xl space-y-6 animate-tool-enter">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Active Execution Pipeline ({activeWorkflow.steps.length} Steps)
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">{activeWorkflow.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeWorkflow.description}</p>
            </div>
            <button type="button" onClick={() => setActiveWorkflow(null)} className="text-xs font-semibold text-rose-500 hover:underline shrink-0">
              Close Workbench
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeWorkflow.steps.map((st, i) => {
              const log = stepLogs.find((l) => l.stepIndex === i);
              const isRunning = executingStep === i;
              const isDone = log?.status === 'done';
              const isError = log?.status === 'error';

              return (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isError
                      ? 'border-rose-500 bg-rose-500/10'
                      : isRunning
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : isDone
                      ? 'border-emerald-500/60 bg-emerald-500/5'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step {i + 1}</span>
                    {isDone && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    {isRunning && <RefreshCw className="w-3.5 h-3.5 text-cyan-500 animate-spin" />}
                    {isError && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{st.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{st.description}</p>
                  {log && <div className="mt-2 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 truncate">{log.message}</div>}
                </div>
              );
            })}
          </div>

          {/* Pipeline Input */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
            {activeWorkflow.category === 'image' ? (
              <div onClick={() => fileInputRef.current?.click()} className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 rounded-xl cursor-pointer text-center">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelected} className="hidden" />
                <FileImage className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {workflowInputFile ? workflowInputFile.name : 'Choose an image file to process'}
                </p>
              </div>
            ) : activeWorkflow.category === 'pdf' ? (
              <div onClick={() => fileInputRef.current?.click()} className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 rounded-xl cursor-pointer text-center">
                <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" multiple onChange={handlePdfFilesSelected} className="hidden" />
                <FileText className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {workflowPdfFiles.length ? `${workflowPdfFiles.length} PDF files selected` : 'Choose at least two PDF files to merge'}
                </p>
              </div>
            ) : (
              <textarea
                value={workflowInputText}
                onChange={(e) => setWorkflowInputText(e.target.value)}
                rows={5}
                placeholder="Paste JSON or CSV payload here..."
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-800"
              />
            )}

            {pipelineError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between gap-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{pipelineError}</span>
                </div>
                <button type="button" onClick={executePipeline} className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold shrink-0">
                  Retry Step
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Runs sequentially in client memory.</span>
              <button
                type="button"
                onClick={executePipeline}
                disabled={executingStep >= 0}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{executingStep >= 0 ? 'Executing...' : 'Run Pipeline'}</span>
              </button>
            </div>
          </div>

          {pipelineResult && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Pipeline Finished Successfully
                </span>
                {pipelineResult.originalSize && pipelineResult.finalSize && (
                  <span className="text-xs font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(pipelineResult.originalSize / 1024)} KB → {Math.round(pipelineResult.finalSize / 1024)} KB
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {pipelineResult.blobUrl && (
                  <a href={pipelineResult.blobUrl} download={pipelineResult.filename} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                    <Download className="w-3.5 h-3.5" /> Download {pipelineResult.filename}
                  </a>
                )}
                {pipelineResult.textResult && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(pipelineResult.textResult!);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1800);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Output'}</span>
                    </button>
                    <a
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(pipelineResult.textResult)}`}
                      download={pipelineResult.filename}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Download {pipelineResult.filename}
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Builder */}
      {isCreating && (
        <form onSubmit={handleCreateWorkflow} className="p-5 sm:p-6 rounded-2xl border border-cyan-500/30 bg-white dark:bg-slate-900 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Build a New Multi-Tool Flow</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-400 block mb-1">Workflow Title</label>
              <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Web Image Optimizer" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800" />
            </div>
            <div>
              <label className="font-bold text-slate-400 block mb-1">Suite Engine</label>
              <select value={newSuite} onChange={(e) => setNewSuite(e.target.value as ToolSuite)} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {Object.values(SUITES_DATA).map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
            {TOOLS_DATA.filter((t) => t.suite === newSuite).map((tool) => {
              const isSelected = selectedToolSlugs.includes(tool.slug);
              return (
                <button
                  type="button"
                  key={tool.slug}
                  onClick={() => setSelectedToolSlugs(isSelected ? selectedToolSlugs.filter((s) => s !== tool.slug) : [...selectedToolSlugs, tool.slug])}
                  className={`p-2 rounded-lg text-xs font-semibold text-left truncate ${
                    isSelected ? 'bg-cyan-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tool.name}
                </button>
              );
            })}
          </div>

          <button type="submit" disabled={selectedToolSlugs.length === 0} className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs">
            Save Workflow ({selectedToolSlugs.length} steps)
          </button>
        </form>
      )}

      {/* Workflow Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {workflows.map((wf) => {
          const suite = SUITES_DATA[wf.category];
          return (
            <div key={wf.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: suite.accentColor }}>
                    {suite.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {wf.estimatedTime}
                    </span>
                    <button type="button" onClick={() => duplicateWorkflow(wf)} className="p-1 text-slate-400 hover:text-cyan-500" title="Duplicate workflow">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => exportWorkflowJson(wf)} className="p-1 text-slate-400 hover:text-violet-500" title="Export JSON">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {!DEFAULT_WORKFLOWS_IDS.includes(wf.id) && (
                      <button type="button" onClick={() => deleteWorkflow(wf.id)} className="p-1 text-slate-400 hover:text-rose-500" title="Delete workflow">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{wf.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{wf.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {wf.steps.map((st, i) => (
                    <React.Fragment key={i}>
                      <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {st.name}
                      </span>
                      {i < wf.steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Runs locally in browser</span>
                <button
                  type="button"
                  onClick={() => handleStartWorkflow(wf)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" /> Launch Pipeline
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DEFAULT_WORKFLOWS_IDS = [
  'wf-web-image-optimizer',
  'wf-pdf-bundle',
  'wf-developer-cleaner',
  'wf-data-pipeline',
];
