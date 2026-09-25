import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_DATA } from '../src/data/toolsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://novatools.2bd.net';

interface SitemapEntry {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const STATIC_ROUTES: SitemapEntry[] = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/tools', changefreq: 'daily', priority: 0.9 },
  { path: '/about', changefreq: 'monthly', priority: 0.5 },
  { path: '/contact', changefreq: 'monthly', priority: 0.5 },
  { path: '/privacy-policy', changefreq: 'monthly', priority: 0.5 },
  { path: '/privacy', changefreq: 'monthly', priority: 0.4 },
  { path: '/terms', changefreq: 'monthly', priority: 0.4 },
  { path: '/cookie-policy', changefreq: 'monthly', priority: 0.4 },
  { path: '/disclaimer', changefreq: 'monthly', priority: 0.4 },
];

export function generateSitemapXml(): string {
  const today = new Date().toISOString().split('T')[0];

  const toolRoutes: SitemapEntry[] = TOOLS_DATA.map((tool) => ({
    path: `/tools/${tool.slug}`,
    changefreq: 'weekly',
    priority: tool.popular ? 0.9 : 0.8,
  }));

  const allEntries = [...STATIC_ROUTES, ...toolRoutes];

  const xmlEntries = allEntries
    .map(
      (entry) => `  <url>
    <loc>${BASE_URL}${entry.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;
}

function run() {
  const xml = generateSitemapXml();
  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(
    `Successfully generated sitemap with ${
      TOOLS_DATA.length + STATIC_ROUTES.length
    } URLs to: ${outputPath}`
  );
}

run();
