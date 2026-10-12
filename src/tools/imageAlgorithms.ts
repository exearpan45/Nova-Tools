export type OutputImageMime = 'image/png' | 'image/jpeg' | 'image/webp';

export interface CropRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getDefaultImageMime(slug: string): OutputImageMime {
  if (slug === 'jpg-to-png') return 'image/png';
  if (slug === 'webp-converter') return 'image/webp';
  if (slug === 'image-to-pdf' || slug === 'png-to-jpg') return 'image/jpeg';
  return 'image/png';
}

export function clampCropRectangle(
  imageWidth: number,
  imageHeight: number,
  x: number,
  y: number,
  width: number,
  height: number
): CropRectangle {
  const safeImageWidth = Math.max(1, Math.floor(imageWidth));
  const safeImageHeight = Math.max(1, Math.floor(imageHeight));
  const safeX = Math.max(0, Math.min(safeImageWidth - 1, Math.floor(Number.isFinite(x) ? x : 0)));
  const safeY = Math.max(0, Math.min(safeImageHeight - 1, Math.floor(Number.isFinite(y) ? y : 0)));
  return {
    x: safeX,
    y: safeY,
    width: Math.max(1, Math.min(safeImageWidth - safeX, Math.floor(Number.isFinite(width) ? width : safeImageWidth))),
    height: Math.max(1, Math.min(safeImageHeight - safeY, Math.floor(Number.isFinite(height) ? height : safeImageHeight)))
  };
}

export function isSupportedImageMime(requested: OutputImageMime, actual: string): boolean {
  return requested === actual;
}
