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

// Cross-check hard-coded navigation and workflow links against the actual registry.
const workflowSource = readFileSync(resolve('src/data/workflowsData.ts'), 'utf8');
const dropZoneSource = readFileSync(resolve('src/components/SmartDropZone.tsx'), 'utf8');
const homeSource = readFileSync(resolve('src/pages/HomePage.tsx'), 'utf8');
const dispatcherSource = readFileSync(resolve('src/tools/ToolDispatcher.tsx'), 'utf8');
const typesSource = readFileSync(resolve('src/types.ts'), 'utf8');

const workflowSlugs = [...workflowSource.matchAll(/toolSlug:\s*'([^']+)'/g)].map((match) => match[1]);
for (const slug of workflowSlugs) {
  if (!slugs.has(slug)) errors.push(`Workflow references missing tool slug: ${slug}`);
}

const dropZoneSlugs = [...dropZoneSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
for (const slug of dropZoneSlugs) {
  if (!slugs.has(slug)) errors.push(`Smart file-drop suggestions reference missing tool slug: ${slug}`);
}

const quickActionBlock = homeSource.match(/const quickActions = \[([\s\S]*?)\];/);
if (!quickActionBlock) {
  errors.push('Could not locate homepage quick actions list.');
} else {
  const quickActionSlugs = [...quickActionBlock[1].matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
  for (const slug of quickActionSlugs) {
    if (!slugs.has(slug)) errors.push(`Homepage quick action references missing tool slug: ${slug}`);
  }
}

const suiteType = typesSource.match(/export type ToolSuite =([\s\S]*?);/);
const declaredSuites = suiteType ? [...suiteType[1].matchAll(/'([^']+)'/g)].map((match) => match[1]) : [];
const dispatchedSuites = new Set([...dispatcherSource.matchAll(/case '([^']+)'\s*:/g)].map((match) => match[1]));
for (const suite of declaredSuites) {
  if (!dispatchedSuites.has(suite)) errors.push(`Tool suite has no dispatcher case: ${suite}`);
}

// Verify every registered tool is routed to a suite component that handles its slug.
const implementationEntries = [...source.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?slug:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?description:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'/g)]
  .map((match) => ({ id: match[1], slug: match[2], name: match[3], category: match[5] }));
const explicitSuiteBlock = source.match(/\(\(\{([\s\S]*?)\}\s+as Record<string, ToolSuite>\)\[tool\.id\]/);
const explicitSuiteMap = new Map(
  explicitSuiteBlock
    ? [...explicitSuiteBlock[1].matchAll(/'([^']+)':\s*'([^']+)'/g)].map((match) => [match[1], match[2]])
    : []
);
const categorySuiteMap = {
  Calculators: 'calculators',
  Converters: 'utility',
  Generators: 'security',
  'Text Tools': 'text',
  'Developer Tools': 'developer',
};
const componentBySuite = {
  image: 'imageTools',
  pdf: 'pdfTools',
  text: 'textTools',
  developer: 'developerTools',
  student: 'studentTools',
  calculators: 'calculatorTools',
  web: 'webTools',
  design: 'designTools',
  security: 'securityTools',
  data: 'dataTools',
  writing: 'writingTools',
  utility: 'utilityTools',
};
const componentSources = new Map();
for (const [suite, component] of Object.entries(componentBySuite)) {
  componentSources.set(suite, readFileSync(resolve(`src/tools/${component}.tsx`), 'utf8'));
}
for (const tool of implementationEntries) {
  const suite = explicitSuiteMap.get(tool.id)
    || (tool.id === 'qr-generator' ? 'web'
      : tool.id === 'temperature-converter' ? 'calculators'
      : tool.id === 'uuid-generator' || tool.id === 'timestamp-converter' ? 'developer'
      : categorySuiteMap[tool.category] || 'utility');
  const component = componentSources.get(suite);
  if (!component) {
    errors.push(`Tool ${tool.slug} maps to unknown suite: ${suite}`);
    continue;
  }
  // These two tools are intentionally handled by the shared text-statistics panel.
  const sharedTextStatistics = tool.slug === 'word-counter' || tool.slug === 'character-counter';
  if (!sharedTextStatistics && !component.includes(`'${tool.slug}'`) && !component.includes(`"${tool.slug}"`)) {
    errors.push(`No tool-specific handler reference found for ${tool.slug} in suite ${suite}`);
  }
}
if (implementationEntries.length !== entries.length) {
  errors.push(`Could only map ${implementationEntries.length} of ${entries.length} registry entries to suite implementations.`);
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
