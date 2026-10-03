import React, { useState, useMemo } from 'react';
import {
  Table, ArrowRightLeft, FileSpreadsheet, Filter, CopyCheck,
  Columns, Grid, ArrowUpDown, Copy, Check, Download, Search
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface DataProps {
  toolSlug: string;
}

export const DataTools: React.FC<DataProps> = ({ toolSlug }) => {
  const [csvInput, setCsvInput] = useState<string>(
    `id,name,role,department,salary\n1,Alice Johnson,Lead Engineer,Technology,125000\n2,Bob Smith,Product Designer,Design,95000\n3,Carol Danvers,Security Analyst,Security,110000\n4,David Miller,Data Scientist,Technology,118000\n5,Eve Adams,Operations Manager,Operations,90000`
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<string>('name');

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
      {/* Interactive CSV Viewer */}
      {toolSlug === 'csv-viewer' ? (
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
