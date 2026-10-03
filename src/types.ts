export type ToolSuite =
  | 'image'
  | 'pdf'
  | 'text'
  | 'developer'
  | 'student'
  | 'calculators'
  | 'web'
  | 'design'
  | 'security'
  | 'data'
  | 'writing'
  | 'utility';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolExample {
  input: string;
  output: string;
  note?: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  suite: ToolSuite;
  category?: string; // backwards compatibility
  keywords: string[];
  icon: string;
  popular?: boolean;
  featured?: boolean;
  isLocal?: boolean;
  requiresServer?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  whatItDoes?: string[];
  howToUse?: string[];
  example?: ToolExample;
  howItWorks?: string;
  privacyInfo?: string;
  faqs?: FAQItem[];
  relatedSlugs?: string[];
}

export interface SuiteInfo {
  id: ToolSuite;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  badgeBg: string;
}

export interface WorkflowStep {
  toolSlug: string;
  name: string;
  description: string;
  inputHint: string;
  outputHint: string;
}

export interface WorkflowDefinition {
  id: string;
  title: string;
  description: string;
  category: ToolSuite;
  icon: string;
  steps: WorkflowStep[];
  estimatedTime: string;
}

export type ThemeId = 'dark' | 'light';

export interface UserSettings {
  theme: ThemeId;
  accentColor: string;
  animations: boolean;
  compactMode: boolean;
  defaultSuite: ToolSuite | 'all';
  autoDownload: boolean;
  keepHistory: boolean;
  confirmBeforeClearing: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface RecentToolItem {
  slug: string;
  name: string;
  suite: ToolSuite;
  icon: string;
  lastUsed: number;
}
