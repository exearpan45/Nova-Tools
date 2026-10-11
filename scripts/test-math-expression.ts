import assert from 'node:assert/strict';
import { evaluateMathExpression } from '../src/utils/mathExpression';

const validCases: Array<[string, number]> = [
  ['2 + 3 * 4', 14],
  ['(12 + 8) * 5 - 50 / 2', 75],
  ['(150 + 25) * 4 - 50 / 2', 675],
  ['-2 * (3 + 4)', -14],
  ['2 * -3', -6],
  ['4--2', 6],
  ['.5 + 1.25', 1.75],
  ['1 / 3', 0.33333333],
  ['10 % 3', 1],
  ['', 0],
];

for (const [expression, expected] of validCases) {
  const result = evaluateMathExpression(expression);
  assert.equal(result.success, true, `Expected success for ${expression}: ${result.error}`);
  assert.equal(result.result, expected, `Unexpected result for ${expression}`);
}

const invalidCases = [
  '1..2 + 3',
  '. + 1',
  '1 +',
  '* 2',
  '(1 + 2',
  '1 + 2)',
  '2(3 + 4)',
  '1 / 0',
  '1 % 0',
  '1e3 + 1',
  '2 + alert(1)',
  'Infinity',
];

for (const expression of invalidCases) {
  const result = evaluateMathExpression(expression);
  assert.equal(result.success, false, `Expected rejection for ${expression}, got ${result.result}`);
}

console.log(`Math expression tests passed: ${validCases.length} valid cases and ${invalidCases.length} invalid cases.`);
