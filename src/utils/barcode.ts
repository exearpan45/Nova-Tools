// Standard Code 128B patterns (bar/space module widths for codes 0..106)
const CODE128_PATTERNS: string[] = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112',
];

export interface BarcodeSvgOptions {
  fg?: string;
  bg?: string;
  height?: number;
  showText?: boolean;
}

/**
 * Generates a scannable Code 128B SVG string for printable ASCII characters (0x20 - 0x7E).
 */
export function generateCode128Svg(value: string, options: BarcodeSvgOptions = {}): { svg: string; error?: string } {
  const fg = options.fg || '#0f172a';
  const bg = options.bg || '#ffffff';
  const height = options.height || 88;
  const showText = options.showText !== false;

  if (!value) {
    return { svg: '', error: 'Enter text or numbers to generate a barcode.' };
  }

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 32 || code > 126) {
      return { svg: '', error: 'Code 128B supports standard ASCII characters (space through ~).' };
    }
  }

  const START_B = 104;
  const STOP = 106;

  const codes: number[] = [START_B];
  let checksum = START_B;

  for (let i = 0; i < value.length; i++) {
    const val = value.charCodeAt(i) - 32;
    codes.push(val);
    checksum += val * (i + 1);
  }

  codes.push(checksum % 103);
  codes.push(STOP);

  const quietModules = 10;
  let x = quietModules;
  const rects: string[] = [];

  for (const codeIdx of codes) {
    const pattern = CODE128_PATTERNS[codeIdx];
    for (let j = 0; j < pattern.length; j++) {
      const width = Number(pattern[j]);
      if (j % 2 === 0) {
        rects.push(`<rect x="${x}" y="12" width="${width}" height="${height}" fill="${fg}" />`);
      }
      x += width;
    }
  }

  const totalWidth = x + quietModules;
  const totalHeight = height + (showText ? 36 : 24);
  const escapedText = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${Math.max(260, totalWidth * 2)}" height="${totalHeight}" role="img" aria-label="Barcode ${escapedText}">
  <rect width="100%" height="100%" fill="${bg}" />
  ${rects.join('\n  ')}
  ${showText ? `<text x="${totalWidth / 2}" y="${height + 28}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="600" fill="${fg}">${escapedText}</text>` : ''}
</svg>`;

  return { svg };
}
