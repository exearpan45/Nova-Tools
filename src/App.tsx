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
  'base64-tool': <Base64Tool />
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const { isOnline, canInstall, hasUpdate, installApp } = usePWA();

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

  // Update Page Title and Scroll on Route Change
  useEffect(() => {
    window.scrollTo(0, 0);

    let title = 'NOVA TOOLS | Free Fast Browser Utilities';
    let metaDesc = 'Simple, fast browser utilities for everyday tasks. 100% free, client-side, and private.';

    if (currentPath === '/') {
      title = 'NOVA TOOLS | Free Fast Browser Utilities';
    } else if (currentPath === '/tools') {
      title = 'All Tools - NOVA TOOLS';
      metaDesc = 'Browse the complete collection of free, client-side tools and utilities on NOVA TOOLS.';
    } else if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '');
      recordRecentToolSlug(slug);
      const tool = TOOLS_DATA.find((t) => t.slug === slug);
      if (tool) {
        title = `${tool.name} - NOVA TOOLS`;
        metaDesc = tool.description;
      }
    } else if (currentPath === '/about') {
      title = 'About Us - NOVA TOOLS';
      metaDesc = 'Learn about NOVA TOOLS, created by Arpan Goswami to provide fast, privacy-focused browser utilities.';
    } else if (currentPath === '/contact') {
      title = 'Contact - NOVA TOOLS';
      metaDesc = 'Contact the NOVA TOOLS team with suggestions, feedback, or bug reports.';
    } else if (currentPath === '/privacy' || currentPath === '/privacy-policy') {
      title = 'Privacy Policy - NOVA TOOLS';
      metaDesc = 'Our strict privacy commitment: zero tracking, all calculations happen locally in your browser.';
    } else if (currentPath === '/cookie-policy') {
      title = 'Cookie Policy - NOVA TOOLS';
      metaDesc = 'Information regarding cookies and local browser storage on NOVA TOOLS.';
    } else if (currentPath === '/terms') {
      title = 'Terms of Service - NOVA TOOLS';
      metaDesc = 'Terms of service and fair usage guidelines for NOVA TOOLS.';
    } else if (currentPath === '/disclaimer') {
      title = 'Disclaimer - NOVA TOOLS';
      metaDesc = 'Informational and medical disclaimers for NOVA TOOLS utilities.';
    }

    document.title = title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', metaDesc);
    }
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
      const slug = currentPath.replace('/tools/', '');
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
              className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs shadow-lg border border-neutral-700/60 dark:border-neutral-200"
            >
              <span>New version available —</span>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="font-semibold underline hover:opacity-80 cursor-pointer"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}
