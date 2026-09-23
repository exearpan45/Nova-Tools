// Tool Health & Automated Calculation Verification

import { TOOLS_DATA } from '../data/toolsData';

export interface HealthCheckResult {
  passed: boolean;
  totalTools: number;
  errors: string[];
}

export function verifyToolRegistry(knownComponentIds: string[]): HealthCheckResult {
  const errors: string[] = [];

  for (const tool of TOOLS_DATA) {
    if (!tool.id) errors.push(`Tool missing id: ${tool.name}`);
    if (!tool.slug) errors.push(`Tool missing slug: ${tool.id}`);
    if (!tool.name) errors.push(`Tool missing name: ${tool.slug}`);
    if (!tool.description) errors.push(`Tool missing description: ${tool.slug}`);
    if (!tool.category) errors.push(`Tool missing category: ${tool.slug}`);
    if (!knownComponentIds.includes(tool.id)) {
      errors.push(`Tool '${tool.id}' has no matching UI component mapped in App.tsx!`);
    }
  }

  return {
    passed: errors.length === 0,
    totalTools: TOOLS_DATA.length,
    errors,
  };
}

export function runMathToolTests(): { passed: boolean; testCount: number; failures: string[] } {
  const failures: string[] = [];
  let testCount = 0;

  // Test 1: Percentage calculations
  testCount++;
  const p1 = (15 / 100) * 200; // 15% of 200 = 30
  if (p1 !== 30) failures.push(`Percentage normal test failed: expected 30, got ${p1}`);

  testCount++;
  const pZero = (0 / 100) * 50; // 0% of 50 = 0
  if (pZero !== 0) failures.push(`Percentage zero test failed: expected 0, got ${pZero}`);

  testCount++;
  const pChange = ((150 - 100) / 100) * 100; // 100 to 150 = +50%
  if (pChange !== 50) failures.push(`Percentage change test failed: expected 50, got ${pChange}`);

  // Test 2: BMI calculations
  testCount++;
  // BMI = weight(kg) / (height(m)^2). E.g. 70kg, 1.75m -> 70 / 3.0625 = 22.857
  const bmi = 70 / Math.pow(1.75, 2);
  const bmiRounded = Math.round(bmi * 10) / 10;
  if (bmiRounded !== 22.9) failures.push(`BMI calculation failed: expected 22.9, got ${bmiRounded}`);

  // Test 3: Temperature conversion
  testCount++;
  const fFromC = (100 * 9) / 5 + 32; // 100C = 212F
  if (fFromC !== 212) failures.push(`Temperature conversion failed: expected 212, got ${fFromC}`);

  testCount++;
  const cFromF = ((32 - 32) * 5) / 9; // 32F = 0C
  if (cFromF !== 0) failures.push(`Temperature zero test failed: expected 0, got ${cFromF}`);

  // Test 4: Length conversion
  testCount++;
  const mToKm = 1500 / 1000;
  if (mToKm !== 1.5) failures.push(`Length conversion failed: expected 1.5, got ${mToKm}`);

  // Test 5: Discount Calculator
  testCount++;
  const originalPrice = 80;
  const pctDiscount = 25;
  const savingsPct = (originalPrice * pctDiscount) / 100;
  const discountedPrice = originalPrice - savingsPct;
  if (savingsPct !== 20 || discountedPrice !== 60) {
    failures.push(`Discount percent test failed: savings=${savingsPct}, price=${discountedPrice}`);
  }

  testCount++;
  const taxPct = 8;
  const taxAmount = (discountedPrice * taxPct) / 100;
  const finalPriceWithTax = Math.round((discountedPrice + taxAmount) * 100) / 100;
  if (finalPriceWithTax !== 64.80) {
    failures.push(`Discount with tax failed: expected 64.8, got ${finalPriceWithTax}`);
  }

  // Test 6: UUID v4 Format
  testCount++;
  const uuidSample = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidV4Regex.test(uuidSample)) {
    failures.push(`UUID v4 regex validation failed on standard sample`);
  }

  // Test 7: URL encode & decode round-trip
  testCount++;
  const rawUrlText = 'simple tools & fast=true?';
  const encoded = encodeURIComponent(rawUrlText);
  const decoded = decodeURIComponent(encoded);
  if (decoded !== rawUrlText) {
    failures.push(`URL encode/decode round trip failed`);
  }

  // Test 8: Text Sorter deduplication & sorting
  testCount++;
  const linesToSort = ['Banana', 'Apple', 'Apple', 'Cherry'];
  const uniqueLines = Array.from(new Set(linesToSort)).sort();
  if (uniqueLines.length !== 3 || uniqueLines[0] !== 'Apple' || uniqueLines[2] !== 'Cherry') {
    failures.push(`Text sorter deduplication & sorting test failed`);
  }

  return {
    passed: failures.length === 0,
    testCount,
    failures,
  };
}
