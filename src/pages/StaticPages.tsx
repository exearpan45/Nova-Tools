import React, { useState } from 'react';
import {
  Mail, ShieldCheck, FileText, Info, AlertTriangle, Lock, Eye,
  Cpu, Database, Copy, ExternalLink, Sparkles, ArrowRight, CheckCircle2,
  Calculator, Image, FileImage, Code2, Type, GraduationCap, Globe,
  Palette, Wrench, Shield, BookOpen, Cookie, MessageSquare, ChevronRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { copyToClipboard } from '../utils/clipboard';
import { SUITE_LIST } from '../data/suitesData';

interface StaticPageProps {
  onNavigate: (path: string) => void;
}

const UPDATED = 'October 12, 2026';
const EMAIL = 'exe.arpan45@gmail.com';
const SITE = 'https://nova-tools2.pages.dev/';

const pageClass = 'max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10 animate-page-enter';
const headingClass = 'text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white';
const bodyClass = 'text-sm leading-7 text-slate-600 dark:text-slate-300';
const cardClass = 'rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 p-4 sm:p-5 shadow-sm';

const PageHero: React.FC<{ eyebrow: string; title: string; subtitle: string; icon: React.ReactNode }> = ({ eyebrow, title, subtitle, icon }) => (
  <header className="relative overflow-hidden rounded-3xl border border-violet-200/70 dark:border-violet-500/20 bg-gradient-to-br from-white via-violet-50/70 to-cyan-50/70 dark:from-[#10182b] dark:via-[#15142c] dark:to-[#0b1b2a] p-6 sm:p-9">
    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
    <div className="relative flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300">{icon}</div>
      <div className="min-w-0 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">{eyebrow}</p>
        <h1 className={headingClass}>{title}</h1>
        <p className="max-w-3xl text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">{subtitle}</p>
      </div>
    </div>
  </header>
);

const Section: React.FC<{ title: string; children: React.ReactNode; description?: string }> = ({ title, children, description }) => (
  <section className="space-y-3">
    <div className="space-y-1">
      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      {description && <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
    {children}
  </section>
);

const Point: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className={cardClass}>
    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{children}</p>
  </div>
);

const PolicyText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className={bodyClass}>{children}</p>
);

const UpdatedNote = () => <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: {UPDATED} · NOVA TOOLS</p>;

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => (
  <main className={pageClass}>
    <PageHero eyebrow="About the project" title="Useful online tools, without the unnecessary complexity." subtitle="NOVA TOOLS is an independent collection of browser-based utilities built to make everyday calculations, file tasks, text work, and developer workflows simpler." icon={<Sparkles className="h-5 w-5" />} />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Point title="Built for practical tasks">Focused utilities with clear inputs, understandable outputs, and straightforward workflows.</Point>
      <Point title="Browser-first processing">Many tools process the data you enter directly in your browser instead of uploading it to a NOVA TOOLS application server.</Point>
      <Point title="Made for different screens">Responsive layouts support phones, tablets, laptops, and desktop browsers.</Point>
    </div>
    <Section title="Explore the tool collection" description="Browse by purpose to find a tool for your task. Each tool page includes a description and, where available, usage steps, examples, and frequently asked questions.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SUITE_LIST.map((suite) => {
          const Icon = suite.id === 'image' ? Image : suite.id === 'pdf' ? FileText : suite.id === 'text' ? Type : suite.id === 'developer' ? Code2 : suite.id === 'student' ? GraduationCap : suite.id === 'calculators' ? Calculator : suite.id === 'web' ? Globe : suite.id === 'design' ? Palette : suite.id === 'security' ? ShieldCheck : suite.id === 'data' ? Database : suite.id === 'writing' ? BookOpen : Wrench;
          return (
            <button key={suite.id} type="button" onClick={() => onNavigate('/tools?suite=' + suite.id)} className={cardClass + ' group text-left transition-all hover:-translate-y-0.5 hover:border-violet-300 dark:hover:border-violet-500/40'}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: suite.accentBg.includes('bg-') ? suite.accentColor + '18' : suite.accentColor + '18', color: suite.accentColor }}><Icon className="h-5 w-5" /></span>
              <span className="mt-3 flex items-center justify-between gap-2 text-sm font-bold text-slate-900 dark:text-white">{suite.name}<ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" /></span>
              <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{suite.description}</span>
            </button>
          );
        })}
      </div>
    </Section>
    <Section title="Our approach">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Point title="Clarity over clutter">Each utility should make its purpose easy to understand. We aim to keep the interface focused on the task rather than burying it beneath unnecessary steps.</Point>
        <Point title="Privacy-aware design">Where a feature can run locally, the application is designed to perform the work in the browser. Third-party analytics, advertising, hosting, and browser behaviour are described in the Privacy and Cookie policies.</Point>
        <Point title="Useful explanations">Tool pages are intended to explain what a utility does, how to use it, and any important limitations instead of presenting an unexplained input box.</Point>
        <Point title="Continuous improvement">Feedback and clear bug reports help identify broken interactions, confusing instructions, and useful additions for future updates.</Point>
      </div>
    </Section>
    <Section title="Project information">
      <div className={cardClass + ' space-y-2'}>
        <p className={bodyClass}><strong className="text-slate-900 dark:text-white">Website:</strong> <a className="text-violet-600 hover:underline dark:text-violet-300" href={SITE}>{SITE}</a></p>
        <p className={bodyClass}><strong className="text-slate-900 dark:text-white">Created and maintained by:</strong> Arpan Goswami</p>
        <p className={bodyClass}><strong className="text-slate-900 dark:text-white">Copyright:</strong> © 2026 Copyright Arpan Goswami. All rights reserved.</p>
      </div>
    </Section>
    <div className="flex flex-wrap gap-3">
      <button onClick={() => onNavigate('/tools')} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">Explore all tools <ArrowRight className="h-4 w-4" /></button>
      <button onClick={() => onNavigate('/contact')} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Contact the creator</button>
    </div>
  </main>
);

export const ContactPage: React.FC<StaticPageProps> = () => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const handleCopyEmail = async () => {
    const ok = await copyToClipboard(EMAIL);
    if (ok) {
      setCopied(true);
      showToast('Email address copied to clipboard', 'copied');
      window.setTimeout(() => setCopied(false), 1800);
    }
  };
  const topics = [
    { title: 'Report a bug', subject: '[Bug Report] NOVA TOOLS', description: 'Tell us which tool failed, what you expected, what happened instead, and your browser/device.' },
    { title: 'Suggest a tool', subject: '[Tool Suggestion] NOVA TOOLS', description: 'Describe the task you want to complete and the inputs and outputs that would be useful.' },
    { title: 'Share feedback', subject: '[Feedback] NOVA TOOLS', description: 'Help improve accessibility, clarity, mobile usability, and the overall experience.' },
    { title: 'General enquiry', subject: '[General Enquiry] NOVA TOOLS', description: 'Questions about the website, content, technical behaviour, or intellectual property.' },
  ];
  return (
    <main className={pageClass}>
      <PageHero eyebrow="Support & feedback" title="Contact NOVA TOOLS" subtitle="Found a bug, have an idea, or need to ask a question? Choose a topic below or email the maintainer directly." icon={<Mail className="h-5 w-5" />} />
      <section className={cardClass + ' flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'}>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email contact</p>
          <a href={'mailto:' + EMAIL} className="mt-1 block break-all text-lg sm:text-xl font-bold text-violet-600 hover:underline dark:text-violet-300">{EMAIL}</a>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Email opens in your chosen mail application. Please avoid including passwords, private documents, or other sensitive information in a support request.</p>
        </div>
        <button onClick={handleCopyEmail} type="button" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><Copy className="h-4 w-4" />{copied ? 'Copied' : 'Copy email'}</button>
      </section>
      <Section title="How can we help?" description="Choose a topic to open a pre-filled email. Add the details needed to understand your request.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((topic) => <a key={topic.title} href={'mailto:' + EMAIL + '?subject=' + encodeURIComponent(topic.subject)} className={cardClass + ' group block hover:border-violet-300 dark:hover:border-violet-500/40'}>
            <span className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-slate-900 dark:text-white">{topic.title}</span><ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-violet-500" /></span>
            <span className="mt-2 block text-sm leading-6 text-slate-500 dark:text-slate-400">{topic.description}</span>
          </a>)}
        </div>
      </Section>
      <Section title="Helpful details to include">
        <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />The name and link of the tool you were using.</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />The steps that led to the issue and the result you expected.</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />Your browser and device type, plus any error message that appeared.</li>
        </ul>
        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">Messages are reviewed as time permits. A response time is not guaranteed.</p>
      </Section>
    </main>
  );
};

export const PrivacyPage: React.FC<StaticPageProps> = ({ onNavigate }) => (
  <main className={pageClass}>
    <PageHero eyebrow="Your information" title="Privacy Policy" subtitle="This policy explains what NOVA TOOLS processes locally, what browser preferences may be saved, and how third-party services such as analytics and advertising fit into the experience." icon={<ShieldCheck className="h-5 w-5" />} />
    <UpdatedNote />
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
      <p className="flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200"><Lock className="h-4 w-4" /> Browser-first processing</p>
      <p className="mt-2 text-sm leading-6 text-emerald-950/80 dark:text-emerald-100/80">Many utilities perform calculations or file/text transformations on your device. This does not mean every request made while visiting the website is local: the site also loads hosting resources and third-party analytics or advertising scripts.</p>
    </div>
    <Section title="1. Information you enter into tools">
      <PolicyText>For tools implemented to run in the browser, calculations and transformations are performed on your device and the entered content is not intentionally uploaded to a NOVA TOOLS application server. This can include numbers, text, JSON, and supported file operations. Processing details can differ by tool, so check the individual tool page and avoid using any online utility for highly confidential material unless you have verified its behaviour.</PolicyText>
      <PolicyText>Normal website traffic still requires network requests to retrieve the site and its assets. Your hosting provider and network may process technical request information as part of delivering and securing the website.</PolicyText>
    </Section>
    <Section title="2. Preferences stored in your browser">
      <PolicyText>NOVA TOOLS may use browser local storage to remember interface preferences such as theme, favourites, recently used tools, and local ratings. This information is stored in the browser profile on your device and is not automatically shared between devices. Clearing site data in your browser can remove these preferences.</PolicyText>
    </Section>
    <Section title="3. Analytics, advertising, and third parties">
      <PolicyText>The website loads Google Analytics and Google AdSense scripts. These services may process information such as device/browser details, approximate location derived from network information, page visits, advertising interactions, identifiers, or cookie data, depending on the service configuration, your settings, and applicable consent requirements. Google and other providers process data under their own policies.</PolicyText>
      <PolicyText>Third-party scripts may make requests directly to their providers. NOVA TOOLS does not control every data practice of those external services. Review the providers’ current privacy and advertising controls if you want more detail about their processing.</PolicyText>
    </Section>
    <Section title="4. Cookies and similar technologies">
      <PolicyText>The application uses local storage for selected preferences. Google Analytics, advertising services, the browser, or the hosting layer may use cookies or similar technologies. The exact technologies and duration can vary with browser settings, consent choices, and third-party configuration. See the Cookie Policy for a focused explanation.</PolicyText>
      <button onClick={() => onNavigate('/cookie-policy')} className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300"><Cookie className="h-4 w-4" /> Read the Cookie Policy <ArrowRight className="h-4 w-4" /></button>
    </Section>
    <Section title="5. Data retention and your choices">
      <PolicyText>Preferences saved in local storage remain until you clear them or the browser removes them. Technical logs and third-party data are handled according to the relevant hosting or service provider’s retention practices. You can clear site data in browser settings, adjust available ad/analytics controls, or use browser privacy features. Blocking scripts may affect some site functions or advertising.</PolicyText>
    </Section>
    <Section title="6. Children and sensitive information">
      <PolicyText>NOVA TOOLS is a general-purpose utility website, not a service designed to collect sensitive personal information. Do not send passwords, confidential files, health records, or other sensitive data by email or through features unless you have independently confirmed that the feature is suitable for that data.</PolicyText>
    </Section>
    <Section title="7. Contact">
      <PolicyText>For privacy questions, contact the site maintainer at <a className="font-semibold text-violet-600 hover:underline dark:text-violet-300" href={'mailto:' + EMAIL}>{EMAIL}</a>. NOVA TOOLS may update this policy when the site or its services change. The updated date above indicates the latest editorial revision.</PolicyText>
    </Section>
  </main>
);

export const CookiePolicyPage: React.FC<StaticPageProps> = ({ onNavigate }) => (
  <main className={pageClass}>
    <PageHero eyebrow="Browser storage explained" title="Cookie Policy" subtitle="Learn the difference between cookies, local storage, and third-party scripts that may be used while visiting NOVA TOOLS." icon={<Cookie className="h-5 w-5" />} />
    <UpdatedNote />
    <Section title="What these technologies do">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Point title="Cookies">Small pieces of data a website or third-party service may store in your browser. They can support functionality, measurement, advertising, or preferences.</Point>
        <Point title="Local storage">NOVA TOOLS uses browser local storage for selected preferences such as theme, favourites, recent tools, and local ratings. It is separate from cookies and usually remains until cleared.</Point>
        <Point title="Third-party scripts">Google Analytics and Google AdSense are loaded by the site. Depending on their settings and your consent choices, these services may use cookies or similar identifiers.</Point>
      </div>
    </Section>
    <Section title="Does NOVA TOOLS use cookies?">
      <PolicyText>The application’s own preferences are primarily saved through local storage, rather than a first-party tracking cookie. However, third-party analytics and advertising scripts are present and may use cookies or similar technologies. For that reason, we do not claim that no cookies or tracking technologies can ever be used on the site.</PolicyText>
    </Section>
    <Section title="How to manage your choices">
      <PolicyText>You can clear cookies and site data through your browser’s privacy settings. Many browsers also allow you to block third-party cookies or clear data for one website. Google provides separate controls for some Google account, advertising, and analytics settings. The exact options depend on your browser, region, and whether you are signed in to a provider.</PolicyText>
      <PolicyText>Blocking cookies or third-party scripts can change how analytics, advertising, or some embedded features work. Your browser’s local storage can usually be removed through the same site-data settings.</PolicyText>
    </Section>
    <Section title="Related policy">
      <button onClick={() => onNavigate('/privacy-policy')} className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300"><ShieldCheck className="h-4 w-4" /> Read the full Privacy Policy <ArrowRight className="h-4 w-4" /></button>
    </Section>
  </main>
);

export const TermsPage: React.FC<StaticPageProps> = () => (
  <main className={pageClass}>
    <PageHero eyebrow="Using the website" title="Terms of Service" subtitle="These terms describe the basic conditions for accessing and using the free utilities provided by NOVA TOOLS." icon={<FileText className="h-5 w-5" />} />
    <UpdatedNote />
    <Section title="1. Use of the tools"><PolicyText>NOVA TOOLS provides general-purpose browser utilities for everyday, educational, and productivity tasks. You are responsible for how you use the results and for ensuring that your use complies with applicable laws and third-party rights.</PolicyText></Section>
    <Section title="2. Accuracy and availability"><PolicyText>We aim to make tools useful and reliable, but features may change, be unavailable, or contain errors. You should independently verify outputs before relying on them for important decisions, production systems, safety-critical work, or professional advice.</PolicyText></Section>
    <Section title="3. Intellectual property"><PolicyText>Unless otherwise stated, NOVA TOOLS branding, original site content, interface design, and original software are maintained by Arpan Goswami. Do not misrepresent the site or remove applicable notices. Third-party libraries and assets remain subject to their respective licenses.</PolicyText></Section>
    <Section title="4. No warranty"><PolicyText>The website and its tools are provided on an “as available” basis, without a guarantee that every feature will be uninterrupted, error-free, or suitable for a particular purpose, to the extent permitted by applicable law.</PolicyText></Section>
    <Section title="5. Limitation and changes"><PolicyText>To the extent permitted by applicable law, NOVA TOOLS is not responsible for losses arising from reliance on unverified outputs or temporary service interruptions. Nothing in these terms excludes liability that cannot legally be excluded. These terms may be updated as the project evolves.</PolicyText></Section>
    <p className={bodyClass}>Questions about these terms? Contact <a className="text-violet-600 hover:underline dark:text-violet-300" href={'mailto:' + EMAIL}>{EMAIL}</a>.</p>
  </main>
);

export const DisclaimerPage: React.FC<StaticPageProps> = () => (
  <main className={pageClass}>
    <PageHero eyebrow="Important information" title="Disclaimer" subtitle="NOVA TOOLS provides general-purpose calculations and utilities. Review these limitations before relying on any output for a consequential decision." icon={<AlertTriangle className="h-5 w-5" />} />
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
      <p className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200"><Info className="h-4 w-4" /> Verify important results independently</p>
      <p className="mt-2 text-sm leading-6 text-amber-950/80 dark:text-amber-100/80">Tools are designed to assist with routine tasks, not replace professional judgement, official records, or independent validation.</p>
    </div>
    <UpdatedNote />
    <Section title="General information"><PolicyText>Descriptions, calculations, conversions, generated content, and other outputs are provided for general informational and productivity purposes. Although we work to keep the tools dependable, we do not guarantee that every output will be accurate, complete, current, or suitable for your particular circumstances.</PolicyText></Section>
    <Section title="Health and wellness"><PolicyText>Any body-mass-index or wellness-related calculator is educational and informational only. It does not diagnose a condition, assess an individual’s full health, or replace a qualified healthcare professional. Do not use an online result as the sole basis for medical, nutrition, or treatment decisions.</PolicyText></Section>
    <Section title="Financial, tax, and business calculations"><PolicyText>Arithmetic, percentage, discount, profit, or other financial calculations are general-purpose aids, not financial, investment, accounting, or tax advice. Check assumptions, rounding, applicable rules, and results with an appropriate professional before making significant decisions.</PolicyText></Section>
    <Section title="Scientific, engineering, and technical work"><PolicyText>Unit converters, data tools, code utilities, and related features are intended for convenience. Independently verify critical values, units, algorithms, generated code, and security-sensitive outputs before using them in production, laboratory, engineering, or safety-critical environments.</PolicyText></Section>
    <Section title="Files, generated content, and security"><PolicyText>Review generated files and outputs before sharing or using them. A browser-based password generator or hashing utility is not a complete security system, and no tool can guarantee that a device, browser, or copied output is secure. Keep backups of important source files before performing destructive edits or conversions.</PolicyText></Section>
    <Section title="External services and links"><PolicyText>The website may load third-party analytics and advertising services or link to external websites. NOVA TOOLS does not control all external content, availability, or privacy practices. Review the relevant provider’s terms and policies when using those services.</PolicyText></Section>
  </main>
);
