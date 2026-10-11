import assert from 'node:assert/strict';
import { normalizeRoutePath } from '../src/utils/routing';

const cases: Array<[string, string]> = [
  ['/', '/'],
  ['/about', '/about'],
  ['/about/', '/about'],
  ['/about/?source=footer', '/about'],
  ['/tools/calculator/', '/tools/calculator'],
  ['/tools/calculator/?mode=basic#history', '/tools/calculator'],
  ['/privacy-policy///', '/privacy-policy'],
  ['?q=calculator', '/'],
  ['#top', '/'],
];

for (const [input, expected] of cases) {
  assert.equal(normalizeRoutePath(input), expected, `Unexpected normalized route for ${input}`);
}

console.log(`Route normalization tests passed: ${cases.length} cases.`);
