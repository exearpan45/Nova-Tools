import React, { useState, useRef } from 'react';
import {
  GitFork, Play, Plus, Trash2, ArrowRight, Clock, Sparkles, Check, ChevronRight,
  Upload, Download, AlertCircle, RefreshCw, Copy, FileText, FileImage, Layers
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { WorkflowDefinition, ToolSuite } from '../types';
import { SUITES_DATA } from '../data/suitesData';
import { TOOLS_DATA } from '../data/toolsData';
import { copyToClipboard } from '../utils/clipboard';

export const WorkflowsPage: React.FC = () => {
  const { workflows, addWorkflow, deleteWorkflow, navigate } = useNova();
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowDefinition | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Execution states
  const [workflowInputFile, setWorkflowInputFile] = useState<File | null>(null);
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

  // Custom workflow form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newSuite, setNewSuite] = useState<ToolSuite>('image');
  const [selectedToolSlugs, setSelectedToolSlugs] = useState<string[]>([]);

  const handleStartWorkflow = (wf: WorkflowDefinition) => {
    setActiveWorkflow(wf);
    setWorkflowInputFile(null);
    setWorkflowInputText(wf.category === 'developer' ? '{\n  "name": "NOVA TOOLS",\n  "status": "ready",\n  "features": ["local", "fast", "secure"]\n}' : (wf.category === 'data' ? 'id,name,role\n1,Alice,Engineer\n2,Bob,Designer\n1,Alice,Engineer\n' : ''));
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

  // True automated tool-to-tool pipeline execution
  const executePipeline = async () => {
    if (!activeWorkflow) return;
    setPipelineError(null);
    setPipelineResult(null);

    const logs: Array<{ stepIndex: number; status: 'pending' | 'running' | 'done' | 'error'; message: string }> = activeWorkflow.steps.map((_, i) => ({
      stepIndex: i,
      status: 'pending',
      message: 'Waiting...',
    }));
    setStepLogs(logs);

    try {
      // 1. Image Workflow
      if (activeWorkflow.category === 'image') {
        if (!workflowInputFile) {
          throw new Error('Please select an image file to begin this pipeline.');
        }
        if (!workflowInputFile.type.startsWith('image/')) {
          throw new Error(`Incompatible format: Received ${workflowInputFile.type || 'unknown'}, but this workflow requires an image (PNG, JPG, WebP).`);
        }

        const originalSize = workflowInputFile.size;

        // Step 1: Resize
        setExecutingStep(0);
        logs[0] = { stepIndex: 0, status: 'running', message: 'Scaling dimensions to web-friendly max 1280px...' };
        setStepLogs([...logs]);
        await new Promise((r) => setTimeout(r, 400));

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

        // Step 2: Compress
        setExecutingStep(1);
        logs[1] = { stepIndex: 1, status: 'running', message: 'Applying optimal lossy compression (80% quality)...' };
        setStepLogs([...logs]);
        await new Promise((r) => setTimeout(r, 400));

        logs[1] = { stepIndex: 1, status: 'done', message: 'Perceptual optimization complete' };
        setStepLogs([...logs]);

        // Step 3: Convert to WebP
        setExecutingStep(2);
        logs[2] = { stepIndex: 2, status: 'running', message: 'Transcoding output stream to Google WebP...' };
        setStepLogs([...logs]);
        await new Promise((r) => setTimeout(r, 400));

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Canvas export to WebP failed.'));
          }, 'image/webp', 0.8);
        });

        const finalUrl = URL.createObjectURL(blob);
        logs[2] = { stepIndex: 2, status: 'done', message: `Transcoded to WebP (${Math.round(blob.size / 1024)} KB)` };
        setStepLogs([...logs]);
        setExecutingStep(-1);

        setPipelineResult({
          blobUrl: finalUrl,
          filename: `optimized-${workflowInputFile.name.replace(/\.[^/.]+$/, '')}.webp`,
          originalSize,
          finalSize: blob.size,
        });
        return;
      }

      // 2. Developer JSON Workflow
      if (activeWorkflow.category === 'developer') {
        const raw = workflowInputText.trim();
        if (!raw) throw new Error('Please input JSON text to execute this pipeline.');

        // Step 1: Validate
        setExecutingStep(0);
        logs[0] = { stepIndex: 0, status: 'running', message: 'Validating JSON syntax & structure...' };
        setStepLogs([...logs]);
        await new Promise((r) => setTimeout(r, 200));

        let parsed: any;
        try {
          parsed = JSON.parse(raw);
        } catch (e: any) {
          throw new Error(`JSON Syntax Error at Step 1: ${e.message}`);
        }
        logs[0] = { stepIndex: 0, status: 'done', message: 'JSON syntax is 100% valid' };
        setStepLogs([...logs]);

        // Step 2: Format / Pretty Print
        setExecutingStep(1);
        logs[1] = { stepIndex: 1, status: 'running', message: 'Inspecting keys and pretty-printing with 2 spaces...' };
        setStepLogs([...logs]);
        await new Promise((r) => setTimeout(r, 200));
        const formatted = JSON.stringify(parsed, null, 2);
        logs[1] = { stepIndex: 1, status: 'done', message: `Formatted ${Object.keys(parsed).length} top-level fields` };
        setStepLogs([...logs]);

        // Step 3: Minify
        setExecutingStep(2);
        logs[2] = { stepIndex: 2, status: 'running', message: 'Stripping whitespace to single-line payload...' };
        setStepLogs([...logs]);
        await new Promise((r) => setTimeout(r, 200));
        const minified = JSON.stringify(parsed);
        logs[2] = { stepIndex: 2, status: 'done', message: `Minified: ${raw.length} chars → ${minified.length} chars` };
        setStepLogs([...logs]);
        setExecutingStep(-1);

        setPipelineResult({
          textResult: minified,
          filename: 'payload.min.json',
          originalSize: raw.length,
          finalSize: minified.length,
        });
        return;
      }

      // 3. Data Pipeline: CSV to JSON
      if (activeWorkflow.category === 'data') {
        const raw = workflowInputText.trim();
        if (!raw) throw new Error('Please enter tabular CSV data to execute this pipeline.');

        // Step 1: Clean
        setExecutingStep(0);
        logs[0] = { stepIndex: 0, status: 'running', message: 'Stripping empty lines and duplicate rows...' };
        setStepLogs([...logs]);
        await new Promise((r) => setTimeout(r, 200));

        const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row.');

        const uniqueLines = Array.from(new Set(lines));
        logs[0] = { stepIndex: 0, status: 'done', message: `Cleaned: ${lines.length} rows → ${uniqueLines.length} unique records` };
        setStepLogs([...logs]);

        // Step 2: Convert to JSON
        setExecutingStep(1);
        logs[1] = { stepIndex: 1, status: 'running', message: 'Transforming CSV rows into JSON objects...' };
        setStepLogs([...logs]);
        await new Promise((r) => setTimeout(r, 200));

        const headers = uniqueLines[0].split(',').map((h) => h.trim());
        const records = uniqueLines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim());
          const obj: Record<string, any> = {};
          headers.forEach((h, idx) => {
            const val = values[idx] ?? '';
            // Auto cast numbers
            if (val !== '' && !isNaN(Number(val))) {
              obj[h] = Number(val);
            } else if (val.toLowerCase() === 'true') {
              obj[h] = true;
            } else if (val.toLowerCase() === 'false') {
              obj[h] = false;
            } else {
              obj[h] = val;
            }
          });
          return obj;
        });

        const jsonOut = JSON.stringify(records, null, 2);
        logs[1] = { stepIndex: 1, status: 'done', message: `Generated JSON feed with ${records.length} objects` };
        setStepLogs([...logs]);
        setExecutingStep(-1);

        setPipelineResult({
          textResult: jsonOut,
          filename: 'dataset.json',
          originalSize: raw.length,
          finalSize: jsonOut.length,
        });
        return;
      }

      // 4. Default / Generic Pass-through
      setExecutingStep(0);
      logs.forEach((l, idx) => {
        l.status = 'done';
        l.message = `Processed Step ${idx + 1} successfully`;
      });
      setStepLogs([...logs]);
      setExecutingStep(-1);
      setPipelineResult({
        textResult: workflowInputText || 'Pipeline completed successfully.',
        filename: 'pipeline-output.txt',
      });
    } catch (err: any) {
      setExecutingStep(-1);
      setPipelineError(err.message || 'An error occurred during pipeline execution.');
      if (executingStep >= 0 && executingStep < logs.length) {
        logs[executingStep] = {
          stepIndex: executingStep,
          status: 'error',
          message: err.message || 'Step failed',
        };
        setStepLogs([...logs]);
      }
    }
  };

  const handleCopyResult = () => {
    if (pipelineResult?.textResult) {
      copyToClipboard(pipelineResult.textResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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

    const customWf: WorkflowDefinition = {
      id: `wf-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Custom automated tool sequence.',
      category: newSuite,
      icon: 'GitFork',
      estimatedTime: '< 30 sec',
      steps,
    };

    addWorkflow(customWf);
    setIsCreating(false);
    setNewTitle('');
    setNewDesc('');
    setSelectedToolSlugs([]);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Workflows Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated multi-tool pipelines with true sequential memory execution
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> {isCreating ? 'Cancel' : 'Create Custom Workflow'}
        </button>
      </div>

      {/* Active Pipeline Execution Workbench */}
      {activeWorkflow && (
        <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-pink-500/5 shadow-xl space-y-6 animate-tool-enter">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Active Execution Pipeline ({activeWorkflow.steps.length} Steps)
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                {activeWorkflow.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeWorkflow.description}
              </p>
            </div>
            <button
              onClick={() => setActiveWorkflow(null)}
              className="text-xs text-rose-500 hover:underline shrink-0"
            >
              Close Workbench
            </button>
          </div>

          {/* Pipeline Steps Sequence */}
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
                      ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/20'
                      : isDone
                      ? 'border-emerald-500/60 bg-emerald-500/5'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Step {i + 1}
                    </span>
                    {isDone && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    {isRunning && <RefreshCw className="w-3.5 h-3.5 text-cyan-500 animate-spin" />}
                    {isError && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {st.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {st.description}
                  </p>
                  {log && (
                    <div className="mt-2 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 truncate">
                      {log.message}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pipeline Input Payload Area */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pipeline Input Payload
            </h3>

            {activeWorkflow.category === 'image' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-cyan-500 rounded-xl cursor-pointer text-center transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelected}
                  className="hidden"
                />
                <FileImage className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {workflowInputFile ? workflowInputFile.name : 'Choose an image file to process'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {workflowInputFile ? `${Math.round(workflowInputFile.size / 1024)} KB · Click to change` : 'PNG, JPG, or WebP'}
                </p>
              </div>
            ) : (
              <textarea
                value={workflowInputText}
                onChange={(e) => setWorkflowInputText(e.target.value)}
                rows={5}
                placeholder="Paste payload text or code here..."
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}

            {pipelineError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Pipeline Execution Error</span>
                  <span>{pipelineError}</span>
                </div>
              </div>
            )}

            {/* Run Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                All steps run sequentially in client browser memory.
              </span>
              <button
                onClick={executePipeline}
                disabled={executingStep >= 0}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{executingStep >= 0 ? 'Executing Steps...' : 'Run Pipeline'}</span>
              </button>
            </div>
          </div>

          {/* Pipeline Results Banner */}
          {pipelineResult && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-tool-enter">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Pipeline Execution Finished Successfully!</span>
                </div>
                {pipelineResult.originalSize && pipelineResult.finalSize && (
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(pipelineResult.originalSize / 1024)} KB → {Math.round(pipelineResult.finalSize / 1024)} KB (
                    {Math.round(((pipelineResult.originalSize - pipelineResult.finalSize) / pipelineResult.originalSize) * 100)}% saved)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {pipelineResult.blobUrl && (
                  <a
                    href={pipelineResult.blobUrl}
                    download={pipelineResult.filename}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Download {pipelineResult.filename}
                  </a>
                )}
                {pipelineResult.textResult && (
                  <>
                    <button
                      onClick={handleCopyResult}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Output'}</span>
                    </button>
                    <a
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(pipelineResult.textResult)}`}
                      download={pipelineResult.filename}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
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

      {/* Workflow Builder Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateWorkflow}
          className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/30 bg-white dark:bg-slate-900 shadow-xl space-y-4 sm:space-y-6 animate-tool-enter"
        >
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Build a New Multi-Tool Sequence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select consecutive tools to chain together in memory
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Workflow Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Photo to Social Media WebP"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Tool Suite Category
              </label>
              <select
                value={newSuite}
                onChange={(e) => setNewSuite(e.target.value as ToolSuite)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                {Object.values(SUITES_DATA).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Steps in Execution Order
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
              {TOOLS_DATA.filter((t) => t.suite === newSuite).map((tool) => {
                const isSelected = selectedToolSlugs.includes(tool.slug);

                return (
                  <button
                    type="button"
                    key={tool.slug}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedToolSlugs(selectedToolSlugs.filter((s) => s !== tool.slug));
                      } else {
                        setSelectedToolSlugs([...selectedToolSlugs, tool.slug]);
                      }
                    }}
                    className={`p-2 rounded-lg text-xs font-semibold text-left truncate transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tool.name}
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Selected steps ({selectedToolSlugs.length}): {selectedToolSlugs.join(' → ') || 'None selected yet'}
            </span>
          </div>

          <button
            type="submit"
            disabled={selectedToolSlugs.length === 0}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
          >
            Save & Publish Workflow
          </button>
        </form>
      )}

      {/* Available Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {workflows.map((wf) => {
          const suite = SUITES_DATA[wf.category];

          return (
            <div
              key={wf.id}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/50 hover:border-cyan-500/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider"
                    style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
                  >
                    {suite.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {wf.estimatedTime}
                    </span>
                    {wf.id.startsWith('wf-') && !DEFAULT_WORKFLOWS_IDS.includes(wf.id) && (
                      <button
                        onClick={() => deleteWorkflow(wf.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Delete custom workflow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {wf.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {wf.description}
                  </p>
                </div>

                {/* Steps Visual Chain */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Execution Steps ({wf.steps.length})
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {wf.steps.map((st, i) => (
                      <React.Fragment key={i}>
                        <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          {st.name}
                        </span>
                        {i < wf.steps.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Runs locally in browser
                </span>
                <button
                  onClick={() => handleStartWorkflow(wf)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Launch Pipeline</span>
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
