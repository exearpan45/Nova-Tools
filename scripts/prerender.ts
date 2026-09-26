import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_DATA } from '../src/data/toolsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const BASE_URL = 'https://novatools.2bd.net';

const STATIC_PAGES = [
  {
    path: '/tools',
    title: 'All Tools — NOVA TOOLS',
    description: 'Browse the complete collection of fast, private, and simple online utilities for everyday tasks.'
  },
  {
    path: '/about',
    title: 'About NOVA TOOLS — Mission & Philosophy',
    description: 'NOVA TOOLS was created by Arpan Goswami to provide fast, completely private, and deterministic browser-based utilities.'
  },
  {
    path: '/contact',
    title: 'Contact — NOVA TOOLS',
    description: 'Get in touch with the NOVA TOOLS team for suggestions, bug reports, and utility requests.'
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy — NOVA TOOLS',
    description: 'NOVA TOOLS runs 100% in your browser. We never collect, store, or transmit your calculation or text inputs.'
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — NOVA TOOLS',
    description: 'NOVA TOOLS runs 100% in your browser. We never collect, store, or transmit your calculation or text inputs.'
  },
  {
    path: '/cookie-policy',
    title: 'Cookie Policy — NOVA TOOLS',
    description: 'Learn how NOVA TOOLS uses harmless local storage to remember your dark mode preference and favorite tools.'
  },
  {
    path: '/terms',
    title: 'Terms of Service — NOVA TOOLS',
    description: 'Terms and conditions for using the free online utilities provided by NOVA TOOLS.'
  },
  {
    path: '/disclaimer',
    title: 'Disclaimer — NOVA TOOLS',
    description: 'Legal and operational disclaimer for NOVA TOOLS calculation and conversion utilities.'
  }
];

function injectSeoMetadata(template: string, title: string, description: string, canonicalUrl: string): string {
  let html = template;

  // Replace title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`
  );

  // Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace OG URL
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // Replace OG Title
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`
  );

  // Replace OG Description
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`
  );

  // Replace Twitter Title
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />`
  );

  // Replace Twitter Description
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />`
  );

  return html;
}

export function prerenderRoutes(): void {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist directory does not exist. Run vite build first.');
    process.exit(1);
  }

  const indexHtmlPath = path.resolve(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // 1. Ensure CNAME and .nojekyll are present in dist
  const cnameDistPath = path.resolve(DIST_DIR, 'CNAME');
  fs.writeFileSync(cnameDistPath, 'novatools.2bd.net\n', 'utf-8');
  console.log('✓ Verified dist/CNAME (novatools.2bd.net)');

  const nojekyllDistPath = path.resolve(DIST_DIR, '.nojekyll');
  fs.writeFileSync(nojekyllDistPath, '', 'utf-8');
  console.log('✓ Created dist/.nojekyll (bypasses GitHub Pages Jekyll)');

  // 2. Ensure 404.html is present in dist
  const fourOhFourPath = path.resolve(DIST_DIR, '404.html');
  fs.writeFileSync(fourOhFourPath, templateHtml, 'utf-8');
  console.log('✓ Created dist/404.html SPA fallback');

  // 3. Prerender Static Pages
  for (const page of STATIC_PAGES) {
    const routeDir = path.resolve(DIST_DIR, page.path.replace(/^\//, ''));
    fs.mkdirSync(routeDir, { recursive: true });
    const canonicalUrl = `${BASE_URL}${page.path}`;
    const pageHtml = injectSeoMetadata(templateHtml, page.title, page.description, canonicalUrl);
    fs.writeFileSync(path.resolve(routeDir, 'index.html'), pageHtml, 'utf-8');
  }
  console.log(`✓ Prerendered ${STATIC_PAGES.length} static page routes`);

  // 4. Prerender Tools Pages
  const toolsBaseDir = path.resolve(DIST_DIR, 'tools');
  fs.mkdirSync(toolsBaseDir, { recursive: true });

  for (const tool of TOOLS_DATA) {
    const toolDir = path.resolve(toolsBaseDir, tool.slug);
    fs.mkdirSync(toolDir, { recursive: true });

    const title = tool.seoTitle || `${tool.name} — NOVA TOOLS`;
    const description = tool.seoDescription || tool.description;
    const canonicalUrl = `${BASE_URL}/tools/${tool.slug}`;

    const toolHtml = injectSeoMetadata(templateHtml, title, description, canonicalUrl);
    fs.writeFileSync(path.resolve(toolDir, 'index.html'), toolHtml, 'utf-8');
  }
  console.log(`✓ Prerendered ${TOOLS_DATA.length} tool routes with unique SEO metadata`);
}

prerenderRoutes();
