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
  category: ToolCategory;
  keywords: string[];
  icon: string;
  popular?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  whatItDoes: string[];
  howToUse: string[];
  example: ToolExample;
  howItWorks: string;
  privacyInfo: string;
  faqs: FAQItem[];
  relatedSlugs: string[];
}
