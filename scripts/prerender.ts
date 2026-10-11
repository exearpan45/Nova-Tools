import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_DATA } from '../src/data/toolsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const BASE_URL = 'https://nova-tools2.pages.dev';

const STATIC_PAGES = [
  {
    path: '/tools',
    title: 'All Tools — NOVA TOOLS',
    description: 'Explore free browser-based calculators, converters, PDF and image utilities, text tools, developer helpers, and everyday productivity tools.'
  },
  {
    path: '/about',
    title: 'About NOVA TOOLS — Mission & Philosophy',
    description: 'Learn about NOVA TOOLS, an independent collection of browser-based calculators, file utilities, text tools, and developer helpers created by Arpan Goswami.'
  },
  {
    path: '/contact',
    title: 'Contact — NOVA TOOLS',
    description: 'Contact NOVA TOOLS to report a bug, suggest a new online utility, share accessibility feedback, or ask a question about the website.'
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy — NOVA TOOLS',
    description: 'Read how NOVA TOOLS handles browser-based tool inputs, locally saved preferences, hosting requests, analytics, advertising, and third-party services.'
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — NOVA TOOLS',
    description: 'Read how NOVA TOOLS handles browser-based tool inputs, locally saved preferences, hosting requests, analytics, advertising, and third-party services.'
  },
  {
    path: '/cookie-policy',
    title: 'Cookie Policy — NOVA TOOLS',
    description: 'Understand cookies, browser local storage, analytics, and advertising technologies that may be used while visiting NOVA TOOLS.'
  },
  {
    path: '/terms',
    title: 'Terms of Service — NOVA TOOLS',
    description: 'Review the terms for using NOVA TOOLS online utilities, including availability, accuracy, permitted use, and intellectual property.'
  },
  {
    path: '/disclaimer',
    title: 'Disclaimer — NOVA TOOLS',
    description: 'Read important limitations for NOVA TOOLS calculators, converters, file utilities, technical outputs, and general-purpose information.'
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

  // 1. Preserve the dedicated SPA fallback when one exists.
  // This file is intentionally different from the prerendered app shell: it
  // redirects deep links back through index.html so refreshes on unprerendered
  // routes continue to work on static hosting.
  const fourOhFourPath = path.resolve(DIST_DIR, '404.html');
  const sourceFourOhFourPath = path.resolve(ROOT_DIR, 'public/404.html');
  if (fs.existsSync(sourceFourOhFourPath)) {
    fs.copyFileSync(sourceFourOhFourPath, fourOhFourPath);
    console.log('✓ Preserved public/404.html SPA fallback');
  } else {
    fs.writeFileSync(fourOhFourPath, templateHtml, 'utf-8');
    console.log('✓ Created dist/404.html fallback from app shell');
  }

  // 2. Prerender Static Pages
  for (const page of STATIC_PAGES) {
    const routeDir = path.resolve(DIST_DIR, page.path.replace(/^\//, ''));
    fs.mkdirSync(routeDir, { recursive: true });
    const canonicalUrl = page.path === '/privacy' ? `${BASE_URL}/privacy-policy` : `${BASE_URL}${page.path}`;
    const pageHtml = injectSeoMetadata(templateHtml, page.title, page.description, canonicalUrl);
    fs.writeFileSync(path.resolve(routeDir, 'index.html'), pageHtml, 'utf-8');
  }
  console.log(`✓ Prerendered ${STATIC_PAGES.length} static page routes`);

  // 3. Prerender Tools Pages
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
