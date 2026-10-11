import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const BASE_URL = 'https://nova-tools2.pages.dev';

function fail(message) {
  console.error('[SEO VERIFY] FAIL:', message);
  process.exit(1);
}
function read(file) {
  const p = path.join(dist, file);
  if (!fs.existsSync(p)) fail(`Missing dist/${file}`);
  return fs.readFileSync(p, 'utf8');
}
function walkHtml(directory, files = []) {
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walkHtml(fullPath, files);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) files.push(fullPath);
  }
  return files;
}

const indexHtml = read('index.html');
const sitemap = read('sitemap.xml');
const robots = read('robots.txt');

if (!indexHtml.includes(`<link rel="canonical" href="${BASE_URL}/"`)) {
  fail('dist/index.html does not have the expected pages.dev canonical.');
}
if (!sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
  fail('Sitemap namespace is invalid or missing.');
}
if (!robots.includes(`Sitemap: ${BASE_URL}/sitemap.xml`)) {
  fail('robots.txt does not point to the pages.dev sitemap.');
}

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const unique = new Set(locs);
if (locs.length === 0) fail('Sitemap contains no URLs.');
if (locs.length !== unique.size) fail('Sitemap contains duplicate URLs.');
if (locs.some((url) => !url.startsWith(`${BASE_URL}/`))) {
  fail('Sitemap contains a URL outside the production pages.dev origin.');
}

// Verify every sitemap URL has a matching prerendered page and canonical.
for (const url of locs) {
  const route = new URL(url).pathname;
  const relativePath = route === '/' ? 'index.html' : path.join(route.replace(/^\/+/, ''), 'index.html');
  const html = read(relativePath);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (canonical !== url) {
    fail(`Canonical mismatch for ${url}: found ${canonical || 'no canonical'}.`);
  }
}

// Catch stale custom-domain references anywhere in the generated HTML, not only the homepage.
const htmlFiles = walkHtml(dist);
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (/novatools\.2bd\.net|novatools\.net/i.test(html)) {
    fail(`Old domain found in generated HTML: ${path.relative(dist, file)}`);
  }
}

// Ensure every homepage quick action points to a real registered tool.
const homeSource = fs.readFileSync(path.join(root, 'src/pages/HomePage.tsx'), 'utf8');
const toolsSource = fs.readFileSync(path.join(root, 'src/data/toolsData.ts'), 'utf8');
const quickActionBlock = homeSource.match(/const quickActions = \[([\s\S]*?)\];/);
if (!quickActionBlock) fail('Could not locate the homepage quick actions list.');
const shortcutSlugs = [...quickActionBlock[1].matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
const registeredSlugs = new Set([...toolsSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]));
const brokenShortcuts = shortcutSlugs.filter((slug) => !registeredSlugs.has(slug));
if (shortcutSlugs.length === 0) fail('Homepage quick actions list is empty.');
if (brokenShortcuts.length > 0) fail(`Homepage shortcuts point to missing tools: ${brokenShortcuts.join(', ')}`);

console.log(`[SEO VERIFY] PASS: ${locs.length} sitemap URLs have matching prerendered pages and canonicals; robots, sitemap XML, origin, and ${htmlFiles.length} HTML files verified.`);
