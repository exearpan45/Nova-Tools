import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ToolLayout } from './components/ToolLayout';
import { HomePage } from './pages/HomePage';
import { ToolsPage } from './pages/ToolsPage';
import { AboutPage, ContactPage, PrivacyPage, TermsPage, DisclaimerPage, CookiePolicyPage } from './pages/StaticPages';
import { TOOLS_DATA } from './data/toolsData';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { usePWA } from './hooks/usePWA';
import { recordRecentToolSlug } from './utils/storage';
import { isToolInMaintenance } from './config/features';
import { verifyToolRegistry } from './utils/toolHealth';
import { updatePageSeo } from './utils/seo';
import { Share2 } from 'lucide-react';
import { copyToClipboard } from './utils/clipboard';

// Tool Components
import { CalculatorTool } from './tools/CalculatorTool';
import { PercentageCalculatorTool } from './tools/PercentageCalculatorTool';
import { AgeCalculatorTool } from './tools/AgeCalculatorTool';
import { BmiCalculatorTool } from './tools/BmiCalculatorTool';
import { UnitConverterTool } from './tools/UnitConverterTool';
import { TemperatureConverterTool } from './tools/TemperatureConverterTool';
import { DataConverterTool } from './tools/DataConverterTool';
import { TimeConverterTool } from './tools/TimeConverterTool';
import { PasswordGeneratorTool } from './tools/PasswordGeneratorTool';
import { QrGeneratorTool } from './tools/QrGeneratorTool';
import { WordCounterTool } from './tools/WordCounterTool';
import { CharacterCounterTool } from './tools/CharacterCounterTool';
import { CaseConverterTool } from './tools/CaseConverterTool';
import { JsonFormatterTool } from './tools/JsonFormatterTool';
import { Base64Tool } from './tools/Base64Tool';
import { DiscountCalculatorTool } from './tools/DiscountCalculatorTool';
import { UuidGeneratorTool } from './tools/UuidGeneratorTool';
import { TimestampConverterTool } from './tools/TimestampConverterTool';
import { TextSorterTool } from './tools/TextSorterTool';
import { UrlEncoderTool } from './tools/UrlEncoderTool';

const TOOL_COMPONENTS: Record<string, React.ReactNode> = {
  calculator: <CalculatorTool />,
  'percentage-calculator': <PercentageCalculatorTool />,
  'age-calculator': <AgeCalculatorTool />,
  'bmi-calculator': <BmiCalculatorTool />,
  'unit-converter': <UnitConverterTool />,
  'temperature-converter': <TemperatureConverterTool />,
  'data-converter': <DataConverterTool />,
  'time-converter': <TimeConverterTool />,
  'password-generator': <PasswordGeneratorTool />,
  'qr-generator': <QrGeneratorTool />,
  'word-counter': <WordCounterTool />,
  'character-counter': <CharacterCounterTool />,
  'case-converter': <CaseConverterTool />,
  'json-formatter': <JsonFormatterTool />,
  base64: <Base64Tool />,
  'base64-tool': <Base64Tool />,
  'discount-calculator': <DiscountCalculatorTool />,
  'uuid-generator': <UuidGeneratorTool />,
  'timestamp-converter': <TimestampConverterTool />,
  'text-sorter': <TextSorterTool />,
  'url-encoder': <UrlEncoderTool />
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const { isOnline, canInstall, hasUpdate, installApp } = usePWA();

  const handleShareCurrentPage = async () => {
    const fullUrl = window.location.href;
    const currentToolSlug = currentPath.startsWith('/tools/') ? currentPath.replace('/tools/', '') : null;
    const tool = currentToolSlug ? TOOLS_DATA.find((t) => t.slug === currentToolSlug) : null;
    
    const title = tool ? `${tool.name} — NOVA TOOLS` : document.title || 'NOVA TOOLS';
    const text = tool ? (tool.seoDescription || tool.description) : 'Free, fast, simple browser tools for everyday tasks.';

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: fullUrl
        });
        return;
      } catch (err: any) {
        // If aborted by user, exit quietly; otherwise fallback to clipboard
        if (err?.name === 'AbortError') return;
      }
    }

    // Fallback to clipboard
    const copied = await copyToClipboard(fullUrl);
    if (copied) {
      setShareFeedback('Link copied!');
      setTimeout(() => setShareFeedback(null), 2000);
    }
  };

  // Internal Tool Health Check (Item 31)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const check = verifyToolRegistry(Object.keys(TOOL_COMPONENTS));
      if (!check.passed) {
        console.warn('[NOVA TOOLS Health Warning]', check.errors);
      }
    }
  }, []);

  // Global Keyboard Shortcuts (Item 4 & Item 5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update Page Title, Canonical, Meta, and Scroll on Route Change
  useEffect(() => {
    window.scrollTo(0, 0);

    let title = 'NOVA TOOLS — Simple tools. Done well.';
    let metaDesc = 'Free, fast, simple tools for everyday tasks. Calculations, conversions, text tools, developer utilities and more.';
    let canonicalPath = '/';
    let activeTool = undefined;

    if (currentPath === '/') {
      title = 'NOVA TOOLS — Simple tools. Done well.';
      metaDesc = 'Free, fast, simple tools for everyday tasks. Calculations, conversions, text tools, developer utilities and more.';
      canonicalPath = '/';
    } else if (currentPath === '/tools') {
      title = 'All Tools — NOVA TOOLS';
      metaDesc = 'Browse the complete collection of free, fast, client-side tools and browser utilities on NOVA TOOLS.';
      canonicalPath = '/tools';
    } else if (currentPath.startsWith('/tools/')) {
      const rawSlug = currentPath.replace('/tools/', '');
      const slug = rawSlug === 'base64-tool' ? 'base64' : rawSlug;
      recordRecentToolSlug(slug);
      const tool = TOOLS_DATA.find((t) => t.slug === slug);
      if (tool) {
        activeTool = tool;
        title = tool.seoTitle ? `${tool.seoTitle} — NOVA TOOLS` : `${tool.name} — NOVA TOOLS`;
        metaDesc = tool.seoDescription || tool.description;
        canonicalPath = `/tools/${tool.slug}`;
      } else {
        title = 'Tool Not Found — NOVA TOOLS';
        canonicalPath = currentPath;
      }
    } else if (currentPath === '/about') {
      title = 'About — NOVA TOOLS';
      metaDesc = 'Learn about NOVA TOOLS, created by Arpan Goswami to provide fast, privacy-focused browser utilities.';
      canonicalPath = '/about';
    } else if (currentPath === '/contact') {
      title = 'Contact Us — NOVA TOOLS';
      metaDesc = 'Contact NOVA TOOLS for bug reports, feedback, tool suggestions, or general inquiries.';
      canonicalPath = '/contact';
    } else if (currentPath === '/privacy' || currentPath === '/privacy-policy') {
      title = 'Privacy Policy — NOVA TOOLS';
      metaDesc = 'Our strict privacy commitment: zero tracking, all calculations happen locally in your browser.';
      canonicalPath = '/privacy-policy';
    } else if (currentPath === '/cookie-policy') {
      title = 'Cookie Policy — NOVA TOOLS';
      metaDesc = 'Information regarding cookies, local storage, and service worker caching on NOVA TOOLS.';
      canonicalPath = '/cookie-policy';
    } else if (currentPath === '/terms') {
      title = 'Terms of Service — NOVA TOOLS';
      metaDesc = 'Terms of service, intellectual property, and usage guidelines for NOVA TOOLS.';
      canonicalPath = '/terms';
    } else if (currentPath === '/disclaimer') {
      title = 'Disclaimer — NOVA TOOLS';
      metaDesc = 'Informational and medical screening disclaimers for NOVA TOOLS utilities.';
      canonicalPath = '/disclaimer';
    }

    updatePageSeo({
      title,
      description: metaDesc,
      canonicalPath,
      tool: activeTool
    });
  }, [currentPath]);

  // Navigate function with HTML5 pushState
  const handleNavigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Route Rendering
  const renderContent = () => {
    if (currentPath === '/') {
      return <HomePage onNavigate={handleNavigate} onOpenSearch={() => setIsSearchOpen(true)} />;
    }

    if (currentPath === '/tools') {
      return <ToolsPage onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/tools/')) {
      const rawSlug = currentPath.replace('/tools/', '');
      const slug = rawSlug === 'base64-tool' ? 'base64' : rawSlug;
      const tool = TOOLS_DATA.find((t) => t.slug === slug);

      if (tool) {
        if (isToolInMaintenance(slug)) {
          return (
            <ToolLayout tool={tool} onNavigate={handleNavigate}>
              <div className="py-12 text-center space-y-2">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  This tool is temporarily unavailable.
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  We are performing routine maintenance. Please check back shortly.
                </p>
              </div>
            </ToolLayout>
          );
        }

        if (TOOL_COMPONENTS[tool.id]) {
          return (
            <ToolLayout tool={tool} onNavigate={handleNavigate}>
              {TOOL_COMPONENTS[tool.id]}
            </ToolLayout>
          );
        }
      }

      // Tool 404
      return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Tool Not Found
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            The requested utility could not be found or may have been moved.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleNavigate('/tools')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
            >
              Browse All Tools
            </button>
          </div>
        </div>
      );
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/privacy' || currentPath === '/privacy-policy') {
      return <PrivacyPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/cookie-policy') {
      return <CookiePolicyPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/terms') {
      return <TermsPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/disclaimer') {
      return <DisclaimerPage onNavigate={handleNavigate} />;
    }

    // Generic 404
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          404 - Page Not Found
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          The page you are looking for does not exist.
        </p>
        <div className="pt-2">
          <button
            onClick={() => handleNavigate('/')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#121214] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-150">
          {/* Top Navigation */}
          <Navbar
            currentPath={currentPath}
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
            canInstall={canInstall}
            onInstallApp={installApp}
            isOnline={isOnline}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {renderContent()}
          </main>

          {/* Site Footer */}
          <Footer onNavigate={handleNavigate} />

          {/* Search Modal */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectTool={(slug) => {
              setIsSearchOpen(false);
              handleNavigate(`/tools/${slug}`);
            }}
            onBrowseAll={() => {
              setIsSearchOpen(false);
              handleNavigate('/tools');
            }}
          />

          {/* PWA Update Banner (Item 50) */}
          {hasUpdate && (
            <div
              id="pwa-update-banner"
              className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs shadow-lg border border-neutral-700/60 dark:border-neutral-200"
            >
              <span>New version available —</span>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="font-semibold underline hover:opacity-80 cursor-pointer"
              >
                Refresh
              </button>
              <span className="text-neutral-500 dark:text-neutral-400">|</span>
              <button
                type="button"
                id="pwa-share-tool-btn"
                onClick={handleShareCurrentPage}
                className="inline-flex items-center gap-1 font-medium hover:opacity-80 transition-opacity cursor-pointer text-blue-400 dark:text-blue-600"
                title="Share current tool URL"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareFeedback || 'Share'}</span>
              </button>
            </div>
          )}
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}
