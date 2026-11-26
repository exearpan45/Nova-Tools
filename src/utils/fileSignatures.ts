import DOMPurify from 'dompurify';

export interface SignatureInspection {
  detectedFormat: string;
  detectedMime: string;
  extensionMatch: boolean;
  isValidSize: boolean;
  warning?: string;
}

const MAX_SAFE_CLIENT_BYTES = 100 * 1024 * 1024; // 100 MB safety guard for browser memory

export async function inspectFileSignature(file: File): Promise<SignatureInspection> {
  const isValidSize = file.size <= MAX_SAFE_CLIENT_BYTES;
  const headerSlice = file.slice(0, 64);
  const buffer = await headerSlice.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const hex = (len: number) =>
    Array.from(bytes.slice(0, len))
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');

  let detectedFormat = 'Unknown / Text';
  let detectedMime = file.type || 'application/octet-stream';

  if (bytes.length >= 8 && hex(8) === '89 50 4E 47 0D 0A 1A 0A') {
    detectedFormat = 'PNG Image';
    detectedMime = 'image/png';
  } else if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    detectedFormat = 'JPEG Image';
    detectedMime = 'image/jpeg';
  } else if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) {
    detectedFormat = 'WebP Image';
    detectedMime = 'image/webp';
  } else if (
    bytes.length >= 6 &&
    (String.fromCharCode(...bytes.slice(0, 6)) === 'GIF87a' ||
      String.fromCharCode(...bytes.slice(0, 6)) === 'GIF89a')
  ) {
    detectedFormat = 'GIF Image';
    detectedMime = 'image/gif';
  } else if (bytes.length >= 5 && String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-') {
    detectedFormat = 'PDF Document';
    detectedMime = 'application/pdf';
  } else if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && (bytes[2] === 0x03 || bytes[2] === 0x05)) {
    detectedFormat = 'ZIP Archive';
    detectedMime = 'application/zip';
  } else {
    const textSample = new TextDecoder('utf-8', { fatal: false }).decode(bytes).trimStart().toLowerCase();
    if (textSample.startsWith('<svg') || textSample.startsWith('<?xml')) {
      detectedFormat = 'SVG Vector';
      detectedMime = 'image/svg+xml';
    } else if (textSample.startsWith('{') || textSample.startsWith('[')) {
      detectedFormat = 'JSON / Text';
      detectedMime = 'application/json';
    } else if (/^[\x09\x0A\x0D\x20-\x7E]+$/.test(textSample)) {
      detectedFormat = 'Plain Text / CSV / Markdown';
      detectedMime = file.type || 'text/plain';
    }
  }

  const lowerName = file.name.toLowerCase();
  let extensionMatch = true;
  if (lowerName.endsWith('.png') && detectedMime !== 'image/png') extensionMatch = false;
  if ((lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) && detectedMime !== 'image/jpeg') extensionMatch = false;
  if (lowerName.endsWith('.webp') && detectedMime !== 'image/webp') extensionMatch = false;
  if (lowerName.endsWith('.pdf') && detectedMime !== 'application/pdf') extensionMatch = false;

  let warning: string | undefined;
  if (!isValidSize) {
    warning = 'File exceeds 100 MB memory safety guideline for in-browser processing.';
  } else if (!extensionMatch) {
    warning = `File extension does not match binary signature (${detectedFormat}).`;
  }

  return {
    detectedFormat,
    detectedMime,
    extensionMatch,
    isValidSize,
    warning,
  };
}

export function sanitizeSvgContent(rawSvg: string): string {
  return DOMPurify.sanitize(rawSvg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'foreignObject', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus'],
  });
}
