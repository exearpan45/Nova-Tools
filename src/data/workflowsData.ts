import { WorkflowDefinition } from '../types';

export const DEFAULT_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'wf-web-image-optimizer',
    title: 'Web Image Optimization Pipeline',
    description: 'Prepare raw photos for lightning-fast modern websites in 3 easy steps.',
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
      },
      {
        toolSlug: 'jpg-to-webp',
        name: 'Convert to Next-Gen WebP',
        description: 'Convert output into modern Google WebP format for maximum Lighthouse performance.',
        inputHint: 'Optimized image',
        outputHint: 'Final .webp file ready to publish'
      }
    ]
  },
  {
    id: 'wf-pdf-bundle',
    title: 'Document Package & Merge',
    description: 'Combine multiple individual PDF attachments or forms into one cohesive document.',
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
      },
      {
        toolSlug: 'pdf-compressor',
        name: 'Compress PDF for Email',
        description: 'Optimize internal streams so the final PDF meets email attachment limits (<10MB).',
        inputHint: 'Merged PDF',
        outputHint: 'Lightweight compressed PDF'
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
    description: 'Transform raw spreadsheet data into production-ready web API arrays.',
    category: 'data',
    icon: 'Database',
    estimatedTime: '< 10 sec',
    steps: [
      {
        toolSlug: 'data-cleaner',
        name: 'Clean Empty & Duplicate Rows',
        description: 'Strip empty lines, extra spaces, and redundant records.',
        inputHint: 'Raw CSV text',
        outputHint: 'Sanitized CSV rows'
      },
      {
        toolSlug: 'data-csv-to-json',
        name: 'Convert CSV to JSON Objects',
        description: 'Transform tabular columns into keyed JSON records with typed numbers and booleans.',
        inputHint: 'Sanitized CSV',
        outputHint: 'Standard JSON array'
      }
    ]
  }
];
