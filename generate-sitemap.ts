import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_DATA } from './src/data/toolsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://nova-tools2.pages.dev';

const STATIC_ROUTES = [
  '/',
  '/tools',
  '/about',
  '/contact',
  '/privacy-policy',
  '/privacy',
  '/cookie-policy',
  '/terms',
  '/disclaimer',
];

export function generateSitemapXml(): string {
  const toolRoutes = TOOLS_DATA.map((tool) => `/tools/${tool.slug}`);
  const allRoutes = [...STATIC_ROUTES, ...toolRoutes];

  // Keep the sitemap intentionally minimal and deterministic.
  // No lastmod/changefreq/priority values are emitted unless they are
  // backed by a real content-change timestamp.
  const urlEntries = allRoutes
    .map((route) => `  <url><loc>${BASE_URL}${route}</loc></url>`)
    .join('\\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

export function runGenerator() {
  const sitemapContent = generateSitemapXml();
  const outputPath = path.resolve(__dirname, 'public/sitemap.xml');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, sitemapContent, 'utf8');
  console.log(`[Sitemap Generator] Generated ${STATIC_ROUTES.length + TOOLS_DATA.length} routes into: ${outputPath}`);
}

runGenerator();
