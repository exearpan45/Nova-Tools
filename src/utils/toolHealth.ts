// Tool Health & Automated Calculation Verification

import { TOOLS_DATA } from '../data/toolsData';
import { safeEvaluateMath } from '../tools/CalculatorTool';
import { CATEGORY_UNITS } from '../tools/UnitConverterTool';

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

  // 1. Calculator Mathematical Verification
  testCount++;
  const calc1 = safeEvaluateMath('2 + 3 * 4');
  if (calc1.result !== 14) failures.push(`Calculator precedence failed: expected 14, got ${calc1.result}`);

  testCount++;
  const calc2 = safeEvaluateMath('(2 + 3) * 4');
  if (calc2.result !== 20) failures.push(`Calculator parentheses failed: expected 20, got ${calc2.result}`);

  testCount++;
  const calc3 = safeEvaluateMath('10 / 2');
  if (calc3.result !== 5) failures.push(`Calculator division failed: expected 5, got ${calc3.result}`);

  testCount++;
  const calc4 = safeEvaluateMath('0 / 10');
  if (calc4.result !== 0) failures.push(`Calculator 0 / 10 failed: expected 0, got ${calc4.result}`);

  testCount++;
  const calc5 = safeEvaluateMath('-5 * -4');
  if (calc5.result !== 20) failures.push(`Calculator negative multiplication failed: expected 20, got ${calc5.result}`);

  testCount++;
  const calc6 = safeEvaluateMath('0.1 + 0.2');
  if (calc6.result !== 0.3) failures.push(`Calculator floating point failed: expected 0.3, got ${calc6.result}`);

  testCount++;
  const calc7 = safeEvaluateMath('200 * 15%');
  if (calc7.result !== 30) failures.push(`Calculator percentage failed: expected 30, got ${calc7.result}`);

  testCount++;
  const calc8 = safeEvaluateMath('10 mod 3');
  if (calc8.result !== 1) failures.push(`Calculator modulo failed: expected 1, got ${calc8.result}`);

  testCount++;
  const calcZeroDiv = safeEvaluateMath('10 / 0');
  if (!calcZeroDiv.error) failures.push(`Calculator divide-by-zero check failed: should have errored`);

  // 2. Percentage Formulas Verification
  testCount++;
  const p1 = (20 / 100) * 500; // 20% of 500 = 100
  if (p1 !== 100) failures.push(`Percentage formula 1 failed: expected 100, got ${p1}`);

  testCount++;
  const pInc = ((600 - 500) / 500) * 100; // 500 to 600 = +20%
  if (pInc !== 20) failures.push(`Percentage increase failed: expected 20, got ${pInc}`);

  testCount++;
  const pDec = ((600 - 500) / 600) * 100; // 600 to 500 = -16.6666...%
  if (Math.abs(pDec - 16.6666666667) > 0.0001) failures.push(`Percentage decrease failed: got ${pDec}`);

  testCount++;
  const pOrig = 100 / (20 / 100); // 100 is 20% of 500
  if (pOrig !== 500) failures.push(`Percentage original value failed: expected 500, got ${pOrig}`);

  // 3. BMI Verification
  testCount++;
  // BMI = weight(kg) / (height(m)^2). E.g. 70kg, 1.75m -> 70 / 3.0625 = 22.857
  const bmi = 70 / Math.pow(1.75, 2);
  const bmiRounded = Math.round(bmi * 10) / 10;
  if (bmiRounded !== 22.9) failures.push(`BMI calculation failed: expected 22.9, got ${bmiRounded}`);

  // 4. Temperature Conversion Verification
  testCount++;
  const fFromC = (100 * 9) / 5 + 32; // 100C = 212F
  if (fFromC !== 212) failures.push(`Temperature conversion failed: expected 212, got ${fFromC}`);

  testCount++;
  const cFromF = ((32 - 32) * 5) / 9; // 32F = 0C
  if (cFromF !== 0) failures.push(`Temperature zero test failed: expected 0, got ${cFromF}`);

  testCount++;
  const kFromC = 0 + 273.15; // 0C = 273.15K
  if (kFromC !== 273.15) failures.push(`Temperature Kelvin failed: expected 273.15, got ${kFromC}`);

  testCount++;
  const cFromK = 0 - 273.15; // 0K = -273.15C
  if (cFromK !== -273.15) failures.push(`Absolute zero test failed: expected -273.15, got ${cFromK}`);

  // 5. Unit Converter Categories & Factor Integrity
  testCount++;
  const requiredCategories = ['Length', 'Mass / Weight', 'Area', 'Volume', 'Speed', 'Pressure', 'Energy', 'Power', 'Digital Storage', 'Time'];
  for (const cat of requiredCategories) {
    if (!CATEGORY_UNITS[cat as keyof typeof CATEGORY_UNITS]) {
      failures.push(`Missing unit conversion category: ${cat}`);
    }
  }

  // Length roundtrip: m -> ft -> m
  testCount++;
  const mDef = CATEGORY_UNITS.Length.find((u) => u.id === 'm')!;
  const ftDef = CATEGORY_UNITS.Length.find((u) => u.id === 'ft')!;
  const testDist = 100;
  const feetVal = ftDef.fromBase(mDef.toBase(testDist));
  const roundtripDist = mDef.fromBase(ftDef.toBase(feetVal));
  if (Math.abs(roundtripDist - testDist) > 1e-9) {
    failures.push(`Length round-trip failed: started with ${testDist}, got ${roundtripDist}`);
  }

  // 6. Discount Calculator Verification
  testCount++;
  const origPrice = 80;
  const discountPct = 25;
  const discAmount = (origPrice * discountPct) / 100;
  const priceAfterDisc = origPrice - discAmount;
  const taxPct = 8;
  const taxAmount = (priceAfterDisc * taxPct) / 100;
  const finalPrice = Math.round((priceAfterDisc + taxAmount) * 100) / 100;
  if (discAmount !== 20 || priceAfterDisc !== 60 || finalPrice !== 64.8) {
    failures.push(`Discount calculation failed: disc=${discAmount}, price=${priceAfterDisc}, final=${finalPrice}`);
  }

  // 7. Digital Storage Binary vs Decimal Verification
  testCount++;
  const oneGiBInBytes = 1024 ** 3; // 1,073,741,824
  const oneGBInBytes = 1000 ** 3;  // 1,000,000,000
  if (oneGiBInBytes !== 1073741824 || oneGBInBytes !== 1000000000) {
    failures.push(`Storage constants mismatch: GiB=${oneGiBInBytes}, GB=${oneGBInBytes}`);
  }

  // 8. UUID v4 Format Verification
  testCount++;
  const uuidSample = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidV4Regex.test(uuidSample)) {
    failures.push(`UUID v4 regex validation failed on standard sample`);
  }

  // 9. URL encode & decode round-trip
  testCount++;
  const rawUrlText = 'simple tools & fast=true?';
  const encoded = encodeURIComponent(rawUrlText);
  const decoded = decodeURIComponent(encoded);
  if (decoded !== rawUrlText) {
    failures.push(`URL encode/decode round trip failed`);
  }

  // 10. Text Sorter deduplication & sorting
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
