import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const registryPath = resolve('src/data/toolsData.ts');
const source = readFileSync(registryPath, 'utf8');
const entries = [...source.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?slug:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?description:\s*'([^']+)'/g)]
  .map((match) => ({ id: match[1], slug: match[2], name: match[3], description: match[4] }));

const errors = [];
const warnings = [];
const ids = new Set();
const slugs = new Set();

for (const tool of entries) {
  for (const [field, value] of Object.entries(tool)) {
    if (!value.trim()) errors.push(`Empty ${field} for registry entry ${JSON.stringify(tool)}`);
  }
  if (ids.has(tool.id)) errors.push(`Duplicate tool id: ${tool.id}`);
  if (slugs.has(tool.slug)) errors.push(`Duplicate tool slug: ${tool.slug}`);
  ids.add(tool.id);
  slugs.add(tool.slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.slug)) errors.push(`Invalid URL slug: ${tool.slug}`);
  if (tool.description.length < 18) warnings.push(`Short description: ${tool.slug}`);
}

if (entries.length === 0) errors.push('No tool entries could be read from src/data/toolsData.ts.');
if (!source.includes('export const TOOLS_BY_SLUG')) errors.push('TOOLS_BY_SLUG export is missing.');

const relatedMatches = [...source.matchAll(/relatedSlugs:\s*\[([^\]]*)\]/g)];
for (const match of relatedMatches) {
  const related = [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
  for (const slug of related) {
    if (!slugs.has(slug)) errors.push(`Related tool slug does not exist in registry: ${slug}`);
  }
}

console.log(`NOVA Tools registry audit: ${entries.length} entries`);
console.log(`Unique IDs: ${ids.size}; unique slugs: ${slugs.size}`);
if (warnings.length) {
  console.warn(`Warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.warn(`  - ${warning}`));
}
if (errors.length) {
  console.error(`Registry audit failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exitCode = 1;
} else {
  console.log('Registry integrity checks passed.');
}
