import React, { Suspense } from 'react';
import { ToolDefinition } from '../types';
import { Sparkles, RefreshCw } from 'lucide-react';

// Lazy-loaded suite components for optimal code-splitting & performance
const ImageTools = React.lazy(() => import('./imageTools').then((m) => ({ default: m.ImageTools })));
const PdfTools = React.lazy(() => import('./pdfTools').then((m) => ({ default: m.PdfTools })));
const TextTools = React.lazy(() => import('./textTools').then((m) => ({ default: m.TextTools })));
const DeveloperTools = React.lazy(() => import('./developerTools').then((m) => ({ default: m.DeveloperTools })));
const StudentTools = React.lazy(() => import('./studentTools').then((m) => ({ default: m.StudentTools })));
const CalculatorTools = React.lazy(() => import('./calculatorTools').then((m) => ({ default: m.CalculatorTools })));
const WebTools = React.lazy(() => import('./webTools').then((m) => ({ default: m.WebTools })));
const DesignTools = React.lazy(() => import('./designTools').then((m) => ({ default: m.DesignTools })));
const SecurityTools = React.lazy(() => import('./securityTools').then((m) => ({ default: m.SecurityTools })));
const DataTools = React.lazy(() => import('./dataTools').then((m) => ({ default: m.DataTools })));
const WritingTools = React.lazy(() => import('./writingTools').then((m) => ({ default: m.WritingTools })));
const UtilityTools = React.lazy(() => import('./utilityTools').then((m) => ({ default: m.UtilityTools })));

const ToolLoadingFallback: React.FC = () => (
  <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
      <RefreshCw className="w-5 h-5 animate-spin" />
    </div>
    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
      Loading tool workspace...
    </span>
  </div>
);

interface ToolDispatcherProps {
  tool: ToolDefinition;
}

export const ToolDispatcher: React.FC<ToolDispatcherProps> = ({ tool }) => {
  const { suite, slug } = tool;

  const renderSuite = () => {
    switch (suite) {
      case 'image':
        return <ImageTools toolSlug={slug} />;
      case 'pdf':
        return <PdfTools toolSlug={slug} />;
      case 'text':
        return <TextTools toolSlug={slug} />;
      case 'developer':
        return <DeveloperTools toolSlug={slug} />;
      case 'student':
        return <StudentTools toolSlug={slug} />;
      case 'calculators':
        return <CalculatorTools toolSlug={slug} />;
      case 'web':
        return <WebTools toolSlug={slug} />;
      case 'design':
        return <DesignTools toolSlug={slug} />;
      case 'security':
        return <SecurityTools toolSlug={slug} />;
      case 'data':
        return <DataTools toolSlug={slug} />;
      case 'writing':
        return <WritingTools toolSlug={slug} />;
      case 'utility':
        return <UtilityTools toolSlug={slug} />;
      default:
        return <DeveloperTools toolSlug={slug} />;
    }
  };

  return (
    <Suspense fallback={<ToolLoadingFallback />}>
      {renderSuite()}
    </Suspense>
  );
};
