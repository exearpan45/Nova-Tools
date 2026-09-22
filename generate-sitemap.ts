import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_DATA } from './src/data/toolsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://novatools.net';

interface SitemapRoute {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// Core static pages defined in NOVA TOOLS
const STATIC_ROUTES: SitemapRoute[] = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/tools', changefreq: 'daily', priority: 0.9 },
  { path: '/about', changefreq: 'monthly', priority: 0.5 },
  { path: '/contact', changefreq: 'monthly', priority: 0.5 },
  { path: '/privacy-policy', changefreq: 'monthly', priority: 0.5 },
  { path: '/privacy', changefreq: 'monthly', priority: 0.4 },
  { path: '/cookie-policy', changefreq: 'monthly', priority: 0.4 },
  { path: '/terms', changefreq: 'monthly', priority: 0.4 },
  { path: '/disclaimer', changefreq: 'monthly', priority: 0.4 },
];

/**
 * Generates valid XML sitemap string based on application routes and dynamic tool slugs
 */
export function generateSitemapXml(): string {
  const currentDate = new Date().toISOString().split('T')[0];

  // Dynamic tool routes based on TOOLS_DATA registry
  const toolRoutes: SitemapRoute[] = TOOLS_DATA.map((tool) => ({
    path: `/tools/${tool.slug}`,
    changefreq: 'weekly',
    priority: tool.popular ? 0.9 : 0.8,
  }));

  const allRoutes = [...STATIC_ROUTES, ...toolRoutes];

  const urlEntries = allRoutes
    .map(
      (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

/**
 * Main execution: writes sitemap.xml to public/sitemap.xml
 */
export function runGenerator() {
  const sitemapContent = generateSitemapXml();
  const outputPath = path.resolve(__dirname, 'public/sitemap.xml');

  // Ensure public directory exists
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sitemapContent, 'utf8');

  const totalUrls = STATIC_ROUTES.length + TOOLS_DATA.length;
  console.log(`[Sitemap Generator] Generated ${totalUrls} routes into: ${outputPath}`);
}

// Execute if run directly
runGenerator();
