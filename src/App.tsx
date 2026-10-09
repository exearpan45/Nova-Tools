import React from 'react';
import { NovaProvider, useNova } from './context/NovaContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SmartDropZone } from './components/SmartDropZone';

// Pages
import { HomePage } from './pages/HomePage';
import { ToolsPage } from './pages/ToolsPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { RecentPage } from './pages/RecentPage';
import { SettingsPage } from './pages/SettingsPage';
import {
  AboutPage, ContactPage, PrivacyPage, TermsPage, DisclaimerPage, CookiePolicyPage
} from './pages/StaticPages';

// Data
import { TOOLS_BY_SLUG } from './data/toolsData';

const AppContent: React.FC = () => {
  const { currentPath, navigate, sidebarCollapsed } = useNova();

  // Router resolver
  const renderCurrentView = () => {
    // 1. Tool detail page: /tools/:slug
    if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '').split('?')[0].split('#')[0];
      const tool = TOOLS_BY_SLUG.get(slug);
      if (tool) {
        return <ToolDetailPage tool={tool} />;
      }
      // Fallback if not found
      return <ToolsPage />;
    }

    // 2. Main routes
    switch (currentPath.split('?')[0]) {
      case '/':
        return <HomePage />;
      case '/tools':
        return <ToolsPage />;
      case '/workflows':
        return <WorkflowsPage />;
      case '/favorites':
        return <FavoritesPage />;
      case '/recent':
        return <RecentPage />;
      case '/settings':
        return <SettingsPage />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage onNavigate={navigate} />;
      case '/privacy':
      case '/privacy-policy':
        return <PrivacyPage onNavigate={navigate} />;
      case '/terms':
        return <TermsPage onNavigate={navigate} />;
      case '/disclaimer':
        return <DisclaimerPage onNavigate={navigate} />;
      case '/cookie-policy':
        return <CookiePolicyPage onNavigate={navigate} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-row bg-slate-50 dark:bg-[#080D1C] text-slate-900 dark:text-[#F5F7FF] transition-colors overflow-x-hidden selection:bg-[#7657FF]/30 selection:text-[#00D9FF]">
      {/* Desktop / Tablet Sidebar */}
      <Sidebar />

      {/* Main Content Column */}
      <div
        className={`flex-1 flex flex-col min-w-0 w-full transition-all duration-300 ${
          sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Navbar />

        <main
          className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 md:py-10"
          style={{ paddingBottom: 'calc(76px + env(safe-area-inset-bottom, 0px))' }}
        >
          {renderCurrentView()}
        </main>

        <Footer />
      </div>

      {/* Phone Bottom Navigation */}
      <MobileNav />

      {/* Global Command Center Search */}
      <GlobalSearchModal />

      {/* Global Drag & Drop File Detection */}
      <SmartDropZone />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <NovaProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </NovaProvider>
    </ErrorBoundary>
  );
}

export default App;
