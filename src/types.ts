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

export type ToolCategory =
  | 'Calculators'
  | 'Converters'
  | 'Generators'
  | 'Text Tools'
  | 'Developer Tools';

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
  category?: ToolCategory | string;
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
  soundEffects?: boolean;
}

export interface RecentToolItem {
  slug: string;
  name: string;
  suite: ToolSuite;
  icon: string;
  lastUsed: number;
}

export interface ClipboardSnippet {
  id: string;
  title: string;
  content: string;
  category: 'Code' | 'Text' | 'Links' | 'Prompts' | 'Other';
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ToolCollection {
  id: string;
  name: string;
  description: string;
  toolSlugs: string[];
  createdAt: number;
}

export interface WorkspaceWidgetConfig {
  id: 'welcome' | 'favorites' | 'recent' | 'quick-launch' | 'stats' | 'collections' | 'workflows';
  label: string;
  visible: boolean;
}

export interface FocusSessionRecord {
  id: string;
  mode: 'pomodoro' | 'countdown' | 'stopwatch';
  label: string;
  durationSeconds: number;
  completedAt: number;
}

export type MiniAppId = 'calculator' | 'notes' | 'timer' | 'color' | 'converter';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: number;
  read: boolean;
}
