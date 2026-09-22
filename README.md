# NOVA TOOLS

> Simple tools. Done well. Built with care.

**NOVA TOOLS** ([novatools.net](https://novatools.net)) is a clean, fast, and private collection of free browser-based utilities created by **Arpan Goswami**.

All utilities run 100% client-side within the browser's JavaScript engine. No calculations, passwords, texts, or files are ever sent to remote servers or stored in databases.

---

## Sitemap Generation

A root script (`generate-sitemap.ts`) automatically discovers all core static pages and dynamic utility routes defined in the application (`src/data/toolsData.ts`), creating an SEO-compliant `public/sitemap.xml` file.

### How to Run the Sitemap Generator

Before deploying or whenever new tools or static routes are added, generate the updated sitemap using one of the following commands:

#### Option 1: Using the npm script (Recommended)
```bash
npm run sitemap
```

#### Option 2: Running the root script directly with tsx
```bash
npx tsx generate-sitemap.ts
```

#### Option 3: Automated via production build
The production build script automatically runs the sitemap generator before compiling Vite assets:
```bash
npm run build
```

---

## Pre-Deployment Checklist

Before deploying NOVA TOOLS to production (Cloud Run, Vercel, Netlify, or static CDN):

1. **Generate the Sitemap**:
   ```bash
   npm run sitemap
   ```
   This ensures `public/sitemap.xml` includes all latest routes with today's date in `<lastmod>`.

2. **Verify robots.txt**:
   Confirm that `public/robots.txt` references the live sitemap URL:
   ```txt
   User-agent: *
   Allow: /

   Sitemap: https://novatools.net/sitemap.xml
   Host: https://novatools.net
   ```

3. **Validate Code & Types**:
   ```bash
   npm run lint
   ```

4. **Build Production Assets**:
   ```bash
   npm run build
   ```

---

## Routes Indexed in the Sitemap

The generator automatically indexes:

* **Core Static Pages**:
  * `/` (Homepage — Daily, Priority 1.0)
  * `/tools` (Directory — Daily, Priority 0.9)
  * `/about` (About page — Monthly, Priority 0.5)
  * `/contact` (Contact page — Monthly, Priority 0.5)
  * `/privacy-policy` & `/privacy` (Privacy Policy — Monthly, Priority 0.5/0.4)
  * `/cookie-policy` (Cookie Policy — Monthly, Priority 0.4)
  * `/terms` (Terms of Service — Monthly, Priority 0.4)
  * `/disclaimer` (Disclaimer — Monthly, Priority 0.4)
* **Dynamic Tool Pages** (Weekly, Priority 0.9 for popular tools, 0.8 for standard tools):
  * `/tools/calculator`
  * `/tools/word-counter`
  * `/tools/qr-generator`
  * `/tools/password-generator`
  * `/tools/unit-converter`
  * `/tools/temperature-converter`
  * `/tools/percentage-calculator`
  * `/tools/age-calculator`
  * `/tools/bmi-calculator`
  * `/tools/json-formatter`
  * `/tools/base64`
  * ...and all additional tools declared in `src/data/toolsData.ts`.

---

## Development

### Prerequisites
* Node.js 18+ or 20+

### Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

---

## License & Copyright

© 2026 Copyright **Arpan Goswami**. All rights reserved.
Domain: [novatools.net](https://novatools.net)
