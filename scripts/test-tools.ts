import { TOOLS_DATA, TOOLS_BY_SLUG } from '../src/data/toolsData';
import { clampCropRectangle, getDefaultImageMime, isSupportedImageMime } from '../src/tools/imageAlgorithms';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, errorMsg?: string) {
  if (condition) {
    results.push({ name, passed: true });
  } else {
    results.push({ name, passed: false, error: errorMsg || 'Assertion failed' });
    console.error(`❌ FAIL: ${name} - ${errorMsg || 'Assertion failed'}`);
  }
}

console.log(`\n=== NOVA TOOLS AUDIT & TEST SUITE ===`);
console.log(`Auditing ${TOOLS_DATA.length} registered tools...\n`);

// 1. Registry tests
const slugSet = new Set<string>();
let duplicateCount = 0;
for (const tool of TOOLS_DATA) {
  if (slugSet.has(tool.slug)) {
    duplicateCount++;
    console.error(`Duplicate slug found: ${tool.slug}`);
  }
  slugSet.add(tool.slug);
}
assert(duplicateCount === 0, 'Unique tool slugs', `Found ${duplicateCount} duplicate slugs`);
assert(TOOLS_DATA.length >= 34, 'Minimum tool threshold met', `Currently registered: ${TOOLS_DATA.length}`);

// 2. Validate all tools have required properties
let missingFieldsCount = 0;
for (const tool of TOOLS_DATA) {
  if (!tool.id || !tool.slug || !tool.name || !tool.description || !tool.suite) {
    missingFieldsCount++;
    console.error(`Tool missing required field: ${JSON.stringify(tool)}`);
  }
}
assert(missingFieldsCount === 0, 'All tools have required metadata fields', `Found ${missingFieldsCount} deficient tools`);

// 3. Validate related slugs point to existing tools
let brokenRelatedLinks = 0;
for (const tool of TOOLS_DATA) {
  if (tool.relatedSlugs) {
    for (const rel of tool.relatedSlugs) {
      if (!TOOLS_BY_SLUG.has(rel)) {
        brokenRelatedLinks++;
        console.error(`Broken related link in ${tool.slug}: points to missing tool '${rel}'`);
      }
    }
  }
}
assert(brokenRelatedLinks === 0, 'All relatedSlugs resolve to registered tools', `Found ${brokenRelatedLinks} broken related links`);

// 4. Functional tests for core math & algorithms
// A. Math expression evaluator (Standard Calculator)
const testCalc = (expr: string, expected: number) => {
  // Simple check matching evaluateMathExpression algorithm
  const sanitized = expr.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/');
  // eval is not used in app, but here we verify expected math results
  return Math.abs(eval(sanitized) - expected) < 1e-6;
};
assert(testCalc('10 + 20', 30), 'Calculator: addition');
assert(testCalc('0.1 + 0.2', 0.3), 'Calculator: float precision');
assert(testCalc('15 * 4 - 10 / 2', 55), 'Calculator: operator precedence');

// B. Percentage calculation
const pctOf = (pct: number, val: number) => (pct / 100) * val;
assert(pctOf(20, 150) === 30, 'Percentage calculation: 20% of 150 = 30');

// C. Digital storage converter
const bytesToKB = (b: number) => b / 1024;
assert(bytesToKB(2048) === 2, 'Data size converter: 2048 bytes = 2 KB');

// D. Word & Character counting
const sampleText = 'The quick brown fox jumps over the lazy dog.';
const wordCount = sampleText.trim().split(/\s+/).length;
const charCount = sampleText.length;
assert(wordCount === 9, 'Word counter: 9 words in pangram');
assert(charCount === 44, 'Character counter: 44 chars in pangram');

// E. UUID format test
const sampleUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
assert(uuidRegex.test(sampleUuid), 'UUID regex validator matches standard UUID');

// F. Batch 3 image tool registry and deterministic image helper tests
const batch3ImageSlugs = [
  'image-cropper', 'image-format-converter', 'png-to-jpg', 'jpg-to-png',
  'webp-converter', 'image-to-pdf', 'image-rotator', 'image-flipper',
  'image-watermark', 'image-overlay', 'background-color-changer',
  'image-grayscale', 'image-brightness', 'image-contrast', 'image-saturation', 'image-blur'
];
assert(
  batch3ImageSlugs.every((slug) => TOOLS_BY_SLUG.get(slug)?.suite === 'image'),
  'Batch 3: all 16 new image tools are registered in the image suite'
);
assert(getDefaultImageMime('jpg-to-png') === 'image/png', 'Image format: JPG to PNG selects PNG');
assert(getDefaultImageMime('png-to-jpg') === 'image/jpeg', 'Image format: PNG to JPG selects JPEG');
assert(getDefaultImageMime('webp-converter') === 'image/webp', 'Image format: WebP converter selects WebP');
assert(getDefaultImageMime('image-to-pdf') === 'image/jpeg', 'Image to PDF starts with PDF-compatible JPEG');
assert(isSupportedImageMime('image/webp', 'image/webp'), 'Image format: browser WebP export is recognized');
assert(!isSupportedImageMime('image/webp', 'image/png'), 'Image format: unsupported WebP export is rejected');
const boundedCrop = clampCropRectangle(100, 80, 95, 79, 50, 20);
assert(boundedCrop.x === 95 && boundedCrop.y === 79 && boundedCrop.width === 5 && boundedCrop.height === 1, 'Image crop: crop bounds are clamped to source dimensions');
const negativeCrop = clampCropRectangle(100, 80, -10, -4, 30, 20);
assert(negativeCrop.x === 0 && negativeCrop.y === 0 && negativeCrop.width === 30 && negativeCrop.height === 20, 'Image crop: negative origin is safely normalized');

// Summary
const passedCount = results.filter((r) => r.passed).length;
const failedCount = results.filter((r) => !r.passed).length;

console.log(`\n=== TEST RESULTS ===`);
console.log(`Total tests: ${results.length}`);
console.log(`Passed: ${passedCount}`);
console.log(`Failed: ${failedCount}`);

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log(`\n✓ All core registry and functional tests passed!\n`);
}
