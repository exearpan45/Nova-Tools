import { ToolDefinition, ToolCategory } from '../types';

export const TOOLS_DATA: ToolDefinition[] = [
  // Calculators
  {
    id: 'calculator',
    slug: 'calculator',
    name: 'Calculator',
    description: 'Perform basic and mathematical calculations quickly.',
    category: 'Calculators',
    keywords: ['calculator', 'math', 'arithmetic', 'calculate', 'addition', 'multiplication', 'percentage'],
    icon: 'Calculator',
    popular: true,
    howItWorks: 'Enter numbers and operators using your keyboard or the on-screen buttons. Expressions are parsed safely in real-time with full history tracking.',
    faqs: [
      {
        question: 'Can I use keyboard shortcuts?',
        answer: 'Yes. You can use standard keyboard number keys, +, -, *, /, Enter for equals, Backspace to delete, and Escape to clear.'
      },
      {
        question: 'Does this calculator evaluate expressions safely?',
        answer: 'Yes. Calculations are performed using a deterministic mathematical parser without unsafe eval() functions.'
      }
    ],
    relatedSlugs: ['percentage-calculator', 'age-calculator', 'bmi-calculator']
  },
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, increases, decreases, and differences easily.',
    category: 'Calculators',
    keywords: ['percentage', 'percent', 'discount', 'increase', 'decrease', 'fraction', 'ratio'],
    icon: 'Percent',
    popular: false,
    howItWorks: 'Choose your desired percentage scenario (standard percentage, percentage increase/decrease, or difference), enter values, and view the instant result.',
    faqs: [
      {
        question: 'What percentage calculations are supported?',
        answer: 'You can calculate what X% of Y is, what percent X is of Y, percentage increase or decrease between two values, and the percentage difference.'
      },
      {
        question: 'Does it update automatically?',
        answer: 'Yes, results update in real-time as soon as you type valid numbers into the inputs.'
      }
    ],
    relatedSlugs: ['calculator', 'age-calculator', 'unit-converter']
  },
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days.',
    category: 'Calculators',
    keywords: ['age', 'birthday', 'date of birth', 'calendar', 'days', 'years', 'born'],
    icon: 'Calendar',
    popular: true,
    howItWorks: 'Select your date of birth. The calculator determines your exact elapsed chronological age and the countdown to your next birthday.',
    faqs: [
      {
        question: 'How is the age breakdown calculated?',
        answer: 'Age is calculated considering varying month lengths and leap years for exact accuracy in years, months, and days.'
      },
      {
        question: 'Is my birth date uploaded to a server?',
        answer: 'No. All calculations run strictly in your browser. No personal data is transmitted or recorded.'
      }
    ],
    relatedSlugs: ['time-converter', 'calculator', 'bmi-calculator']
  },
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate body mass index using metric or imperial units.',
    category: 'Calculators',
    keywords: ['bmi', 'body mass index', 'weight', 'height', 'health', 'fitness'],
    icon: 'Activity',
    popular: false,
    howItWorks: 'Enter your height and weight in either metric (cm/kg) or imperial (feet/inches/pounds) units to compute your Body Mass Index (BMI).',
    faqs: [
      {
        question: 'Is this tool a medical diagnosis?',
        answer: 'No. BMI is a general screening indicator based on World Health Organization categories and should not be used as medical advice.'
      },
      {
        question: 'Which measurement systems are supported?',
        answer: 'Both metric (centimeters and kilograms) and imperial (feet, inches, and pounds) are fully supported.'
      }
    ],
    relatedSlugs: ['calculator', 'unit-converter', 'age-calculator']
  },

  // Converters
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between everyday units of length, weight, area, and volume.',
    category: 'Converters',
    keywords: ['unit', 'converter', 'metric', 'imperial', 'length', 'weight', 'area', 'volume', 'speed'],
    icon: 'ArrowLeftRight',
    popular: true,
    howItWorks: 'Select a physical category, pick source and destination units, and input your quantity for an instant deterministic conversion.',
    faqs: [
      {
        question: 'What units are available?',
        answer: 'Supported categories include length (meters, feet, inches, miles, etc.), mass/weight (grams, kg, pounds, ounces), area, volume, and speed.'
      },
      {
        question: 'Can I swap source and target units?',
        answer: 'Yes, click the swap button to reverse the conversion direction with a single click.'
      }
    ],
    relatedSlugs: ['temperature-converter', 'data-converter', 'time-converter']
  },
  {
    id: 'temperature-converter',
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    description: 'Convert temperatures between Celsius, Fahrenheit, and Kelvin.',
    category: 'Converters',
    keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'temp', 'heat', 'weather'],
    icon: 'Thermometer',
    popular: false,
    howItWorks: 'Type a temperature into any field (Celsius, Fahrenheit, or Kelvin) to see all other scales update synchronously with standard scientific formulas.',
    faqs: [
      {
        question: 'What formulas are used?',
        answer: 'Celsius to Fahrenheit uses (°C × 9/5) + 32. Kelvin uses °C + 273.15. All conversions are mathematically exact.'
      },
      {
        question: 'Is absolute zero supported?',
        answer: 'Yes, standard thermodynamic boundaries are respected with clear guidance.'
      }
    ],
    relatedSlugs: ['unit-converter', 'time-converter', 'data-converter']
  },
  {
    id: 'data-converter',
    slug: 'data-converter',
    name: 'Data Converter',
    description: 'Convert digital storage units from bytes to terabytes.',
    category: 'Converters',
    keywords: ['data', 'bytes', 'kilobytes', 'megabytes', 'gigabytes', 'terabytes', 'storage', 'ram', 'file size'],
    icon: 'HardDrive',
    popular: false,
    howItWorks: 'Enter a numeric file size or memory amount in any digital storage unit to see equivalent sizes across all binary (1024) or decimal (1000) measurements.',
    faqs: [
      {
        question: 'Does it use binary (1024) or decimal (1000) prefixes?',
        answer: 'You can toggle between binary standard (1024 bytes = 1 KB) and decimal standard (1000 bytes = 1 KB) depending on your needs.'
      },
      {
        question: 'Which units are covered?',
        answer: 'Units from single Bytes up to Petabytes (PB) are calculated instantly.'
      }
    ],
    relatedSlugs: ['unit-converter', 'time-converter', 'json-formatter']
  },
  {
    id: 'time-converter',
    slug: 'time-converter',
    name: 'Time Converter',
    description: 'Convert time durations between seconds, minutes, hours, and days.',
    category: 'Converters',
    keywords: ['time', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'duration', 'converter'],
    icon: 'Clock',
    popular: false,
    howItWorks: 'Input a number into any time unit to view simultaneous conversions into milliseconds, seconds, minutes, hours, days, weeks, and years.',
    faqs: [
      {
        question: 'What is the reference length for a month and year?',
        answer: 'Calculations use standard astronomical averages (365.25 days per calendar year and 30.44 days per average month).'
      },
      {
        question: 'Can I convert fractional hours or days?',
        answer: 'Yes, decimal numbers like 2.5 hours or 0.25 days are fully supported.'
      }
    ],
    relatedSlugs: ['unit-converter', 'age-calculator', 'data-converter']
  },

  // Generators
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong passwords instantly in your browser.',
    category: 'Generators',
    keywords: ['password', 'generator', 'security', 'secure', 'random', 'credentials', 'passcode'],
    icon: 'KeyRound',
    popular: true,
    howItWorks: 'Select password length and desired character sets. The password is generated client-side using the cryptographically secure Web Crypto API.',
    faqs: [
      {
        question: 'Are generated passwords saved anywhere?',
        answer: 'Never. Passwords are created entirely in browser memory and are never transmitted, logged, or stored.'
      },
      {
        question: 'How secure is the randomization?',
        answer: 'It uses window.crypto.getRandomValues(), the modern standard for cryptographic entropy in browsers.'
      }
    ],
    relatedSlugs: ['qr-generator', 'base64-tool', 'json-formatter']
  },
  {
    id: 'qr-generator',
    slug: 'qr-generator',
    name: 'QR Generator',
    description: 'Create a QR code from text or a link.',
    category: 'Generators',
    keywords: ['qr', 'qr code', 'barcode', 'generator', 'url', 'link', 'download'],
    icon: 'QrCode',
    popular: true,
    howItWorks: 'Type or paste a website URL, plain text, email address, or phone number. A high-resolution QR code renders instantly for copying or PNG download.',
    faqs: [
      {
        question: 'Is my data sent to an external server?',
        answer: 'No. QR codes are rendered locally inside your browser on an HTML5 canvas element.'
      },
      {
        question: 'Can I download the QR code image?',
        answer: 'Yes, click "Download PNG" to save the high-resolution image file to your device.'
      }
    ],
    relatedSlugs: ['password-generator', 'word-counter', 'base64-tool']
  },

  // Text Tools
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and estimated reading time.',
    category: 'Text Tools',
    keywords: ['word counter', 'words', 'characters', 'sentences', 'reading time', 'text analysis', 'essay'],
    icon: 'FileText',
    popular: true,
    howItWorks: 'Paste or type text into the box to see real-time statistics on words, total characters, characters excluding spaces, paragraphs, and reading time.',
    faqs: [
      {
        question: 'How is reading time estimated?',
        answer: 'Reading time is calculated based on the standard average adult reading speed of 200 words per minute.'
      },
      {
        question: 'Does this save my text?',
        answer: 'No. All processing happens in local browser memory and resets when you clear the input.'
      }
    ],
    relatedSlugs: ['character-counter', 'case-converter', 'json-formatter']
  },
  {
    id: 'character-counter',
    slug: 'character-counter',
    name: 'Character Counter',
    description: 'Inspect detailed character breakdowns, letters, spaces, and lines.',
    category: 'Text Tools',
    keywords: ['character counter', 'letters', 'digits', 'spaces', 'symbols', 'length', 'social media limit'],
    icon: 'Type',
    popular: false,
    howItWorks: 'Enter your content to view an exact count of letters, digits, whitespace, punctuation, and lines, ideal for social media length restrictions.',
    faqs: [
      {
        question: 'Does this count emojis correctly?',
        answer: 'Yes, modern Unicode characters and surrogate pairs are handled accurately.'
      },
      {
        question: 'Can I check Twitter/X or Instagram caption limits?',
        answer: 'Yes, the live character count helps you stay within platform boundaries.'
      }
    ],
    relatedSlugs: ['word-counter', 'case-converter', 'base64-tool']
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, and code formats.',
    category: 'Text Tools',
    keywords: ['case', 'uppercase', 'lowercase', 'title case', 'sentence case', 'camelcase', 'snake_case', 'kebab-case'],
    icon: 'CaseSensitive',
    popular: false,
    howItWorks: 'Paste your text, then select any target format such as UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, or kebab-case.',
    faqs: [
      {
        question: 'Which casing formats are supported?',
        answer: 'Supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE.'
      },
      {
        question: 'Can I copy the converted text with one click?',
        answer: 'Yes, simply click the copy icon on the converted result.'
      }
    ],
    relatedSlugs: ['word-counter', 'character-counter', 'json-formatter']
  },

  // Developer Tools
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data cleanly.',
    category: 'Developer Tools',
    keywords: ['json', 'formatter', 'beautifier', 'validator', 'minify', 'prettify', 'syntax'],
    icon: 'Braces',
    popular: false,
    howItWorks: 'Paste unformatted or raw JSON to validate syntax, format with customizable indentation (2 spaces, 4 spaces, or tabs), or minify for production.',
    faqs: [
      {
        question: 'What happens if my JSON is invalid?',
        answer: 'The formatter detects syntax errors and provides a clear description of the line and issue so you can quickly fix it.'
      },
      {
        question: 'Is my JSON uploaded to any server?',
        answer: 'No. All validation and formatting executes entirely in your browser using safe native JSON parsing.'
      }
    ],
    relatedSlugs: ['base64-tool', 'case-converter', 'word-counter']
  },
  {
    id: 'base64-tool',
    slug: 'base64-tool',
    name: 'Base64 Tool',
    description: 'Encode text to Base64 or decode Base64 strings to readable text.',
    category: 'Developer Tools',
    keywords: ['base64', 'encoder', 'decoder', 'encode', 'decode', 'binary', 'ascii', 'utf-8'],
    icon: 'Binary',
    popular: false,
    howItWorks: 'Switch between Encode and Decode modes. Paste your text or Base64 string to transform it instantly with full Unicode (UTF-8) support.',
    faqs: [
      {
        question: 'Does this support non-English Unicode characters?',
        answer: 'Yes. It uses UTF-8 byte stream encoding and decoding so characters in any language or emoji are preserved correctly.'
      },
      {
        question: 'What happens if a Base64 string is malformed?',
        answer: 'The tool provides a friendly, clear message indicating the input cannot be decoded as valid Base64.'
      }
    ],
    relatedSlugs: ['json-formatter', 'password-generator', 'qr-generator']
  }
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  'Calculators',
  'Converters',
  'Generators',
  'Text Tools',
  'Developer Tools'
];
