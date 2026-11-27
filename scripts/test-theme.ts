import assert from 'node:assert/strict';
import { resolveTheme } from '../src/utils/theme';

const cases: Array<[ 'dark' | 'light' | 'system', boolean, 'dark' | 'light' ]> = [
  ['system', true, 'dark'],
  ['system', false, 'light'],
  ['dark', true, 'dark'],
  ['dark', false, 'dark'],
  ['light', true, 'light'],
  ['light', false, 'light'],
];

for (const [preference, prefersDark, expected] of cases) {
  assert.equal(
    resolveTheme(preference, prefersDark),
    expected,
    `Unexpected theme for preference=${preference}, systemDark=${prefersDark}`,
  );
}

console.log(`Theme preference tests passed: ${cases.length} cases.`);
