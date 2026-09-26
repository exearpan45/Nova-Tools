# NOVA TOOLS — Production Documentation

> **Simple tools. Done well.**  
> Free, fast tools for everyday tasks.

* **Domain:** [https://novatools.2bd.net/](https://novatools.2bd.net/)
* **Creator:** Arpan Goswami
* **Copyright:** © 2026 Copyright Arpan Goswami. All rights reserved.

---

## 1. Overview & Architecture

NOVA TOOLS is a clean, modern, and private collection of browser-based utilities. All tools execute **100% client-side** in the user's browser:
* Tool calculations and transformations run locally in the browser; the site also loads third-party analytics/advertising services.
* No user accounts or mandatory sign-ins; Google Analytics and Google AdSense are loaded on the site.
* User preferences (Theme, Favorites, Recent tools, 5-Star Ratings) are saved solely in the browser's `localStorage`.

### Technology Stack
* **Framework:** React 19 + TypeScript
* **Bundler & Dev Server:** Vite 8
* **Styling:** Tailwind CSS (modern `@import "tailwindcss";`)
* **Icons:** Lucide React
* **Web app:** Web App Manifest for installable browser-app behavior; no active service worker is currently registered.

---

## 2. Project Setup & Local Development

### Prerequisites
* Node.js 18+ or 20+
* npm 9+

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
The server runs at `http://localhost:3000`.

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
This automatically executes `tsx generate-sitemap.ts` followed by `vite build`. Output assets are placed in the `dist` directory.

### Local Production Preview
```bash
npm run preview
```

---

## 3. Deployment (GitHub Pages & Custom Domain)

NOVA TOOLS is currently deployed through **GitHub Actions + GitHub Pages**.

* **Production Domain:** `https://novatools.2bd.net/`
* **Build Command:** `npm run build`
* **Build Output Directory:** `dist`
* **Publishing workflow:** `.github/workflows/deploy-pages.yml`
* **Custom domain:** `novatools.2bd.net`

GitHub Pages handles the public static deployment. The build also creates prerendered route directories and a `404.html` fallback for direct navigation and refreshes on deep routes.

## 4. Centralized Tool Registry & Adding a Tool

NOVA TOOLS uses **ONE centralized registry** in `src/data/toolsData.ts`. Adding a new utility requires just two clear steps:

### Step 1: Create the Tool Component
Create your tool component in `src/tools/` (e.g. `src/tools/DiscountCalculatorTool.tsx`). Ensure it uses clean state, clear user feedback, and safe evaluation (no `eval()` or `new Function()`).

### Step 2: Register in `src/data/toolsData.ts`
Add the tool's definition to the `TOOLS_DATA` array:
```ts
{
  id: 'discount-calculator',
  name: 'Discount Calculator',
  slug: 'discount-calculator',
  category: 'Calculators',
  description: 'Calculate sale prices, percentage discounts, and final savings instantly.',
  keywords: ['discount', 'sale', 'percentage off', 'price calculator'],
  icon: 'Percent',
  whatItDoes: 'Computes your exact final price, total money saved, and tax adjustments.',
  howToUse: [
    'Enter the original retail price.',
    'Enter the discount percentage or fixed amount off.',
    'View the discounted price and total savings immediately.'
  ],
  example: 'Original: $80, Discount: 25% → Final Price: $60 (You save $20).',
  howItWorks: 'Uses client-side proportional arithmetic: savings = (price * discount) / 100.',
  privacyNote: 'All price entries remain private in your browser.',
  relatedToolSlugs: ['calculator', 'percentage-calculator'],
  faq: [
    { question: 'Does this save my prices?', answer: 'No. Everything stays in your browser.' }
  ],
  popular: false,
  status: 'active'
}
```
And map it in `src/tools/index.ts`.

### Automatic Propagation
Once registered, the tool automatically appears in:
1. The global Command Search (`Ctrl+K` / `/`)
2. The `/tools` catalog with category filtering and sorting
3. Related tool recommendations on sister tools
4. Dynamic SEO metadata (canonical, title, meta description, schema JSON-LD)
5. XML Sitemap (`sitemap.xml`) generated during `npm run build`

---

## 5. SEO & Search Console Readiness

* **Canonical URLs:** All routes have dynamic canonical tags pointing to `https://novatools.2bd.net/` or `https://novatools.2bd.net/tools/{slug}`.
* **Open Graph & Twitter Cards:** Complete `og:title`, `og:description`, `og:image` (1200x630 banner), and `twitter:card`.
* **Structured Data:** Schema.org `WebApplication` structured data embedded in `index.html`.
* **Robots.txt:** Clean `public/robots.txt` allowing all legitimate crawlers and pointing to `https://novatools.2bd.net/sitemap.xml`.
* **Sitemap:** Automated generation via `generate-sitemap.ts` (`npm run sitemap`).

### Google Search Console Verification
1. Add `novatools.2bd.net` as a Domain property in Google Search Console.
2. If using URL-prefix verification, follow Google's verification method shown for the property.
3. Submit sitemap URL: `https://novatools.2bd.net/sitemap.xml`.

---

## 6. Installable Web App

* **Manifest:** `public/manifest.json` is configured with app name, theme color, icons, and standalone display.
* **Icons:** Includes SVG and raster icons for browser and installed-app surfaces.
* **Offline:** No active service worker is registered in the current deployment, so offline behavior should not be advertised as guaranteed.

## 7. Google AdSense Integration

* **Configuration:** Centralized in `src/config/features.ts` (`ADSENSE_CLIENT_ID = 'ca-pub-3171742470969015'`).
* **Non-Intrusive Layout:** Ads are managed via the `<AdSlot />` component (`src/components/AdSlot.tsx`).
* **Guidelines Enforced:**
  * Fixed reserved container heights to prevent Cumulative Layout Shift (CLS).
  * Placed strictly below the tool interface to ensure calculations and controls are never blocked.
  * Clearly labeled with subtle "Advertisement" tag.

---

## 8. Troubleshooting & FAQ

* **Q: Route returns 404 when refreshed on Cloudflare Pages?**  
  *A:* Ensure `public/_redirects` is deployed with `/* /index.html 200`.
* **Q: A calculation produces weird decimals like 0.30000000000000004?**  
  *A:* Tools use `Math.round((val + Number.EPSILON) * 1e8) / 1e8` for standard float precision normalization.
* **Q: How to clear saved user data?**  
  *A:* Click "Clear history" in Recently Used, reset ratings via the star rating reset button, or clear browser storage for `novatools.2bd.net`.

---

## 9. Copyright & License

© 2026 Copyright **Arpan Goswami**. All rights reserved.  
Official website: [https://novatools.2bd.net/](https://novatools.2bd.net/)
