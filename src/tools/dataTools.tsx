import React, { useState, useMemo } from 'react';
import {
  Table, ArrowRightLeft, FileSpreadsheet, Filter, CopyCheck,
  Columns, Grid, ArrowUpDown, Copy, Check, Download, Search,
  BarChart3, PieChart, TrendingUp, Sparkles, Sliders
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface DataProps {
  toolSlug: string;
}

export const DataTools: React.FC<DataProps> = ({ toolSlug }) => {
  const [csvInput, setCsvInput] = useState<string>(
    toolSlug === 'chart-generator'
      ? `Month,Revenue\nJan,42000\nFeb,58000\nMar,74000\nApr,69000\nMay,88000\nJun,105000\nJul,120000`
      : `id,name,role,department,salary\n1,Alice Johnson,Lead Engineer,Technology,125000\n2,Bob Smith,Product Designer,Design,95000\n3,Carol Danvers,Security Analyst,Security,110000\n4,David Miller,Data Scientist,Technology,118000\n5,Eve Adams,Operations Manager,Operations,90000`
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<string>('name');

  // Chart Generator states
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'donut'>('bar');
  const [chartTitle, setChartTitle] = useState<string>('Revenue Growth Overview');
  const [chartPalette, setChartPalette] = useState<string>('#7657FF');

  // Parse CSV rows
  const parsedData = useMemo(() => {
    const lines = csvInput.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map((line) =>
      line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''))
    );
    return { headers, rows };
  }, [csvInput]);

  // Derived output based on tool
  const resultText = useMemo(() => {
    if (toolSlug === 'data-csv-to-json') {
      const { headers, rows } = parsedData;
      const jsonArr = rows.map((row) => {
        const obj: Record<string, any> = {};
        headers.forEach((h, i) => {
          const val = row[i];
          obj[h] = !isNaN(Number(val)) && val !== '' ? Number(val) : val;
        });
        return obj;
      });
      return JSON.stringify(jsonArr, null, 2);
    }

    if (toolSlug === 'column-extractor') {
      const colIndex = parsedData.headers.indexOf(selectedColumn);
      if (colIndex === -1) return '';
      return parsedData.rows.map((r) => r[colIndex] || '').join('\n');
    }

    if (toolSlug === 'text-to-table') {
      const { headers, rows } = parsedData;
      if (headers.length === 0) return '';
      const headerRow = `| ${headers.join(' | ')} |`;
      const dividerRow = `| ${headers.map(() => '---').join(' | ')} |`;
      const bodyRows = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
      return `${headerRow}\n${dividerRow}\n${bodyRows}`;
    }

    if (toolSlug === 'duplicate-finder') {
      const lines = csvInput.split('\n').filter(Boolean);
      const counts: Record<string, number> = {};
      lines.forEach((l) => (counts[l] = (counts[l] || 0) + 1));
      const duplicates = Object.entries(counts).filter(([_, count]) => count > 1);
      if (duplicates.length === 0) return 'No duplicate lines or records found in dataset.';
      return duplicates.map(([line, count]) => `(${count}x occurrences): ${line}`).join('\n');
    }

    return csvInput;
  }, [csvInput, parsedData, toolSlug, selectedColumn]);

  // Filtered rows for CSV Viewer
  const filteredRows = useMemo(() => {
    if (!tableSearch) return parsedData.rows;
    const q = tableSearch.toLowerCase();
    return parsedData.rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(q)));
  }, [parsedData.rows, tableSearch]);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Chart Generator */}
      {toolSlug === 'chart-generator' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Chart Title"
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${chartType === 'bar' ? 'bg-violet-600 text-white' : 'text-slate-500'}`}
                >
                  Bar
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('line')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${chartType === 'line' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
                >
                  Line
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('area')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${chartType === 'area' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
                >
                  Area
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('donut')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${chartType === 'donut' ? 'bg-pink-600 text-white' : 'text-slate-500'}`}
                >
                  Donut
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {['#7657FF', '#00D9FF', '#10B981', '#F59E0B', '#EC4899'].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setChartPalette(col)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${chartPalette === col ? 'scale-110 border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: col }}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  const svgEl = document.getElementById('nova-chart-svg');
                  if (!svgEl) return;
                  const svgData = new XMLSerializer().serializeToString(svgEl);
                  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `nova-chart-${Date.now()}.svg`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-xs ml-2 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const svgEl = document.getElementById('nova-chart-svg');
                  if (!svgEl) return;
                  const svgData = new XMLSerializer().serializeToString(svgEl);
                  const img = new Image();
                  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 920;
                    canvas.height = 520;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.fillStyle = '#ffffff';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                      const pngUrl = canvas.toDataURL('image/png');
                      const a = document.createElement('a');
                      a.href = pngUrl;
                      a.download = `nova-chart-${Date.now()}.png`;
                      a.click();
                    }
                    URL.revokeObjectURL(url);
                  };
                  img.src = url;
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-500 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PNG</span>
              </button>
            </div>
          </div>

          {/* Dual Split: CSV Input Left, Interactive Chart SVG Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Data Series (Label, Value)
              </span>
              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="w-full h-[400px] p-4 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xs flex flex-col items-center justify-center min-h-[400px]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 text-center">
                {chartTitle}
              </h3>

              {(() => {
                const rows = parsedData.rows
                  .map((r) => ({
                    label: r[0] || '',
                    value: Math.max(0, parseFloat(r[1]) || 0),
                  }))
                  .filter((r) => r.label && !isNaN(r.value));

                if (rows.length === 0) {
                  return <span className="text-xs text-slate-400">Please provide valid data with labels and numeric values.</span>;
                }

                const maxVal = Math.max(...rows.map((r) => r.value), 1);
                const width = 460;
                const height = 260;
                const padX = 40;
                const padY = 30;
                const plotW = width - padX * 2;
                const plotH = height - padY * 2;

                if (chartType === 'donut') {
                  const positiveRows = rows.filter((r) => r.value > 0);
                  const total = positiveRows.reduce((s, r) => s + r.value, 0) || 1;
                  let accAngle = -Math.PI / 2;
                  const cx = width / 2;
                  const cy = height / 2;
                  const r = 90;
                  const innerR = 52;

                  return (
                    <div className="w-full flex flex-col items-center gap-4">
                      <svg id="nova-chart-svg" viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm h-auto overflow-visible">
                        {positiveRows.map((row, idx) => {
                          const sliceAngle = positiveRows.length === 1 ? Math.PI * 1.9999 : (row.value / total) * Math.PI * 2;
                          const startAngle = accAngle;
                          const endAngle = accAngle + sliceAngle;
                          accAngle = endAngle;

                          const x1 = cx + r * Math.cos(startAngle);
                          const y1 = cy + r * Math.sin(startAngle);
                          const x2 = cx + r * Math.cos(endAngle);
                          const y2 = cy + r * Math.sin(endAngle);

                          const x3 = cx + innerR * Math.cos(endAngle);
                          const y3 = cy + innerR * Math.sin(endAngle);
                          const x4 = cx + innerR * Math.cos(startAngle);
                          const y4 = cy + innerR * Math.sin(startAngle);

                          const largeArc = sliceAngle > Math.PI ? 1 : 0;
                          const pathData = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;

                          const hue = (idx * 360) / Math.max(1, positiveRows.length);
                          return (
                            <g key={idx} className="group">
                              <path
                                d={pathData}
                                fill={`hsl(${hue}, 78%, 58%)`}
                                className="transition-opacity hover:opacity-80 cursor-pointer"
                              />
                              <title>{`${row.label}: ${row.value.toLocaleString()} (${Math.round((row.value / total) * 100)}%)`}</title>
                            </g>
                          );
                        })}
                        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold fill-slate-800 dark:fill-white font-mono tabular-nums">
                          {total.toLocaleString()}
                        </text>
                      </svg>

                      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
                        {positiveRows.map((row, idx) => {
                          const hue = (idx * 360) / Math.max(1, positiveRows.length);
                          const pct = Math.round((row.value / total) * 100);
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono tabular-nums"
                            >
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: `hsl(${hue}, 78%, 58%)` }} />
                              <span>{row.label}: {pct}%</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (chartType === 'line' || chartType === 'area') {
                  const stepX = plotW / Math.max(1, rows.length - 1);
                  const points = rows.map((r, i) => {
                    const x = padX + i * stepX;
                    const y = height - padY - (r.value / maxVal) * plotH;
                    return { x, y, ...r };
                  });

                  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                  const areaPath = `${linePath} L ${padX + (rows.length - 1) * stepX} ${height - padY} L ${padX} ${height - padY} Z`;

                  return (
                    <svg id="nova-chart-svg" viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md h-auto">
                      <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="rgba(150,150,150,0.2)" strokeWidth="1" />
                      <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="rgba(150,150,150,0.2)" strokeWidth="1" strokeDasharray="3 3" />

                      {chartType === 'area' && (
                        <path d={areaPath} fill={chartPalette} fillOpacity="0.2" />
                      )}
                      <path d={linePath} fill="none" stroke={chartPalette} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                      {points.map((p, i) => (
                        <g key={i} className="group">
                          <circle cx={p.x} cy={p.y} r="4.5" fill={chartPalette} stroke="#fff" strokeWidth="1.5" className="hover:scale-125 transition-transform cursor-pointer" />
                          <text x={p.x} y={height - padY + 16} textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">
                            {p.label}
                          </text>
                          <title>{`${p.label}: ${p.value}`}</title>
                        </g>
                      ))}
                    </svg>
                  );
                }

                // Default: Bar Chart
                const colWidth = Math.min(48, (plotW / rows.length) * 0.7);
                const step = plotW / rows.length;

                return (
                  <svg id="nova-chart-svg" viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md h-auto">
                    <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="rgba(150,150,150,0.3)" strokeWidth="1" />
                    {rows.map((r, i) => {
                      const barH = (r.value / maxVal) * plotH;
                      const x = padX + i * step + (step - colWidth) / 2;
                      const y = height - padY - barH;

                      return (
                        <g key={i} className="group cursor-pointer">
                          <rect
                            x={x}
                            y={y}
                            width={colWidth}
                            height={Math.max(2, barH)}
                            rx="4"
                            fill={chartPalette}
                            className="transition-opacity group-hover:opacity-80"
                          />
                          <text x={x + colWidth / 2} y={height - padY + 16} textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">
                            {r.label}
                          </text>
                          <text x={x + colWidth / 2} y={y - 6} textAnchor="middle" className="text-[9px] fill-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {r.value.toLocaleString()}
                          </text>
                          <title>{`${r.label}: ${r.value.toLocaleString()}`}</title>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          </div>
        </div>
      ) : toolSlug === 'csv-viewer' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search across all cells..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredRows.length} of {parsedData.rows.length} rows
            </span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    {parsedData.headers.map((h, i) => (
                      <th key={i} className="p-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {filteredRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-slate-800 dark:text-slate-200">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Transformer Tools Dual View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Input Data (CSV / Text)
              </span>
              {toolSlug === 'column-extractor' && parsedData.headers.length > 0 && (
                <select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {parsedData.headers.map((h) => (
                    <option key={h} value={h}>
                      Col: {h}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full h-80 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Result</span>
              <button
                onClick={() => handleCopy(resultText)}
                className="text-xs flex items-center gap-1.5 text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={resultText}
              className="w-full h-80 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-purple-600 dark:text-purple-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};
