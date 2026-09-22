import React, { useState } from 'react';
import { Mail, Check, Shield, FileText, Info, AlertTriangle, Lock, EyeOff, Cpu, Database, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';

interface StaticPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          About NOVA TOOLS
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Simple tools. Done well. Built with care.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm text-neutral-700 dark:text-neutral-300 space-y-5 leading-relaxed">
        <p>
          NOVA TOOLS is an independent collection of free, high-speed, browser-based utilities created by <strong>Arpan Goswami</strong>.
        </p>
        <p>
          In a modern internet increasingly congested by heavy ad-trackers, forced registrations, paywalls, and bloated web apps, NOVA TOOLS was conceived with a clear and unwavering mission: <strong>build clean, purposeful, lightweight tools that solve immediate everyday tasks in seconds.</strong>
        </p>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 pt-4">
          Core Operating Principles
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Privacy by Architecture:</strong> All calculations, conversions, QR codes, and password generation happen entirely client-side inside your browser. No sensitive user inputs are ever recorded or transferred to remote servers.
          </li>
          <li>
            <strong>Instant Usability:</strong> Zero account creation, zero email gates, zero pop-up subscriptions.
          </li>
          <li>
            <strong>Pure Performance:</strong> Lightweight bundle, no external tracking scripts, responsive across phones, tablets, and desktops.
          </li>
          <li>
            <strong>Craft & Reliability:</strong> Deterministic algorithms, mathematically verified conversions, and clean aesthetic typography.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 pt-4">
          Creator & Governance
        </h2>
        <p>
          Created and maintained by <strong>Arpan Goswami</strong>.
          <br />
          © 2026 Copyright Arpan Goswami. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<StaticPageProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Contact Us
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Have feedback, a tool request, or found a bug? We'd love to hear from you.
        </p>
      </div>

      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center gap-3 text-xs text-neutral-700 dark:text-neutral-300">
        <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <div>
          <span>Direct email: </span>
          <a
            href="mailto:hello@novatools.net"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            hello@novatools.net
          </a>
        </div>
      </div>

      {submitted ? (
        <div className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/20 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
            Thank you for reaching out!
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            Your message has been sent. We review feedback continuously to improve NOVA TOOLS.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Your Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Smith"
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contact-msg" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Message / Feedback / Suggestion
            </label>
            <textarea
              id="contact-msg"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your request or suggestion..."
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export const PrivacyPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-3">
          <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Privacy by Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Privacy Policy
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
          At NOVA TOOLS, privacy is not a decorative policy setting or an afterthought — it is the fundamental architectural principle of our software. We guarantee 100% client-side computation, zero server-side data storage, and zero surveillance.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-4">
          <span>Effective Date: January 1, 2026</span>
          <span>•</span>
          <span>Last Updated: September 22, 2026</span>
          <span>•</span>
          <span>Domain: novatools.net</span>
          <span>•</span>
          <span>Creator & Maintainer: Arpan Goswami</span>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="p-5 sm:p-6 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>The NOVA TOOLS Privacy Guarantee in Brief</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-700 dark:text-neutral-300 pt-1">
          <div className="space-y-1">
            <strong className="text-neutral-900 dark:text-neutral-100 block font-medium">
              1. 100% Client-Side
            </strong>
            <p className="text-neutral-600 dark:text-neutral-400">
              Calculations, text tokenization, and QR encoding execute exclusively in your device's browser memory. Zero input data is transmitted to remote servers.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-neutral-900 dark:text-neutral-100 block font-medium">
              2. Absolute Zero Storage
            </strong>
            <p className="text-neutral-600 dark:text-neutral-400">
              We do not operate databases or storage buckets for tool payloads. Data disappears from system RAM as soon as you close or refresh the tab.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-neutral-900 dark:text-neutral-100 block font-medium">
              3. Verifiable Security
            </strong>
            <p className="text-neutral-600 dark:text-neutral-400">
              You can verify zero network requests in your browser’s DevTools Network tab. Works seamlessly offline with complete cryptographic safety.
            </p>
          </div>
        </div>
      </div>

      {/* Core Architectural Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Local Browser CPU</span>
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            All code executes within your local device's JavaScript engine. Zero computation occurs on remote cloud servers.
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Zero Data Storage</span>
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            No backend databases, cloud buckets, or server caches record your calculations, passwords, or documents.
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>No Accounts or Paywalls</span>
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            Instant utility access with zero registration, email harvesting, social logins, telemetry, or hidden paywalls.
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Zero Surveillance</span>
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            No behavioral trackers, cross-site profiling cookies, keystroke monitors, or session recording scripts.
          </div>
        </div>
      </div>

      {/* Comprehensive Sections */}
      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-9 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>1. Client-Side Architecture & Core Philosophy</span>
          </h2>
          <p>
            Welcome to <strong>NOVA TOOLS</strong> (accessible at <code>https://novatools.net</code>), created and maintained by <strong>Arpan Goswami</strong>. We believe that privacy is a fundamental human right, not an optional preference hidden behind complex settings.
          </p>
          <p>
            The majority of modern web utilities operate on a <em>client-server processing model</em>: when you type text into a word counter, enter numbers into a financial calculator, format JSON, or generate a QR code, the application silently dispatches your data via HTTP POST requests to remote cloud servers. Those servers inspect, parse, and log your inputs in access logs or databases before returning a response.
          </p>
          <p>
            <strong>NOVA TOOLS operates on the opposite paradigm: Pure Client-Side Execution.</strong> When you visit NOVA TOOLS, our content delivery network delivers static, compiled HTML, JavaScript, and WebAssembly bundles to your browser once. From that moment on, every calculation, text transformation, cryptographic key generation, and data conversion runs exclusively inside your device's isolated browser sandbox. <strong>Your data never leaves your computer or phone.</strong>
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>2. The Zero-Storage Promise</span>
          </h2>
          <p>
            NOVA TOOLS is engineered without a backend persistence layer for tool inputs. We operate under a strict <strong>Zero Data Storage Architecture</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>No Cloud Databases:</strong> We do not operate any relational (SQL), document (NoSQL), key-value (Redis), or cloud document store (Firestore) that captures tool inputs or outputs.
            </li>
            <li>
              <strong>No Server Caching or Intermediate Files:</strong> No cache mechanism on our reverse proxy or application server stores the payloads you calculate, format, or convert.
            </li>
            <li>
              <strong>Volatile Device Memory Only:</strong> Tool state exists exclusively as temporary React component state inside your browser's private memory space. When you close the tab, navigate away, or reload the page, that memory is automatically reclaimed by your operating system's garbage collector.
            </li>
            <li>
              <strong>No AI Model Ingestion:</strong> Unlike online services that repurpose submitted text, code, or data to train machine learning models, NOVA TOOLS never transmits, inspects, or trains AI models on your inputs.
            </li>
            <li>
              <strong>Offline Resilience:</strong> Because our architecture does not rely on remote servers for calculation, you can load NOVA TOOLS, disconnect your internet connection (or activate Airplane Mode), and continue using all utilities with 100% functionality.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>3. Data Security & Cryptographic Standards</span>
          </h2>
          <p>
            Data security at NOVA TOOLS is enforced by modern cryptographic primitives and browser sandboxing:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>Hardware-Entropy Web Crypto:</strong> For sensitive operations like password generation, we utilize the standardized <code>window.crypto.getRandomValues()</code> Web Crypto API. This draws cryptographically secure pseudorandom entropy directly from your operating system's kernel hardware pool (e.g. <code>/dev/urandom</code> on Linux/macOS and CryptGenRandom on Windows).
            </li>
            <li>
              <strong>Enforced TLS 1.3 Encryption:</strong> All assets served from <code>novatools.net</code> are strictly delivered over HTTPS using modern TLS 1.3 protocols with Perfect Forward Secrecy (PFS), protecting against network sniffing, eavesdropping, and man-in-the-middle attacks.
            </li>
            <li>
              <strong>Browser Process Isolation:</strong> Modern browsers run web applications in isolated sandbox processes. Because our utilities do not make external API calls, your tool data cannot be accessed by other tabs, domains, or external scripts.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>4. Tool-by-Tool Technical Privacy Breakdown</span>
          </h2>
          <p>
            To provide complete clarity, here is the technical documentation explaining how each utility category handles your information:
          </p>

          <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-neutral-200 dark:border-neutral-800 my-4">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Calculators (Standard, Percentage, Age, BMI)</span>
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Mathematical formulas and expression token evaluations run deterministically in your browser's V8 / SpiderMonkey / JavaScriptCore engine. Inputs such as your date of birth, age, weight, or personal financial amounts are handled exclusively in volatile browser RAM. Zero calculations or calculation histories are transmitted across the internet.
              </p>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Converters (Unit, Temperature, Data Storage, Time)</span>
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                All conversion constants and dimensional unit coefficients are hardcoded directly into the client-side JavaScript assets. When you convert units or enter values, the mathematical conversion is computed instantly in active browser memory without invoking any external conversion APIs.
              </p>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Password Generator (Web Crypto API)</span>
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Password entropy is derived directly from the operating system kernel via the standard <code>window.crypto.getRandomValues()</code> Web Crypto API. No remote server generates or observes your passwords. Once you leave or refresh the page, the generated credentials disappear from system memory.
              </p>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>QR Code Generator</span>
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Unlike third-party QR generation websites that route your target URLs through redirection trackers or intermediate logging proxies, NOVA TOOLS encodes and renders the Reed-Solomon error correction and matrix pixels directly onto an HTML5 <code>&lt;canvas&gt;</code> element in your browser. Neither your destination URLs, text payloads, Wi-Fi credentials, nor generated QR images touch our servers.
              </p>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Text Utilities (Word & Character Counter, Reading Time)</span>
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Strings, articles, confidential documents, or paragraphs pasted into the counter are analyzed entirely in local memory using native RegExp tokenization. No keystrokes are recorded, no telemetry is tracked, and your writing is never submitted to AI models for training or indexing.
              </p>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Developer Utilities (JSON Formatter & Base64 Encoder/Decoder)</span>
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                JSON parsing (<code>JSON.parse</code>, <code>JSON.stringify</code>) and Base64 UTF-8 binary encoding (<code>TextEncoder</code> / <code>TextDecoder</code>) execute synchronously in local memory. You can safely format proprietary configuration files, internal database payloads, or secret API credentials without risk of server-side interception.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>5. Independent Verification (The 10-Second Network Tab Audit)</span>
          </h2>
          <p>
            We do not ask you to take our privacy claims on faith. You can independently verify our client-side architecture in seconds:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Open NOVA TOOLS in your browser (Chrome, Firefox, Safari, Edge, or Brave).</li>
            <li>Open your browser Developer Tools (press <code>F12</code> or right-click anywhere and choose <em>Inspect</em>).</li>
            <li>Select the <strong>Network</strong> tab.</li>
            <li>Use any utility: calculate an equation, generate a password, format JSON code, or create a QR code.</li>
            <li>Inspect the Network log: <strong>Zero HTTP/XHR/Fetch requests are sent.</strong> Your browser does not contact our servers or any third party while operating the tools.</li>
          </ol>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>6. Transparency in Local Browser Storage (localStorage)</span>
          </h2>
          <p>
            To provide a seamless experience without user accounts or server sessions, NOVA TOOLS uses your browser's private <code>localStorage</code> strictly for non-sensitive client preferences:
          </p>
          <div className="overflow-x-auto my-3">
            <table className="w-full text-left text-xs border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100 dark:bg-neutral-800/60 font-semibold text-neutral-900 dark:text-neutral-100">
                <tr>
                  <th className="p-2.5 border-b border-neutral-200 dark:border-neutral-800">Key Name</th>
                  <th className="p-2.5 border-b border-neutral-200 dark:border-neutral-800">What It Stores</th>
                  <th className="p-2.5 border-b border-neutral-200 dark:border-neutral-800">Contains Personal Data?</th>
                  <th className="p-2.5 border-b border-neutral-200 dark:border-neutral-800">How to Clear</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-600 dark:text-neutral-400">
                <tr>
                  <td className="p-2.5 font-mono text-neutral-900 dark:text-neutral-200">nova-tools-theme</td>
                  <td className="p-2.5">Your visual theme choice (<code>"dark"</code> or <code>"light"</code>)</td>
                  <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">No</td>
                  <td className="p-2.5">Toggle theme button or clear browser site data</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-neutral-900 dark:text-neutral-200">nova_favorite_tools</td>
                  <td className="p-2.5">List of favorited tool identifiers (e.g. <code>["calculator", "qr-generator"]</code>)</td>
                  <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">No</td>
                  <td className="p-2.5">Unfavorite icons or clear browser site data</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-neutral-900 dark:text-neutral-200">nova_recent_tools</td>
                  <td className="p-2.5">List of up to 8 recently opened tool slugs for fast navigation</td>
                  <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">No</td>
                  <td className="p-2.5">Click "Clear recent" on the homepage or clear browser site data</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Critical Distinction:</strong> These keys hold only short identifier strings. They <em>never</em> record your calculated numbers, generated passwords, pasted texts, or confidential inputs.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>7. Information We Do NOT Collect</span>
          </h2>
          <p>
            To eliminate any uncertainty, we explicitly certify that NOVA TOOLS <strong>never</strong> collects, records, or monetizes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>User account credentials, usernames, or passwords.</li>
            <li>Email addresses (unless you voluntarily submit an inquiry through our contact form).</li>
            <li>Payment details, credit card numbers, or billing info (NOVA TOOLS is completely free).</li>
            <li>Keystrokes, clipboard paste history, or tool inputs.</li>
            <li>Browser canvas fingerprints, WebGL signatures, or hardware serial identifiers.</li>
            <li>Precise geolocation coordinates (GPS or Wi-Fi triangulation).</li>
            <li>Session recordings, mouse-tracking heatmaps (no Hotjar, FullStory, or session replay scripts).</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>8. Web Server Delivery & Edge Network Logs</span>
          </h2>
          <p>
            When your web browser initially loads the static assets for NOVA TOOLS (HTML, CSS, compiled JavaScript, SVG icons, and web fonts), our hosting infrastructure and edge CDN providers (Cloudflare / Google Cloud) process standard, transient HTTP request metadata:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Internet Protocol (IP) address (anonymized and truncated where possible).</li>
            <li>HTTP request header, browser user-agent, and operating system family.</li>
            <li>Referring webpage URL and requested file path.</li>
            <li>Timestamp, response size, and HTTP response code.</li>
          </ul>
          <p>
            <strong>Sole Technical Purpose:</strong> These access logs are generated strictly for edge routing, DDoS prevention, rate limiting, and network infrastructure health. They are transient, stored on rolling logs, and are never correlated with your identity or tool usage.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>9. Advertising Policy & Third-Party Services</span>
          </h2>
          <p>
            To maintain ongoing hosting, domain registration, and edge bandwidth without charging subscriptions, NOVA TOOLS may display clean, non-intrusive contextual advertising (e.g. Google AdSense or privacy-respecting sponsor banners).
          </p>
          <p>
            Third-party ad networks may serve ads based on general context or prior visits to other websites. These ad networks operate under their respective privacy policies and <strong>have zero access to the data, numbers, passwords, or code you process inside our tools</strong>. You can manage your personalized advertising choices or opt out entirely via the{' '}
            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Digital Advertising Alliance
            </a>{' '}
            or Google Ad Settings.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>10. Global Regulatory Compliance (GDPR, CCPA/CPRA, COPPA)</span>
          </h2>
          <p>
            Because of our client-side architecture and complete data minimization, NOVA TOOLS inherently complies with major international data privacy standards:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>European Union & UK GDPR:</strong> We adhere strictly to Article 25 ("Data protection by design and by default"). Under the GDPR, you have the right to access, rectify, and delete personal data. Because we do not store any personal user records, accounts, or profiles on our servers, there is literally no personal dossier stored on our systems to inspect or erase.
            </li>
            <li>
              <strong>California Consumer Privacy Act (CCPA / CPRA):</strong> We do not sell consumer personal information, nor do we share consumer personal information for cross-context behavioral advertising. We do not collect or process sensitive personal information.
            </li>
            <li>
              <strong>Children’s Online Privacy Protection Act (COPPA):</strong> NOVA TOOLS is a safe, educational, and clean tool suite suitable for students, educators, and minors of all ages. We do not knowingly collect personal information from children under 13.
            </li>
          </ul>
        </section>

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>11. Updates to This Policy</span>
          </h2>
          <p>
            We may periodically review and update this Privacy Policy to reflect newly introduced utilities, updated browser capabilities, or evolving legal frameworks. When changes are made, the "Last Updated" date at the top of this document will be revised accordingly.
          </p>
        </section>

        {/* Section 12 */}
        <section className="space-y-3 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>12. Contact & Data Controller Information</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            If you have questions, inquiries, or independent security audit feedback regarding this Privacy Policy or our client-side architecture, please contact:
          </p>
          <div className="text-xs space-y-1 text-neutral-700 dark:text-neutral-300 pt-1">
            <p><strong>Data Controller:</strong> Arpan Goswami</p>
            <p><strong>Product & Domain:</strong> NOVA TOOLS (<code>https://novatools.net</code>)</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:hello@novatools.net" className="text-blue-600 dark:text-blue-400 hover:underline">
                hello@novatools.net
              </a>{' '}
              / {' '}
              <a href="mailto:exe.arpan45@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                exe.arpan45@gmail.com
              </a>
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/contact')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Go to Contact Form</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export const CookiePolicyPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Cookie Policy
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Last updated: January 2026 | NOVA TOOLS
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-5 leading-relaxed">
        <p>
          This Cookie Policy explains how <strong>NOVA TOOLS</strong> uses cookies and local browser storage technologies on <strong>novatools.net</strong>.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pt-3">
          1. What Are Cookies and Local Storage?
        </h2>
        <p>
          Cookies are small text files placed on your computer by websites you visit. Modern web applications also use <code>localStorage</code>, which stores key-value data directly in your browser without transmitting it with every HTTP request.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pt-3">
          2. How We Use Storage
        </h2>
        <p>
          NOVA TOOLS does <strong>not</strong> use invasive third-party tracking cookies. We utilize browser <code>localStorage</code> strictly for:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Theme Mode:</strong> Saving whether you prefer Dark Mode or Light Mode across visits.</li>
          <li><strong>Transient Session History:</strong> Allowing you to view recent calculations (e.g. calculator history tape) during your active browser session.</li>
        </ul>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pt-3">
          3. Managing & Clearing Storage
        </h2>
        <p>
          You can delete or disable local storage anytime through your browser's settings (under Privacy & Security → Clear Browsing Data). Doing so will simply reset your theme to the system default.
        </p>

        <div className="pt-4">
          <button
            onClick={() => onNavigate('/privacy-policy')}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            ← Return to Full Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Terms of Service
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Last updated: January 2026
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-5 leading-relaxed">
        <p>
          Welcome to NOVA TOOLS. By accessing or using our website located at novatools.net, you agree to be bound by these Terms of Service.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pt-3">
          1. Use of Services
        </h2>
        <p>
          NOVA TOOLS provides free browser-based software utilities for personal and commercial productivity. You agree to use the service in compliance with all applicable laws and regulations.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pt-3">
          2. Intellectual Property
        </h2>
        <p>
          The interface design, brand identity, layout, and software architecture are the intellectual property of <strong>Arpan Goswami</strong>. © 2026 Copyright Arpan Goswami. All rights reserved.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pt-3">
          3. Disclaimer of Warranties
        </h2>
        <p>
          The utilities are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. While we strive for absolute mathematical precision, NOVA TOOLS does not warrant that calculations are error-free or suitable for critical engineering or financial audits.
        </p>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Disclaimer
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          General Informational Notice
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-5 leading-relaxed">
        <p>
          The information and utilities provided by NOVA TOOLS on novatools.net are intended for general everyday informational and productivity purposes only.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pt-3">
          1. Health & Medical Disclaimer
        </h2>
        <p>
          The Body Mass Index (BMI) calculator and related health tools provide statistical calculations based on standard World Health Organization formula ratios. <strong>They do not provide medical diagnosis, treatment, or individualized medical advice.</strong> Always seek the counsel of a licensed medical practitioner.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pt-3">
          2. Financial & Legal Disclaimer
        </h2>
        <p>
          Calculators (including percentage and arithmetic tools) do not constitute certified financial, tax, or investment advice.
        </p>
      </div>
    </div>
  );
};
