import { WorkflowDefinition } from '../types';

export const DEFAULT_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'wf-web-image-optimizer',
    title: 'Web Image Optimization Pipeline',
    description: 'Prepare photos for websites by resizing dimensions and reducing image file size.',
    category: 'image',
    icon: 'Sparkles',
    estimatedTime: '< 15 sec',
    steps: [
      {
        toolSlug: 'image-resizer',
        name: 'Resize Image Dimensions',
        description: 'Scale down high-resolution camera photos to web-friendly widths (e.g. 1920px or 1280px).',
        inputHint: 'Upload high-res PNG or JPG',
        outputHint: 'Scaled image canvas'
      },
      {
        toolSlug: 'image-compressor',
        name: 'Compress Quality',
        description: 'Reduce file byte size by 60-80% using optimal perceptual lossy compression.',
        inputHint: 'Scaled image',
        outputHint: 'Optimized image stream'
      }
    ]
  },
  {
    id: 'wf-pdf-bundle',
    title: 'Document Package & Merge',
    description: 'Combine multiple PDF attachments or forms into one cohesive document.',
    category: 'pdf',
    icon: 'Layers',
    estimatedTime: '< 10 sec',
    steps: [
      {
        toolSlug: 'pdf-merger',
        name: 'Combine PDF Documents',
        description: 'Merge invoices, receipts, and identification into one sequence.',
        inputHint: 'Multiple PDF files',
        outputHint: 'Single merged PDF file'
      }
    ]
  },
  {
    id: 'wf-developer-cleaner',
    title: 'API Payload Validator & Minifier',
    description: 'Inspect, validate, and minify production JSON payloads before transmission.',
    category: 'developer',
    icon: 'Code2',
    estimatedTime: '< 5 sec',
    steps: [
      {
        toolSlug: 'json-validator',
        name: 'Validate JSON Structure',
        description: 'Detect broken brackets, trailing commas, and unquoted keys.',
        inputHint: 'Raw JSON string',
        outputHint: 'Syntax validation status'
      },
      {
        toolSlug: 'json-formatter',
        name: 'Pretty Print & Inspect',
        description: 'Beautify keys and nested objects for code review.',
        inputHint: 'Validated JSON',
        outputHint: 'Clean indented JSON'
      },
      {
        toolSlug: 'json-minifier',
        name: 'Compress to Single Line',
        description: 'Strip all formatting whitespace for compact network transfer.',
        inputHint: 'Reviewed JSON',
        outputHint: 'Single-line minified JSON string'
      }
    ]
  },
  {
    id: 'wf-data-pipeline',
    title: 'Spreadsheet to Clean JSON Feed',
    description: 'Inspect a CSV file and convert its rows into structured JSON data.',
    category: 'data',
    icon: 'Database',
    estimatedTime: '< 10 sec',
    steps: [
      {
        toolSlug: 'csv-viewer',
        name: 'Inspect CSV Rows',
        description: 'Open the CSV data in a searchable table and confirm the columns and records.',
        inputHint: 'CSV text or file',
        outputHint: 'Readable CSV table'
      },
      {
        toolSlug: 'csv-to-json',
        name: 'Convert CSV to JSON',
        description: 'Convert CSV headers and rows into a JSON array for further use.',
        inputHint: 'Reviewed CSV data',
        outputHint: 'JSON array'
      }
    ]
  }
];
