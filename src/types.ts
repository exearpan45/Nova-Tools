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

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  icon: string;
  popular?: boolean;
  howItWorks: string;
  faqs: FAQItem[];
  relatedSlugs: string[];
}
