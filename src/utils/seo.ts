import { ToolDefinition } from '../types';

interface RouteSeoOptions {
  title: string;
  description: string;
  canonicalPath: string;
  tool?: ToolDefinition;
}

const BASE_URL = 'https://novatools.net';

/**
 * Updates DOM head elements (title, meta description, canonical, OG tags, Twitter tags, JSON-LD)
 */
export function updatePageSeo(options: RouteSeoOptions): void {
  const { title, description, canonicalPath, tool } = options;

  // 1. Update Title
  document.title = title;

  // 2. Helper to set or create meta tag
  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const isProperty = selector.includes('property=');
      const attrName = isProperty ? 'property' : 'name';
      const attrVal = selector.split(`${attrName}="`)[1]?.replace('"]', '') || '';
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  // 3. Meta Description
  setMeta('meta[name="description"]', 'content', description);

  // 4. Canonical URL
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  const fullCanonicalUrl = `${BASE_URL}${canonicalPath === '/' ? '/' : canonicalPath.replace(/\/$/, '')}`;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', fullCanonicalUrl);

  // 5. OpenGraph Tags
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:url"]', 'content', fullCanonicalUrl);
  setMeta('meta[property="og:type"]', 'content', tool ? 'article' : 'website');
  setMeta('meta[property="og:site_name"]', 'content', 'NOVA TOOLS');
  setMeta('meta[property="og:image"]', 'content', `${BASE_URL}/og-image.png`);

  // 6. Twitter Card Tags
  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', 'content', title);
  setMeta('meta[name="twitter:description"]', 'content', description);
  setMeta('meta[name="twitter:image"]', 'content', `${BASE_URL}/og-image.png`);

  // 7. Dynamic JSON-LD Structured Data
  let jsonLdEl = document.getElementById('route-jsonld') as HTMLScriptElement | null;
  if (!jsonLdEl) {
    jsonLdEl = document.createElement('script');
    jsonLdEl.id = 'route-jsonld';
    jsonLdEl.type = 'application/ld+json';
    document.head.appendChild(jsonLdEl);
  }

  const schemas: any[] = [];

  if (tool) {
    // WebApplication schema for tool
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `${tool.name} - NOVA TOOLS`,
      url: fullCanonicalUrl,
      description: tool.seoDescription || tool.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      author: {
        '@type': 'Person',
        name: 'Arpan Goswami'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    });

    // BreadcrumbList schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${BASE_URL}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: `${BASE_URL}/tools`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: fullCanonicalUrl
        }
      ]
    });

    // FAQPage schema if tool has FAQs
    if (tool.faqs && tool.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      });
    }
  } else if (canonicalPath === '/') {
    // WebSite schema for homepage
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'NOVA TOOLS',
      url: `${BASE_URL}/`,
      description: 'Free, fast, simple tools for everyday tasks. Calculations, conversions, text tools, developer utilities and more.',
      author: {
        '@type': 'Person',
        name: 'Arpan Goswami'
      }
    });
  } else {
    // BreadcrumbList for static pages
    const pageName = title.split('—')[0]?.trim() || title;
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${BASE_URL}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: pageName,
          item: fullCanonicalUrl
        }
      ]
    });
  }

  jsonLdEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
}
