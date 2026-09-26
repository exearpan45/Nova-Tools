import React, { useState } from 'react';
import { Mail, Check, Shield, FileText, Info, AlertTriangle, Lock, EyeOff, Cpu, Database, Terminal, CheckCircle2, ArrowRight, Copy, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { copyToClipboard } from '../utils/clipboard';

interface StaticPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          About NOVA TOOLS
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Simple tools. Done well. Free, fast tools for everyday tasks.
        </p>
      </header>

      <div className="prose dark:prose-invert max-w-none text-sm text-neutral-700 dark:text-neutral-300 space-y-6 leading-relaxed">
        <p>
          <strong>NOVA TOOLS</strong> (<a href="https://novatools.2bd.net/" className="text-blue-600 dark:text-blue-400 hover:underline">https://novatools.2bd.net/</a>) is an independent suite of browser-based utilities created and maintained by <strong>Arpan Goswami</strong>.
        </p>
        <p>
          The platform was created in response to modern web utilities that have become crowded with intrusive advertising, mandatory registrations, paywalls, and slow loading times. NOVA TOOLS provides clean, purposeful, lightweight tools that execute everyday tasks in seconds directly in your web browser.
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 pt-2">
          What NOVA TOOLS Provides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b]">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Calculators</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Deterministic math, percentage calculations, chronological age, and WHO Body Mass Index.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b]">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Converters</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Physical units, thermodynamic temperatures, binary/decimal data storage, and time spans.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b]">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Generators</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Cryptographically secure random passwords and client-side canvas QR codes.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b]">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Text & Developer Tools</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Word/character counting, typography case conversion, JSON formatting/minifying, and Base64.</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 pt-2">
          Design & Architecture Philosophy
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
          <li>
            <strong>Clean UI & Minimal Text:</strong> Direct focus on the tool interface with no visual clutter or unnecessary decorative elements.
          </li>
          <li>
            <strong>Privacy by Architecture:</strong> Wherever technically practical, operations are executed entirely on your device using client-side JavaScript. No user inputs, passwords, files, or documents are transmitted to remote servers.
          </li>
          <li>
            <strong>Fast & Accessible:</strong> No account creation, email capture forms, or forced subscriptions. Tools load instantly across smartphones, tablets, and desktop workstations.
          </li>
          <li>
            <strong>Deterministic Accuracy:</strong> Uses verified mathematical formulas, W3C Web Cryptography standards, and strict Unicode parsing.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 pt-2">
          Creator & Copyright
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          Created and maintained by <strong>Arpan Goswami</strong>.
          <br />
          © 2026 Copyright Arpan Goswami. All rights reserved.
        </p>

        <div className="pt-4 flex flex-wrap gap-3 not-prose">
          <button
            onClick={() => onNavigate('/tools')}
            className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Explore All Tools
          </button>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#18181b] text-neutral-800 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Contact Creator
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<StaticPageProps> = () => {
  const { showToast } = useToast();
  const contactEmail = 'exe.arpan45@gmail.com';

  const handleCopyEmail = async () => {
    const copied = await copyToClipboard(contactEmail);
    if (copied) {
      showToast('Email address copied to clipboard', 'copied');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Contact Us
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Direct communication for bugs, feedback, tool suggestions, and inquiries.
        </p>
      </header>

      {/* Primary Contact Card */}
      <div className="p-5 rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-[#18181b] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Primary Contact Email</div>
              <a
                href={`mailto:${contactEmail}`}
                className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {contactEmail}
              </a>
            </div>
          </div>
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
          <p>
            <strong>Response Expectation:</strong> Messages sent to this email address are reviewed directly by the maintainer. We aim to reply to relevant inquiries, verified bug reports, and partnership questions within <strong>24 to 48 business hours</strong>.
          </p>
        </div>
      </div>

      {/* What You Can Contact Us For */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          What You Can Contact Us For
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent('[Bug Report] NOVA TOOLS')}`}
            className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group block"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Bug Reports
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Found a calculation error, layout glitch, or broken shortcut? Please include your device and browser details.
            </p>
          </a>

          <a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent('[Tool Request] NOVA TOOLS')}`}
            className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group block"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Tool Suggestions
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Need a utility that fits the NOVA TOOLS philosophy? We regularly add useful client-side tools.
            </p>
          </a>

          <a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent('[Feedback] NOVA TOOLS')}`}
            className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group block"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Feedback & Usability
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Share impressions regarding layout simplicity, keyboard navigation, or overall experience.
            </p>
          </a>

          <a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent('[General Inquiry] NOVA TOOLS')}`}
            className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group block"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                General Inquiries
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Questions regarding licensing, intellectual property, or technical architecture.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Last updated: January 2026 | NOVA TOOLS (https://novatools.2bd.net/)
        </p>
      </header>

      {/* Summary Guarantee Box */}
      <div className="p-5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs sm:text-sm">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Core Guarantee: Privacy by Architecture</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
          At NOVA TOOLS, privacy is an architectural guarantee rather than merely a legal statement. We do not maintain user accounts, require email registrations, or harvest inputs. Where practical, all tool calculations, conversions, text parsing, and cryptography occur 100% locally inside your browser.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            1. Client-Side Processing
          </h2>
          <p>
            When you enter numbers into the Calculator, check your Body Mass Index, calculate your age from a birth date, format a JSON string, encode Base64, generate a random password, or produce a QR code, all processing occurs entirely within your device's memory using JavaScript and Web APIs.
          </p>
          <p>
            Tool calculations and transformations are performed locally in your browser. NOVA TOOLS does not intentionally send the values you enter into these tools to its own server or database. The site does load third-party services for analytics and advertising, so their own network requests and privacy policies may apply.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            2. Local Storage (localStorage)
          </h2>
          <p>
            NOVA TOOLS uses your browser's native <code>localStorage</code> purely to remember your client-side preferences across sessions. The items saved locally are:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Theme Preference:</strong> Remembers your chosen Dark or Light interface setting.</li>
            <li><strong>Favorites:</strong> A list of tool slug identifiers (e.g. <code>["calculator", "qr-generator"]</code>) that you explicitly bookmark for fast access.</li>
            <li><strong>Recently Used Tools:</strong> A short list of recently viewed tool identifiers so you can quickly jump back to them.</li>
            <li><strong>Transient Session History:</strong> Active math calculation history on the calculator tool.</li>
          </ul>
          <p>
            You can inspect or delete this data at any time via your browser settings. Clearing browser data immediately removes all locally saved preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            3. Progressive Web App & Service Worker
          </h2>
          <p>
            NOVA TOOLS includes an installable web-app manifest. The current deployment does not register an active service worker, so offline operation is not guaranteed. Browser-installed app data and locally stored preferences remain under your browser's control.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            4. Cookies & Tracking
          </h2>
          <p>
            NOVA TOOLS itself does not intentionally use first-party tracking cookies. The site currently loads Google Analytics and Google AdSense. Those third-party services may use cookies, local storage, device identifiers, or similar technologies according to their own policies and configuration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            5. Advertising & Third-Party Services
          </h2>
          <p>
            NOVA TOOLS may display advertising through Google AdSense. Third-party services can receive the network requests required to load their scripts or content. Tool inputs are processed locally by the application and are not intentionally submitted to the NOVA TOOLS server.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            6. Server Access Logs
          </h2>
          <p>
            Like virtually all internet services, our web hosting provider automatically logs standard HTTP access requests (containing IP address, browser user-agent, requested URL, and timestamp). These logs are utilized strictly for network operations, DDoS mitigation, and server security, and are never combined with tool inputs or user identities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            7. Contact & Data Controller
          </h2>
          <p>
            If you have any questions or privacy feedback regarding this policy or our technical architecture, please contact:
          </p>
          <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-xs space-y-1 not-prose">
            <div><strong>Data Controller:</strong> Arpan Goswami</div>
            <div><strong>Website:</strong> https://novatools.2bd.net/</div>
            <div><strong>Contact Email:</strong> <a href="mailto:exe.arpan45@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">exe.arpan45@gmail.com</a></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const CookiePolicyPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Cookie Policy
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Last updated: January 2026 | NOVA TOOLS
        </p>
      </header>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-6 leading-relaxed">
        <p>
          This Cookie Policy explains how <strong>NOVA TOOLS</strong> (https://novatools.2bd.net/) uses cookies and modern browser storage mechanisms.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          1. Understanding Storage Technologies
        </h2>
        <div className="space-y-3 not-prose">
          <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b]">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Cookies</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">NOVA TOOLS does not intentionally set first-party tracking cookies. Google Analytics and Google AdSense are loaded on the site and may use their own cookies or similar technologies.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b]">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1">LocalStorage</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Client-side key-value storage kept strictly on your device. Used only for your UI preferences (theme mode, favorited tools, and recent tool shortcuts).</p>
          </div>
          <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b]">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1">SessionStorage</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Temporary memory for your active browser tab. Cleared automatically as soon as the tab is closed.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b]">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Service Worker Cache</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Stores static application assets (HTML, CSS, JS, icons) locally so NOVA TOOLS works offline and loads instantly.</p>
          </div>
        </div>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          2. How to Manage or Clear Browser Storage
        </h2>
        <p>
          You have complete control over local storage data. You can delete all stored preferences at any time by opening your browser settings (Privacy & Security → Clear Browsing Data / Cookies and Site Data). Doing so will reset your theme to the system default and clear your saved favorites.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('/privacy-policy')}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            ← View Full Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Terms of Service
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Last updated: January 2026 | NOVA TOOLS
        </p>
      </header>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-6 leading-relaxed">
        <p>
          Welcome to NOVA TOOLS (https://novatools.2bd.net/). By accessing or using our website, you agree to comply with and be bound by these Terms of Service.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          1. Permitted Use
        </h2>
        <p>
          NOVA TOOLS provides free browser-based software utilities for personal, educational, and commercial productivity. You agree to use the services in compliance with all applicable local, national, and international laws and regulations.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          2. Intellectual Property
        </h2>
        <p>
          The interface design, brand identity, layout, documentation, and software architecture of NOVA TOOLS are the intellectual property of <strong>Arpan Goswami</strong>.
          <br />
          <strong>© 2026 Copyright Arpan Goswami. All rights reserved.</strong>
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          3. Disclaimer of Warranties
        </h2>
        <p>
          The utilities and calculations are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. While we strive for rigorous mathematical and technical accuracy, NOVA TOOLS does not warrant that calculations are error-free or suitable for critical engineering, medical, legal, or financial decisions.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          4. Limitation of Liability
        </h2>
        <p>
          In no event shall Arpan Goswami or NOVA TOOLS be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of, or inability to access or use, the tools on this website.
        </p>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Disclaimer
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          General Informational Notice | NOVA TOOLS
        </p>
      </header>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-6 leading-relaxed">
        <p>
          The calculations, conversions, estimators, and text tools provided by NOVA TOOLS (https://novatools.2bd.net/) are provided for everyday informational and general productivity purposes only.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          1. Health & Medical Disclaimer
        </h2>
        <p>
          The Body Mass Index (BMI) calculator calculates a statistical ratio of height to weight based on standard World Health Organization formula cutoffs. <strong>It does not provide a medical diagnosis, clinical evaluation, or individualized health advice.</strong> BMI does not distinguish between lean muscle mass and adipose fat tissue. Always consult a licensed medical practitioner or qualified healthcare provider regarding health assessments or nutritional decisions.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          2. Financial & Tax Disclaimer
        </h2>
        <p>
          Calculators (including arithmetic and percentage calculators) are intended for everyday math estimations. They do not constitute professional financial, tax, accounting, or investment advice. Always verify important financial calculations with certified financial professionals.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          3. Technical & Engineering Notice
        </h2>
        <p>
          While data, unit, and temperature converters use standard international conversion factors, users should independently verify critical engineering, structural, or scientific specifications.
        </p>
      </div>
    </div>
  );
};
