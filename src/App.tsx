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
import { MiniAppsManager } from './components/MiniAppsManager';
import { ExperienceModals } from './components/ExperienceModals';

// Route-level code splitting keeps the initial workspace small on slower devices.
const HomePage = React.lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const WorkspacePage = React.lazy(() => import('./pages/WorkspacePage').then((module) => ({ default: module.WorkspacePage })));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage').then((module) => ({ default: module.CategoriesPage })));
const FileStudioPage = React.lazy(() => import('./pages/FileStudioPage').then((module) => ({ default: module.FileStudioPage })));
const DeveloperLabPage = React.lazy(() => import('./pages/DeveloperLabPage').then((module) => ({ default: module.DeveloperLabPage })));
const DesignStudioPage = React.lazy(() => import('./pages/DesignStudioPage').then((module) => ({ default: module.DesignStudioPage })));
const QrStudioPage = React.lazy(() => import('./pages/QrStudioPage').then((module) => ({ default: module.QrStudioPage })));
const FocusPage = React.lazy(() => import('./pages/FocusPage').then((module) => ({ default: module.FocusPage })));
const LearningHubPage = React.lazy(() => import('./pages/LearningHubPage').then((module) => ({ default: module.LearningHubPage })));
const BrowserUtilitiesPage = React.lazy(() => import('./pages/BrowserUtilitiesPage').then((module) => ({ default: module.BrowserUtilitiesPage })));
const ChangelogPage = React.lazy(() => import('./pages/ChangelogPage').then((module) => ({ default: module.ChangelogPage })));
const ToolsPage = React.lazy(() => import('./pages/ToolsPage').then((module) => ({ default: module.ToolsPage })));
const ToolDetailPage = React.lazy(() => import('./pages/ToolDetailPage').then((module) => ({ default: module.ToolDetailPage })));
const WorkflowsPage = React.lazy(() => import('./pages/WorkflowsPage').then((module) => ({ default: module.WorkflowsPage })));
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage').then((module) => ({ default: module.FavoritesPage })));
const RecentPage = React.lazy(() => import('./pages/RecentPage').then((module) => ({ default: module.RecentPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
import {
  AboutPage, ContactPage, PrivacyPage, TermsPage, DisclaimerPage, CookiePolicyPage
} from './pages/StaticPages';
import { OfflineIndicator } from './components/OfflineIndicator';

// Data
import { TOOLS_BY_SLUG } from './data/toolsData';
import { normalizeRoutePath } from './utils/routing';

const RouteLoadingFallback: React.FC = () => (
  <div className="flex min-h-[42vh] items-center justify-center" role="status" aria-live="polite">
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-6 py-7 text-center shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" aria-hidden="true" />
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Opening NOVA workspace…</span>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { currentPath, navigate, sidebarCollapsed } = useNova();

  // Normalize pathname cleanly for static directory routes
  const normalizedPath = normalizeRoutePath(currentPath);

  // Router resolver
  const renderCurrentView = () => {
    // 1. Tool detail page: /tools/:slug
    if (normalizedPath.startsWith('/tools/')) {
      const slug = normalizedPath.slice('/tools/'.length);
      const tool = TOOLS_BY_SLUG.get(slug);
      if (tool) {
        return <ToolDetailPage tool={tool} />;
      }
      return <ToolsPage />;
    }

    // 2. Main & Studio routes
    switch (normalizedPath) {
      case '/':
        return <HomePage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/workspace':
        return <WorkspacePage />;
      case '/clipboard-vault':
        return <WorkspacePage initialTab="vault" />;
      case '/categories':
        return <CategoriesPage />;
      case '/file-studio':
        return <FileStudioPage />;
      case '/developer-lab':
        return <DeveloperLabPage />;
      case '/design-studio':
        return <DesignStudioPage />;
      case '/qr-studio':
        return <QrStudioPage />;
      case '/focus':
        return <FocusPage />;
      case '/learning-hub':
        return <LearningHubPage />;
      case '/browser-utilities':
        return <BrowserUtilitiesPage />;
      case '/changelog':
      case '/whats-new':
        return <ChangelogPage />;
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
          <React.Suspense fallback={<RouteLoadingFallback />}>{renderCurrentView()}</React.Suspense>
        </main>

        <Footer />
      </div>

      {/* Phone Bottom Navigation */}
      <MobileNav />

      {/* Global Command Center Search */}
      <GlobalSearchModal />

      {/* Floating Draggable Mini Apps */}
      <MiniAppsManager />

      {/* Notifications, Shortcuts & Guided Tour Modals */}
      <ExperienceModals />

      {/* Global Drag & Drop File Detection */}
      <SmartDropZone />

      {/* Offline Status Badge for PWA */}
      <OfflineIndicator />
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
