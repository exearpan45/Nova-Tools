import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dist = path.join(root, 'dist');

function fail(message) {
  console.error('[SEO VERIFY] FAIL:', message);
  process.exit(1);
}
function read(file) {
  const p = path.join(dist, file);
  if (!fs.existsSync(p)) fail(`Missing dist/${file}`);
  return fs.readFileSync(p, 'utf8');
}

const indexHtml = read('index.html');
const sitemap = read('sitemap.xml');
const robots = read('robots.txt');

if (!indexHtml.includes('<link rel="canonical" href="https://nova-tools2.pages.dev/"')) {
  fail('dist/index.html does not have the expected pages.dev canonical.');
}
if (indexHtml.includes('novatools.2bd.net') || indexHtml.includes('novatools.net')) {
  fail('Old domain found in deployed HTML.');
}
if (sitemap.includes('novatools.2bd.net') || sitemap.includes('novatools.net')) {
  fail('Old domain found in sitemap.');
}
if (!sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
  fail('Sitemap namespace is invalid or missing.');
}
if (!robots.includes('Sitemap: https://nova-tools2.pages.dev/sitemap.xml')) {
  fail('robots.txt does not point to the pages.dev sitemap.');
}

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const unique = new Set(locs);
if (locs.length === 0) fail('Sitemap contains no URLs.');
if (locs.length !== unique.size) fail('Sitemap contains duplicate URLs.');
if (locs.some(url => !url.startsWith('https://nova-tools2.pages.dev/'))) {
  fail('Sitemap contains a URL outside the production pages.dev origin.');
}

console.log(`[SEO VERIFY] PASS: canonical, robots, sitemap origin, XML namespace, and ${locs.length} unique URLs verified.`);
