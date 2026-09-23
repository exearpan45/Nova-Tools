import { ToolDefinition, ToolCategory } from '../types';

export const TOOLS_DATA: ToolDefinition[] = [
  // Calculators
  {
    id: 'calculator',
    slug: 'calculator',
    name: 'Calculator',
    description: 'Perform basic and mathematical calculations quickly with clean keyboard support.',
    category: 'Calculators',
    keywords: ['calculator', 'math', 'arithmetic', 'calculate', 'addition', 'subtraction', 'multiplication', 'division', 'percentage'],
    icon: 'Calculator',
    popular: true,
    seoTitle: 'Free Online Calculator - Fast Arithmetic & Math Tool',
    seoDescription: 'Calculate basic arithmetic and complex math expressions quickly in your browser. Safe, deterministic expression parsing with zero server calls.',
    whatItDoes: [
      'The NOVA TOOLS Calculator allows you to perform everyday arithmetic operations and multi-step expressions quickly directly inside your browser.',
      'It supports addition, subtraction, multiplication, division, percentages, and grouped parentheses with standard order of operations (PEMDAS/BODMAS).',
      'A session history tape keeps track of your recent calculations so you can quickly recall past values without retyping.'
    ],
    howToUse: [
      'Enter numbers and mathematical operators using either the on-screen keypad or your physical keyboard.',
      'Group complex operations with parentheses, e.g., (12 + 8) * 5.',
      'Press "=" or hit Enter to calculate the exact result.',
      'Press "C" or Backspace to delete the last character, "AC" or Escape to clear, or click any past history entry to recall it.'
    ],
    example: {
      input: '(150 + 25) * 4 - 50 / 2',
      output: '675',
      note: 'Evaluated using standard algebraic precedence: parentheses first, then division and multiplication, followed by addition and subtraction.'
    },
    howItWorks: 'Calculations are evaluated using a custom tokenizer and the Shunting-yard algorithm that converts expressions into Reverse Polish Notation (RPN). It strictly avoids JavaScript\'s eval() function to ensure total safety and deterministic precision.',
    privacyInfo: 'All calculations are executed directly on your device CPU in local browser memory. No formulas, expressions, or numbers are ever sent over the internet or saved to remote databases.',
    faqs: [
      {
        question: 'Can I use my physical computer keyboard?',
        answer: 'Yes. You can use number keys 0–9, decimal point (.), +, -, *, /, parenthesis (), Enter or = to calculate, Backspace to delete, and Escape to clear.'
      },
      {
        question: 'Does this calculator evaluate expressions safely?',
        answer: 'Yes. Calculations are performed using a deterministic mathematical parser without unsafe eval() or Function constructors.'
      },
      {
        question: 'Is my calculation history saved permanently?',
        answer: 'No. History is kept only in volatile browser state during your active session. When you refresh or close the tab, the history is wiped clean.'
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
    keywords: ['percentage', 'percent', 'discount', 'increase', 'decrease', 'fraction', 'ratio', 'markup'],
    icon: 'Percent',
    popular: false,
    seoTitle: 'Free Percentage Calculator - Percentage Increase, Decrease & Difference',
    seoDescription: 'Calculate percentages, percentage increases, decreases, and differences quickly with this free browser-based percentage calculator.',
    whatItDoes: [
      'The Percentage Calculator provides instant answers for common everyday percentage calculations without requiring manual formula setups.',
      'Easily determine what X% of a number is, calculate what percentage one number represents of another, compute percentage increase or decrease (useful for discounts and markups), and determine percentage difference between two values.'
    ],
    howToUse: [
      'Select the percentage scenario you want to solve from the tab options.',
      'Type your numerical values into the labeled input boxes.',
      'The result and calculated mathematical difference calculate instantaneously in real time.',
      'Click the Copy button to copy your calculated answer or use Reset to start over.'
    ],
    example: {
      input: 'Initial Value: $80, Final Value: $60 (Percentage Decrease)',
      output: '-25.00% (-$20.00 difference)',
      note: 'Formula: ((Final - Initial) / Initial) * 100 = ((60 - 80) / 80) * 100 = -25%.'
    },
    howItWorks: 'Uses standard mathematical formulas: P = (X / 100) * Y for percentage of a number; Ratio = (X / Y) * 100 for percent representation; Relative Change = ((V2 - V1) / |V1|) * 100 for percentage increase/decrease; and Difference = (|V1 - V2| / ((V1 + V2) / 2)) * 100.',
    privacyInfo: 'Your financial amounts, numbers, and calculation entries are processed strictly in your local browser runtime. Nothing is logged, tracked, or sent to any server.',
    faqs: [
      {
        question: 'What is the difference between percentage change and percentage difference?',
        answer: 'Percentage change compares a newer value against a specific initial reference value (showing growth or reduction). Percentage difference compares two values where neither is considered the baseline, dividing by their average.'
      },
      {
        question: 'How do I calculate a discount?',
        answer: 'Use the Percentage of a Number mode (e.g. 20% of $150 = $30 discount) or Percentage Decrease mode to see the final price directly.'
      },
      {
        question: 'Does the tool handle negative numbers or decimals?',
        answer: 'Yes, full decimal precision and negative numbers are supported across all percentage scenarios.'
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
    keywords: ['age', 'birthday', 'date of birth', 'calendar', 'days', 'years', 'born', 'chronological age'],
    icon: 'Calendar',
    popular: true,
    seoTitle: 'Exact Age Calculator - Calculate Years, Months, and Days',
    seoDescription: 'Find your exact chronological age in years, months, and days from date of birth. Includes leap-year handling and next birthday countdown.',
    whatItDoes: [
      'The Age Calculator computes your exact chronological age based on your date of birth, broken down into completed years, months, and days.',
      'It also displays total elapsed time in days, hours, and minutes, as well as an accurate countdown of months and days until your next birthday.',
      'You can calculate your age as of today or specify an arbitrary target date to calculate past or future milestone ages.'
    ],
    howToUse: [
      'Choose your Date of Birth using the calendar selector.',
      'Optionally adjust the "Age as of" date if you wish to calculate your age at a specific milestone.',
      'Review your exact chronological age in the highlighted result card.',
      'Check the upcoming birthday countdown and lifetime summary statistics below.'
    ],
    example: {
      input: 'Date of Birth: May 14, 1990 (As of September 22, 2026)',
      output: '36 years, 4 months, 8 days (Total: 13,280 days)',
      note: 'Correctly accounts for calendar month lengths and all leap years between 1990 and 2026.'
    },
    howItWorks: 'Evaluates chronological age by stepping through calendar year boundaries, exact days in each elapsed calendar month, and leap years according to the Gregorian calendar (years divisible by 4, except century years not divisible by 400). Next birthday countdown accounts for leap year birthdays (Feb 29).',
    privacyInfo: 'Your birth date is sensitive personal data. NOVA TOOLS computes your age entirely within your browser\'s local JavaScript engine. Your date of birth is never uploaded, tracked, or stored in cookies or remote databases.',
    faqs: [
      {
        question: 'Does this calculator accurately handle leap years?',
        answer: 'Yes. The algorithm considers leap years (such as 2000, 2020, 2024, 2028) and variable month lengths (28, 29, 30, or 31 days) for mathematically exact results.'
      },
      {
        question: 'What happens if someone was born on February 29?',
        answer: 'For leap-day birthdays, the calculator determines the next birthday on February 28 or March 1 in non-leap years, and February 29 in leap years.'
      },
      {
        question: 'Is any personal information retained?',
        answer: 'No. As soon as you navigate away, the date selection is discarded from memory.'
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
    keywords: ['bmi', 'body mass index', 'weight', 'height', 'health', 'fitness', 'metric', 'imperial'],
    icon: 'Activity',
    popular: false,
    seoTitle: 'Free BMI Calculator - Metric & Imperial Body Mass Index',
    seoDescription: 'Calculate your Body Mass Index (BMI) using metric (cm/kg) or imperial (ft/in/lbs) units. Informational screening tool based on WHO categories.',
    whatItDoes: [
      'The BMI Calculator allows you to quickly calculate your Body Mass Index (BMI)—a statistical ratio of weight to height widely used as an initial screening indicator.',
      'It supports both Metric units (centimeters and kilograms) and Imperial units (feet, inches, and pounds) with seamless switching.',
      'The calculated score is classified against standard World Health Organization (WHO) categories alongside a computed healthy weight range for your height.'
    ],
    howToUse: [
      'Select your unit preference: Metric (cm, kg) or Imperial (ft/in, lbs).',
      'Input your current height and weight into the designated fields.',
      'View your calculated BMI score, category badge (Underweight, Normal, Overweight, Obese), and healthy reference range.',
      'Consult the category reference chart for broader context.'
    ],
    example: {
      input: 'Height: 5 ft 10 in (178 cm), Weight: 160 lbs (72.6 kg)',
      output: 'BMI: 23.0 kg/m² (Normal weight)',
      note: 'Healthy weight range for this height: 128.8 lbs to 173.3 lbs (58.6 kg to 78.6 kg).'
    },
    howItWorks: 'Calculates BMI using standard international formulas: Metric = weight (kg) / [height (m)]²; Imperial = 703 * weight (lbs) / [height (inches)]². The result is matched to WHO standards: Underweight (< 18.5), Normal weight (18.5–24.9), Overweight (25.0–29.9), and Obese (≥ 30.0).',
    privacyInfo: 'Important: BMI is a general screening formula and NOT a medical diagnosis. It does not measure body fat directly or distinguish between muscle mass and adipose tissue. All inputs remain exclusively in local browser RAM and are never recorded.',
    faqs: [
      {
        question: 'Is BMI a diagnostic tool?',
        answer: 'No. BMI is a screening metric. It does not account for muscle mass, bone density, age, sex, or ethnic differences. Consult a licensed medical professional for comprehensive health evaluations.'
      },
      {
        question: 'Why do athletes often have higher BMI scores?',
        answer: 'Muscle tissue is significantly denser than fat. Athletic individuals with high muscle mass may be classified as overweight by BMI formulas despite having low body fat.'
      },
      {
        question: 'Are my height and weight stored?',
        answer: 'No. Your measurements are evaluated solely in client-side memory and are cleared when the page is closed.'
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
    keywords: ['unit', 'converter', 'metric', 'imperial', 'length', 'weight', 'area', 'volume', 'speed', 'measurement'],
    icon: 'ArrowLeftRight',
    popular: true,
    seoTitle: 'Free Unit Converter - Length, Weight, Area & Volume',
    seoDescription: 'Convert between metric and imperial measurement units easily. Supports length, mass, area, volume, and speed with instant calculation.',
    whatItDoes: [
      'The Unit Converter simplifies conversions between standard metric and imperial units across everyday physical measurement dimensions.',
      'Easily convert measurements of Length (meters, kilometers, feet, inches, miles, yards), Mass/Weight (grams, kilograms, pounds, ounces, metric tons), Area (square meters, square feet, acres, hectares), and Volume (liters, milliliters, gallons, cups, fluid ounces).',
      'Provides instantaneous bi-directional conversion with a convenient Swap button.'
    ],
    howToUse: [
      'Select the measurement dimension (e.g., Length, Mass, Area, Volume, Speed) from the top category selector.',
      'Enter the numerical quantity you want to convert in the input field.',
      'Choose your source unit and destination target unit from the dropdown menus.',
      'The converted value updates instantly. Click "Swap" to immediately invert the conversion direction.'
    ],
    example: {
      input: '10 Kilometers to Miles',
      output: '6.21371 Miles',
      note: 'Uses international conversion constant: 1 kilometer ≈ 0.62137119 miles.'
    },
    howItWorks: 'Uses high-precision rational conversion constants. The source value is normalized to a standard SI base unit (meters for length, grams for weight, square meters for area, liters for volume), and then converted into the target unit, minimizing rounding distortion.',
    privacyInfo: 'All conversion mathematics run client-side. No units, quantities, or entries are transmitted across any network.',
    faqs: [
      {
        question: 'Which measurement systems are supported?',
        answer: 'Both the International System of Units (SI Metric) and US Customary / Imperial systems are fully supported across all categories.'
      },
      {
        question: 'How accurate are the conversion results?',
        answer: 'Calculations use double-precision floating point math and standard international scientific conversion ratios.'
      },
      {
        question: 'Can I swap source and target units?',
        answer: 'Yes, click the Swap button between the unit selectors to immediately reverse the conversion.'
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
    keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'temp', 'heat', 'weather', 'thermal'],
    icon: 'Thermometer',
    popular: false,
    seoTitle: 'Temperature Converter - Celsius, Fahrenheit, and Kelvin',
    seoDescription: 'Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K) in real time. Features scientific reference milestones.',
    whatItDoes: [
      'The Temperature Converter provides real-time, synchronized temperature conversions between the three primary scales: Celsius (°C), Fahrenheit (°F), and scientific Kelvin (K).',
      'Typing into any one temperature field immediately updates the remaining two scales synchronously.',
      'Includes practical benchmark points for reference: Absolute Zero, Water Freezing, Room Temperature, Human Body Temperature, and Water Boiling.'
    ],
    howToUse: [
      'Enter a numerical temperature into any of the three inputs: Celsius, Fahrenheit, or Kelvin.',
      'Watch the remaining two scales update in real time as you type.',
      'Click any quick benchmark button (e.g. "Freezing Point" or "Room Temp") to populate values instantly.'
    ],
    example: {
      input: '100 °C (Celsius)',
      output: '212 °F (Fahrenheit) and 373.15 K (Kelvin)',
      note: 'Standard boiling point of water at sea level atmospheric pressure.'
    },
    howItWorks: 'Conversions use exact thermodynamic equations: °F = (°C * 9/5) + 32; °C = (°F - 32) * 5/9; K = °C + 273.15; °C = K - 273.15. Physical lower bounds (Absolute Zero at 0 K, -273.15 °C, -459.67 °F) are checked and highlighted.',
    privacyInfo: 'Computations run entirely in your local browser runtime. Zero data is recorded or sent over the web.',
    faqs: [
      {
        question: 'What is Absolute Zero?',
        answer: 'Absolute zero is the theoretical point where thermodynamic entropy and molecular motion reach their minimum: 0 Kelvin (-273.15 °C or -459.67 °F).'
      },
      {
        question: 'Why doesn\'t Kelvin use the degree (°) symbol?',
        answer: 'Kelvin is an absolute thermodynamic temperature scale rather than a relative scale, so its unit is simply the kelvin (K), without the degree symbol.'
      },
      {
        question: 'Can I input negative values?',
        answer: 'Yes, negative temperatures are supported down to absolute zero.'
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
    keywords: ['data', 'bytes', 'kilobytes', 'megabytes', 'gigabytes', 'terabytes', 'storage', 'ram', 'file size', 'binary', 'decimal'],
    icon: 'HardDrive',
    popular: false,
    seoTitle: 'Data Unit Converter - Bytes, KB, MB, GB, TB (Binary & Decimal)',
    seoDescription: 'Convert digital storage and file sizes between Bytes, KB, MB, GB, TB, and PB. Toggle between binary (1024) and decimal (1000) prefixes.',
    whatItDoes: [
      'The Data Converter transforms digital file sizes and memory amounts across all standard storage units from single Bytes up to Petabytes (PB).',
      'It clearly distinguishes between Binary prefixes (base-2: 1024, as used by computer RAM and operating systems like Windows) and Decimal prefixes (base-10: 1000, as defined by the International System of Units and used by storage manufacturers).',
      'Helps explain why a purchased "1 TB" hard drive displays as approximately "931 GiB" inside your computer.'
    ],
    howToUse: [
      'Enter your numeric file size or storage quantity in the input field.',
      'Select the source data unit (Bytes, KB, MB, GB, TB, PB).',
      'Toggle between Binary (1024 base: KiB, MiB, GiB) and Decimal (1000 base: KB, MB, GB).',
      'View the synchronous breakdown table across all storage denominations.'
    ],
    example: {
      input: '1 TB (Decimal / Base-10: 1,000,000,000,000 Bytes) to Binary (Base-2)',
      output: '931.32 GiB (Gibibytes) / 953,674 MiB',
      note: 'Demonstrates the ~7% difference between storage manufacturer packaging (decimal) and operating system allocation (binary).'
    },
    howItWorks: 'Converts the entered value to raw bytes via value * (base^power), where base is 1024 in Binary mode and 1000 in Decimal mode. It then computes exact ratios across all target tiers with customizable precision.',
    privacyInfo: 'All storage calculations happen locally in JavaScript memory. No filenames, file sizes, or inputs leave your computer.',
    faqs: [
      {
        question: 'What is the difference between GB and GiB?',
        answer: 'A Gigabyte (GB) uses the decimal system (10^9 = 1,000,000,000 bytes). A Gibibyte (GiB) uses the binary system (2^30 = 1,073,741,824 bytes). Operating systems frequently use binary calculations while labeling them GB.'
      },
      {
        question: 'Why does my 512 GB SSD show less space in Windows?',
        answer: 'Storage drives are manufactured and marketed using decimal 1000-byte multipliers (512,000,000,000 bytes). Windows reports free space using binary 1024-byte dividers, resulting in ~476.8 GiB.'
      },
      {
        question: 'Does this tool support bits as well as bytes?',
        answer: 'Yes, 1 Byte equals 8 bits. The tool focuses on byte storage denominations commonly seen in operating systems and drive specifications.'
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
    keywords: ['time', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'duration', 'converter', 'milliseconds', 'calendar'],
    icon: 'Clock',
    popular: false,
    seoTitle: 'Time Duration Converter - Seconds, Minutes, Hours & Days',
    seoDescription: 'Convert time durations between milliseconds, seconds, minutes, hours, days, weeks, months, and years in real time.',
    whatItDoes: [
      'The Time Converter allows you to convert any time duration into all common temporal increments synchronously.',
      'Convert effortlessly between milliseconds, seconds, minutes, hours, days, weeks, average calendar months, and years.',
      'Supports fractional quantities (such as 2.5 hours or 0.25 days) for fast scheduling, work logging, and scientific calculations.'
    ],
    howToUse: [
      'Enter a numeric duration into any time unit field.',
      'Observe all other time units update synchronously in real time.',
      'Use decimal values for fractional calculations or reset with one click.'
    ],
    example: {
      input: '90 Minutes',
      output: '5,400 Seconds | 1.5 Hours | 0.0625 Days | 90,000 Milliseconds',
      note: 'Astronomical calendar averages (365.25 days/year and 30.44 days/month) are used for extended multi-month durations.'
    },
    howItWorks: 'The algorithm converts the source duration into base milliseconds, then applies exact mathematical divisors (1,000 ms/sec, 60 sec/min, 60 min/hr, 24 hr/day, 7 days/wk) to calculate all equivalent units simultaneously.',
    privacyInfo: 'Processed 100% on-device in browser memory. No information is transmitted or recorded.',
    faqs: [
      {
        question: 'How are months and years calculated?',
        answer: 'Because months vary from 28 to 31 days, standard long-term astronomical constants are applied: 30.4375 days per average month and 365.25 days per calendar year (incorporating leap years).'
      },
      {
        question: 'Can I enter fractions of an hour or day?',
        answer: 'Yes. Entering decimal numbers such as 0.75 hours immediately displays 45 minutes.'
      },
      {
        question: 'Is there a limit on duration size?',
        answer: 'The converter handles micro-durations up to astronomical scales with double-precision floating point accuracy.'
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
    keywords: ['password', 'generator', 'security', 'secure', 'random', 'credentials', 'passcode', 'entropy'],
    icon: 'KeyRound',
    popular: true,
    seoTitle: 'Strong Password Generator - Secure & Client-Side Random Passwords',
    seoDescription: 'Generate strong, cryptographically secure passwords locally in your browser using the Web Crypto API. Never logged, stored, or transmitted.',
    whatItDoes: [
      'The Password Generator creates strong, high-entropy passwords tailored to your exact security requirements directly in your browser.',
      'Customize password length (from 8 to 64 characters) and select required character sets: Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), and Symbols (!@#$%...).',
      'Provides a real-time entropy score and strength rating to ensure your credentials meet modern cybersecurity standards.'
    ],
    howToUse: [
      'Drag the length slider to your desired character count (16+ characters recommended for high security).',
      'Toggle character options (Uppercase, Lowercase, Numbers, Symbols) as required by your service.',
      'Click "Generate Password" to produce a fresh, cryptographically random string.',
      'Click "Copy" to copy the generated password directly to your system clipboard.'
    ],
    example: {
      input: 'Length: 20 characters (Uppercase, Lowercase, Numbers, Symbols enabled)',
      output: 'k9#Vx7$mQ2!wL8@pZ1*e',
      note: 'Generates ~130 bits of cryptographic entropy, effectively impervious to brute-force dictionary attacks.'
    },
    howItWorks: 'Uses the browser\'s native window.crypto.getRandomValues() Web Cryptography API. This taps directly into your operating system kernel entropy pool (/dev/urandom on Unix/Linux/macOS or CryptGenRandom on Windows). It avoids predictable pseudo-random Math.random() implementations.',
    privacyInfo: 'CRITICAL SECURITY GUARANTEE: Generated passwords are NEVER stored, NEVER logged, and NEVER transmitted over a network. Passwords are never saved to localStorage or cookies. As soon as you refresh or close the browser tab, the generated password is permanently erased from RAM.',
    faqs: [
      {
        question: 'Is this safer than generating passwords on a server?',
        answer: 'Yes. Generating passwords on a remote server requires transmitting the secret over the internet where it could be logged or intercepted. Client-side generation with Web Crypto never leaves your device.'
      },
      {
        question: 'Are generated passwords saved in my browser history?',
        answer: 'No. Passwords exist exclusively in local transient state variables and are never stored in localStorage, cookies, or browser history.'
      },
      {
        question: 'What is a recommended password length?',
        answer: 'Modern security standards (such as NIST) recommend at least 16 characters mixing letters, digits, and symbols to resist brute-force computational cracking.'
      }
    ],
    relatedSlugs: ['qr-generator', 'base64', 'json-formatter']
  },
  {
    id: 'qr-generator',
    slug: 'qr-generator',
    name: 'QR Generator',
    description: 'Create a QR code from text or a link.',
    category: 'Generators',
    keywords: ['qr', 'qr code', 'barcode', 'generator', 'url', 'link', 'download', 'png', 'canvas'],
    icon: 'QrCode',
    popular: true,
    seoTitle: 'Free QR Code Generator - Create & Download QR Codes Locally',
    seoDescription: 'Create QR codes from links, text, or contacts directly in your browser. Download high-resolution PNG images with zero server tracking.',
    whatItDoes: [
      'The QR Generator converts website URLs, plain text messages, Wi-Fi credentials, email addresses, or phone numbers into high-resolution, scannable QR codes.',
      'Renders the matrix directly on an HTML5 canvas in your browser, allowing you to preview the code live and download it as a PNG image file.',
      'Unlike third-party services, it does not use intermediate tracking redirects; your destination URL is encoded directly into the QR code matrix.'
    ],
    howToUse: [
      'Type or paste your link, text, or information into the input box.',
      'The QR code renders immediately on screen in real time.',
      'Preview the generated matrix to ensure clarity.',
      'Click "Download PNG" to save the high-resolution image file to your device.'
    ],
    example: {
      input: 'https://novatools.net',
      output: 'High-contrast 256x256 pixel QR code matrix with Reed-Solomon error correction.',
      note: 'Can be scanned instantly by any iOS, Android, or dedicated optical barcode reader.'
    },
    howItWorks: 'Uses client-side QR encoding libraries to convert string characters into a standard 2D matrix with Reed-Solomon error correction codes. The pixels are rendered directly onto an HTML5 <canvas> element. Clicking download calls canvas.toDataURL() entirely in local browser memory.',
    privacyInfo: 'Many commercial QR generators route your links through their own tracking servers to collect user analytics. NOVA TOOLS encodes your raw text or link directly into the QR matrix inside your browser. No server is ever contacted.',
    faqs: [
      {
        question: 'Do these QR codes ever expire?',
        answer: 'No. Because your exact URL or text is encoded directly into the graphic without third-party redirect links, the QR code remains functional indefinitely.'
      },
      {
        question: 'Is there any scan limit?',
        answer: 'None. You can print, share, or scan the downloaded QR code an unlimited number of times.'
      },
      {
        question: 'What types of data can I encode?',
        answer: 'You can encode website URLs (https://...), plain text messages, email links (mailto:...), phone numbers (tel:...), Wi-Fi network strings, and more.'
      }
    ],
    relatedSlugs: ['password-generator', 'word-counter', 'base64']
  },

  // Text Tools
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and estimated reading time.',
    category: 'Text Tools',
    keywords: ['word counter', 'words', 'characters', 'sentences', 'reading time', 'text analysis', 'essay', 'paragraphs'],
    icon: 'FileText',
    popular: true,
    seoTitle: 'Free Word Counter - Count Words, Characters & Reading Time',
    seoDescription: 'Count words, characters (with/without spaces), sentences, and estimated reading and speaking time in real time. Private and client-side.',
    whatItDoes: [
      'The Word Counter analyzes written text in real time, delivering an instant statistical breakdown of word count, character count (both including and excluding spaces), sentence count, and paragraph count.',
      'It also estimates required reading time (based on the standard average of 200 words per minute) and speaking time (based on 130 words per minute).',
      'Ideal for students drafting essays, authors writing articles, and professionals preparing social media copy or public speeches.'
    ],
    howToUse: [
      'Type or paste your text into the main editor area.',
      'Review the live summary cards displaying words, characters, sentences, paragraphs, and reading time.',
      'Use the "Clear" button to start fresh or "Copy Text" to copy your content back to the clipboard.'
    ],
    example: {
      input: 'A 450-word blog post or academic draft.',
      output: '450 words | 2,890 characters (with spaces) | 2,440 characters (no spaces) | 22 sentences | ~2.3 min reading time',
      note: 'Reading speed calculated based on the standard average adult reading rate of 200 WPM.'
    },
    howItWorks: 'The tool uses Unicode-aware regular expression word boundaries (\\b\\S+\\b) to identify discrete words while ignoring trailing whitespace. Sentences are parsed using punctuation delimiters (. ! ?), and reading time is derived using wordCount / 200.',
    privacyInfo: 'Your essays, articles, and confidential drafts are processed strictly in your local browser runtime. Text is never sent to external servers, logged, or used for AI model training.',
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is calculated using the widely accepted standard average reading speed of 200 words per minute for silent adult reading.'
      },
      {
        question: 'Are hyphenated words counted as one word or two?',
        answer: 'Standard hyphenated compound words (like "well-known") are counted as a single word following conventional publishing guidelines.'
      },
      {
        question: 'Is my written content saved anywhere?',
        answer: 'No. All processing happens in local browser memory. When you clear the box or leave the page, the content is discarded.'
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
    keywords: ['character counter', 'letters', 'digits', 'spaces', 'symbols', 'length', 'social media limit', 'twitter', 'sms'],
    icon: 'Type',
    popular: false,
    seoTitle: 'Character Counter - Letters, Numbers, Spaces & Social Limits',
    seoDescription: 'Detailed character counting tool with breakdowns for letters, digits, spaces, symbols, and platform limits for X/Twitter, LinkedIn, and SMS.',
    whatItDoes: [
      'The Character Counter provides a fine-grained compositional breakdown of any text string, isolating alphabetical letters, numeric digits, whitespace characters, punctuation symbols, and lines.',
      'Features built-in character limit monitors for popular social platforms including X/Twitter (280 chars), LinkedIn post limits, Instagram captions, and standard SMS message segments (160 chars).'
    ],
    howToUse: [
      'Paste or type your draft message into the text box.',
      'Check the real-time breakdown metrics for letters, numbers, spaces, and symbols.',
      'Verify that your content fits comfortably within platform character indicators.',
      'Copy the verified text with one click.'
    ],
    example: {
      input: '"NOVA TOOLS v1.1 is now live! Visit novatools.net for clean, fast utilities."',
      output: '75 total characters | 58 letters | 2 numbers | 10 spaces | 5 symbols | 1 line',
      note: 'Leaves 205 characters remaining for a standard 280-character post.'
    },
    howItWorks: 'Evaluates each character against Unicode regular expressions (\\p{L} for letters, \\p{N} for digits, \\s for whitespace, and punctuation tests) to ensure exact counting across multi-lingual alphabets and emojis without fragmentation.',
    privacyInfo: 'All text analysis executes entirely on your device. Zero characters are transmitted across any network.',
    faqs: [
      {
        question: 'How are emojis counted?',
        answer: 'Modern emojis and surrogate pairs are handled safely so that composite glyphs are counted accurately without corrupting character indices.'
      },
      {
        question: 'What is the SMS character segment limit?',
        answer: 'A standard single SMS message in GSM-7 encoding contains up to 160 characters. Messages exceeding this are concatenated into multi-part segments.'
      },
      {
        question: 'Can I count lines and paragraphs?',
        answer: 'Yes, line break (\\n) counts and paragraph counts are updated in real time.'
      }
    ],
    relatedSlugs: ['word-counter', 'case-converter', 'base64']
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, and code formats.',
    category: 'Text Tools',
    keywords: ['case', 'uppercase', 'lowercase', 'title case', 'sentence case', 'camelcase', 'snake_case', 'kebab-case', 'constant_case'],
    icon: 'CaseSensitive',
    popular: false,
    seoTitle: 'Case Converter - UPPERCASE, lowercase, Title Case & Code Formats',
    seoDescription: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE instantly.',
    whatItDoes: [
      'The Case Converter transforms text strings between standard linguistic capitalization formats and developer programming conventions with a single click.',
      'Supported formats include: UPPERCASE, lowercase, Title Case (Capitalizing Each Word), Sentence case (Capitalizing initial sentence letters), camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.',
      'Preserves original word boundaries and provides instant one-click copying to clipboard.'
    ],
    howToUse: [
      'Type or paste your text into the input box.',
      'Click on any target case button (e.g. "UPPERCASE", "Title Case", "camelCase", "snake_case").',
      'The text is immediately converted to the requested formatting convention.',
      'Click the "Copy" button to copy the transformed text to your clipboard.'
    ],
    example: {
      input: '"simple tools done well"',
      output: 'camelCase: "simpleToolsDoneWell" | Title Case: "Simple Tools Done Well" | kebab-case: "simple-tools-done-well"',
      note: 'Intelligently parses existing spaces, hyphens, or underscores before transforming.'
    },
    howItWorks: 'Splits strings into discrete token words by parsing whitespace, underscores, hyphens, and existing camelCase boundaries. It then reconstructs the string by applying uppercase/lowercase rules to each word token and joining with target delimiters.',
    privacyInfo: 'All text transformations occur locally in your browser\'s memory. No text is sent to any external server.',
    faqs: [
      {
        question: 'What is the difference between camelCase and PascalCase?',
        answer: 'camelCase begins with a lowercase letter and capitalizes subsequent words (e.g. myVariableName). PascalCase capitalizes the first letter of every word, including the first (e.g. MyVariableName).'
      },
      {
        question: 'How does Sentence case work?',
        answer: 'Sentence case capitalizes the first character of the text and any character following a sentence-ending period, exclamation mark, or question mark, keeping remaining letters lowercase.'
      },
      {
        question: 'Can I convert code identifiers between snake_case and camelCase?',
        answer: 'Yes, the tokenizer recognizes existing underscores and converts them smoothly into camelCase or kebab-case.'
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
    keywords: ['json', 'formatter', 'beautifier', 'validator', 'minify', 'prettify', 'syntax', 'developer', 'parse'],
    icon: 'Braces',
    popular: false,
    seoTitle: 'JSON Formatter & Validator - Format, Beautify, and Minify JSON',
    seoDescription: 'Validate, format, and minify JSON strings safely in your browser. Inspect syntax errors with exact line and column locations. Never sent to a server.',
    whatItDoes: [
      'The JSON Formatter validates, prettifies, and minifies JavaScript Object Notation (JSON) payloads quickly and safely.',
      'Format messy or single-line JSON with clear indentation (choose 2 spaces, 4 spaces, or tabs) for easy readability and debugging.',
      'Minify structured JSON into a compact, single-line format to reduce bandwidth and payload size for production API calls.',
      'Pinpoints exact syntax errors (such as missing commas, unquoted keys, or trailing commas) with line and character diagnostics.'
    ],
    howToUse: [
      'Paste your raw, unformatted, or minified JSON into the editor.',
      'Choose your preferred indentation spacing (2 spaces, 4 spaces, or Tab).',
      'Click "Format / Beautify" to structure the JSON into a clean hierarchical layout.',
      'Click "Minify" if you need to compact the JSON into a single dense line.',
      'Use "Copy" to copy the result or "Clear" to start over.'
    ],
    example: {
      input: '{"tool":"NOVA TOOLS","version":1.1,"features":["fast","private"],"status":"active"}',
      output: 'Formatted with clean 2-space indentation and syntax highlighting.',
      note: 'Detects missing braces, unescaped quotes, or illegal trailing commas immediately.'
    },
    howItWorks: 'Uses the browser\'s native JSON.parse() engine to strictly validate syntax and structure, followed by JSON.stringify(obj, null, indent) for beautification or JSON.stringify(obj) for minification. Unsafe eval() or arbitrary code execution is strictly prohibited.',
    privacyInfo: 'JSON payloads frequently contain proprietary configurations, API tokens, database schemas, or customer records. NOVA TOOLS processes all JSON 100% locally in your browser memory. Your data never touches any external server or telemetry service.',
    faqs: [
      {
        question: 'Does this formatter execute arbitrary JavaScript?',
        answer: 'No. The tool uses standard native JSON.parse(), which parses pure JSON data without executing JavaScript code.'
      },
      {
        question: 'Why does my JSON fail validation?',
        answer: 'Standard JSON requires double quotes around all keys and string values. Single quotes, trailing commas after the last item, and unquoted keys are invalid in standard JSON.'
      },
      {
        question: 'Is there a file size limit?',
        answer: 'The formatter can handle large multi-megabyte JSON payloads comfortably within standard browser memory limits.'
      }
    ],
    relatedSlugs: ['base64', 'case-converter', 'word-counter']
  },
  {
    id: 'base64',
    slug: 'base64',
    name: 'Base64 Tool',
    description: 'Encode text to Base64 or decode Base64 strings to readable text.',
    category: 'Developer Tools',
    keywords: ['base64', 'encoder', 'decoder', 'encode', 'decode', 'binary', 'ascii', 'utf-8', 'developer', 'string'],
    icon: 'Binary',
    popular: false,
    seoTitle: 'Base64 Encoder & Decoder - Full UTF-8 & Unicode Support',
    seoDescription: 'Encode text to Base64 and decode Base64 strings safely with complete UTF-8 multilingual and emoji support. 100% client-side.',
    whatItDoes: [
      'The Base64 Tool encodes plain text strings into Base64 ASCII format and decodes Base64 encoded strings back into human-readable text.',
      'Features complete Unicode / UTF-8 character support, preventing character corruption or browser exceptions when encoding non-ASCII characters, accented letters, or emojis.',
      'Detects malformed Base64 strings with clear, user-friendly error messages.'
    ],
    howToUse: [
      'Select your operation mode: "Encode" (Text → Base64) or "Decode" (Base64 → Text).',
      'Paste your content into the input box.',
      'The encoded or decoded result generates automatically or upon clicking the action button.',
      'Click "Copy Result" to copy the output directly to your clipboard.'
    ],
    example: {
      input: 'Text: "Simple tools. Done well."',
      output: 'Base64: "U2ltcGxlIHRvb2xzLiBEb25lIHdlbGwu"',
      note: 'Multi-byte UTF-8 encoding ensures accented characters like "café" or emojis like "🚀" decode without corruption.'
    },
    howItWorks: 'Uses the browser\'s standard TextEncoder and TextDecoder APIs combined with btoa() and atob(). Rather than naive binary string conversions that crash on multi-byte UTF-8 code points, it streams UTF-8 byte arrays directly through a safe translation layer.',
    privacyInfo: 'All Base64 encoding and decoding operations happen locally on your device CPU. No strings, tokens, or decoded payloads are ever transmitted across the internet.',
    faqs: [
      {
        question: 'Is Base64 encryption?',
        answer: 'No. Base64 is an encoding format designed to represent binary data as safe ASCII text for network protocols. It does not provide confidentiality or cryptographic security.'
      },
      {
        question: 'Why do other Base64 tools fail on emojis or accents?',
        answer: 'Standard browser btoa() throws an exception when encountering characters with code points above Latin1 (0xFF). NOVA TOOLS uses a UTF-8 byte pipeline that seamlessly supports all international alphabets and emojis.'
      },
      {
        question: 'What happens if I try to decode an invalid Base64 string?',
        answer: 'The tool catches the decode error and displays a clear message asking you to verify that your input is a valid Base64 string.'
      }
    ],
    relatedSlugs: ['json-formatter', 'password-generator', 'qr-generator']
  },
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    description: 'Calculate sale prices, percentage discounts, money saved, and sales tax instantly.',
    category: 'Calculators',
    keywords: ['discount', 'sale', 'percentage off', 'price calculator', 'tax', 'savings', 'clearance'],
    icon: 'Tag',
    popular: true,
    seoTitle: 'Free Discount Calculator - Calculate Sale Price & Money Saved',
    seoDescription: 'Calculate final discounted prices, fixed dollar savings, and sales tax adjustments quickly in your browser. 100% private with instant calculation.',
    whatItDoes: [
      'Computes the exact final price of an item after applying a percentage discount (e.g. 25% off) or a fixed dollar discount (e.g. $10 off).',
      'Calculates the total amount of money you save and the effective percentage savings.',
      'Includes optional sales tax calculation to see your true out-of-pocket register cost.'
    ],
    howToUse: [
      'Enter the original price of the item before discount.',
      'Select whether the discount is a percentage (% Off) or fixed dollar amount ($ Off).',
      'Enter the discount amount or tap a quick preset button (e.g. 20%, 50%).',
      'Optionally add local sales tax to calculate the final register price.'
    ],
    example: {
      input: 'Original Price: $80.00, Discount: 25% Off, Sales Tax: 8%',
      output: 'Final Price: $64.80 (You save $20.00, Tax: $4.80)',
      note: 'Calculates discounted subtotal ($60.00) first, then adds 8% sales tax ($4.80).'
    },
    howItWorks: 'Uses client-side proportional arithmetic: savings = (price * discount) / 100. Price after discount = price - savings. Final price = price after discount + (price after discount * tax / 100). Deterministic float rounding prevents floating-point inaccuracies.',
    privacyInfo: 'All price entries and calculations remain 100% private in local browser memory. No figures are ever stored on servers or logged.',
    faqs: [
      {
        question: 'How do I calculate multiple discounts (stacked discounts)?',
        answer: 'You can calculate the first discount, then enter the resulting "Price Before Tax" as your new original price for the second discount.'
      },
      {
        question: 'Does this support fixed dollar discounts?',
        answer: 'Yes. Simply toggle the "$ Off" button next to the discount input.'
      }
    ],
    relatedSlugs: ['percentage-calculator', 'calculator', 'bmi-calculator']
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate bulk cryptographically secure Version 4 UUIDs (GUIDs) in your browser.',
    category: 'Generators',
    keywords: ['uuid', 'guid', 'uuid v4', 'unique identifier', 'random id', 'generator', 'hash'],
    icon: 'Fingerprint',
    popular: true,
    seoTitle: 'Free UUID / GUID Generator - Fast Bulk Version 4 UUIDs',
    seoDescription: 'Generate cryptographically random UUID v4 identifiers instantly in your browser. Bulk generation, custom formatting, and one-click copy.',
    whatItDoes: [
      'Generates standard RFC 4122 Version 4 Universally Unique Identifiers (UUIDs) / Globally Unique Identifiers (GUIDs).',
      'Supports bulk generation up to 50 UUIDs at a time with instant one-click copy and text file export.',
      'Offers flexible formatting: uppercase/lowercase toggle, optional hyphens, and brace enclosing.'
    ],
    howToUse: [
      'Select the desired quantity of UUIDs (1, 5, 10, 25, or 50).',
      'Toggle formatting options such as Uppercase, Hyphens, or Enclosing Braces.',
      'Click "Regenerate" or press Enter to generate fresh random identifiers.',
      'Click individual copy icons or "Copy All" to copy the full list to your clipboard.'
    ],
    example: {
      input: 'Format: Standard Lowercase with Hyphens',
      output: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      note: 'Cryptographically generated with 122 bits of high-entropy randomness.'
    },
    howItWorks: 'Uses the browser\'s native crypto.randomUUID() API or crypto.getRandomValues() CSPRNG. It enforces Version 4 (0100 in high bits of octet 7) and Variant 10 (10 in high bits of octet 9) conforming strictly to RFC 4122.',
    privacyInfo: 'All UUIDs are generated locally on your device CPU. No generated identifiers are transmitted to any server or recorded.',
    faqs: [
      {
        question: 'Are these UUIDs collision-proof?',
        answer: 'Yes. With 122 bits of entropy, the probability of generating a duplicate Version 4 UUID across billions of generated keys is astronomically close to zero.'
      },
      {
        question: 'What is the difference between UUID and GUID?',
        answer: 'GUID (Globally Unique Identifier) is Microsoft\'s term for standard RFC 4122 UUIDs. They are structurally identical.'
      }
    ],
    relatedSlugs: ['password-generator', 'qr-generator', 'base64']
  },
  {
    id: 'timestamp-converter',
    slug: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert Unix epoch timestamps to human dates and dates back to timestamps with live clock.',
    category: 'Converters',
    keywords: ['timestamp', 'unix time', 'epoch', 'epoch converter', 'date to timestamp', 'time converter', 'iso 8601'],
    icon: 'Timer',
    popular: false,
    seoTitle: 'Unix Timestamp Converter - Epoch to Human Date & Time',
    seoDescription: 'Convert Unix epoch timestamps (seconds & milliseconds) to human-readable dates and formats. Includes live ticking epoch clock and UTC conversion.',
    whatItDoes: [
      'Displays a live ticking Unix epoch clock in seconds with pause and resume controls.',
      'Converts Unix epoch numbers (both 10-digit seconds and 13-digit milliseconds) into UTC, Local, ISO 8601, and human relative times.',
      'Converts human calendar dates and times back into exact epoch seconds and milliseconds.'
    ],
    howToUse: [
      'To convert a timestamp: Paste the epoch number in seconds or milliseconds into the input.',
      'View formatted UTC, Local, and relative time breakdowns automatically.',
      'To convert a date: Select date & time from the calendar picker to obtain epoch seconds and milliseconds.',
      'Use "Set to Now" to synchronize with current time.'
    ],
    example: {
      input: 'Timestamp: 1774345200',
      output: 'UTC: Mon, 23 Mar 2026 09:40:00 GMT | ISO: 2026-03-23T09:40:00.000Z',
      note: 'Auto-detects whether the input is in seconds or milliseconds based on digit count.'
    },
    howItWorks: 'Uses the browser\'s JavaScript Date engine with epoch mathematics (time in milliseconds since midnight UTC on January 1, 1970). UTC strings and local timezone offsets are computed deterministically.',
    privacyInfo: 'All timestamp conversions run entirely on your local machine. No dates, times, or timestamps leave your browser.',
    faqs: [
      {
        question: 'Does this support milliseconds?',
        answer: 'Yes. The converter automatically detects 10-digit inputs as seconds and 13-digit inputs as milliseconds.'
      },
      {
        question: 'What is Unix Epoch time?',
        answer: 'Unix epoch time is the number of seconds that have elapsed since January 1, 1970 (UTC), excluding leap seconds.'
      }
    ],
    relatedSlugs: ['time-converter', 'age-calculator', 'date-difference']
  },
  {
    id: 'text-sorter',
    slug: 'text-sorter',
    name: 'Text Sorter',
    description: 'Sort lists alphabetically, by length, or natural order, and remove duplicate lines.',
    category: 'Text Tools',
    keywords: ['sort', 'text sorter', 'alphabetize', 'remove duplicates', 'deduplicate', 'sort lines', 'natural sort'],
    icon: 'ListFilter',
    popular: false,
    seoTitle: 'Free Text Sorter & Line Cleaner - Alphabetize & Remove Duplicates',
    seoDescription: 'Sort lists of text alphabetically (A-Z, Z-A), by character length, or natural numerical order. Remove duplicate and blank lines in one click.',
    whatItDoes: [
      'Sorts multi-line text lists alphabetically (A to Z, Z to A), by line length, or in natural numerical order (1, 2, 10).',
      'Removes duplicate lines while preserving unique list items.',
      'Cleans text by trimming leading/trailing whitespace and filtering out empty lines.',
      'Displays real-time statistics: total lines, unique lines, duplicates count, and characters.'
    ],
    howToUse: [
      'Paste or type your lines of text into the input area.',
      'Click your desired sorting mode (e.g., A → Z, Natural Sort, Shortest First).',
      'Click "Remove Duplicates" or "Trim Spaces" to clean up list items.',
      'Click "Copy" or "Download" to export your processed list.'
    ],
    example: {
      input: 'Banana\nApple\n10. Mango\n2. Grape\nApple',
      output: 'Apple\nBanana\n2. Grape\n10. Mango',
      note: 'Deduplicated duplicate "Apple" and sorted numerically using natural sort.'
    },
    howItWorks: 'Splits text by newline regex (\\r?\\n), maps items through JavaScript Intl.Collator with numeric collation enabled for natural order, and utilizes ES6 Set collections for O(N) deduplication.',
    privacyInfo: 'All text sorting and line manipulation happen locally inside your browser. No text is ever transmitted over the network.',
    faqs: [
      {
        question: 'What is natural sort?',
        answer: 'Natural sort orders numbers logically (e.g. 1, 2, 10) instead of ASCII character order (1, 10, 2).'
      },
      {
        question: 'Can I reverse the lines in a list?',
        answer: 'Yes. Click "Reverse Lines" to invert the list from bottom to top.'
      }
    ],
    relatedSlugs: ['word-counter', 'character-counter', 'case-converter']
  },
  {
    id: 'url-encoder',
    slug: 'url-encoder',
    name: 'URL Encoder & Decoder',
    description: 'Safely encode and decode URLs and inspect query parameters in an organized table.',
    category: 'Developer Tools',
    keywords: ['url encode', 'url decode', 'uri encoder', 'uricomponent', 'percent encoding', 'query string', 'developer'],
    icon: 'Link2',
    popular: false,
    seoTitle: 'Free URL Encoder & Decoder - Percent-Encoding & Query Inspector',
    seoDescription: 'Encode and decode URLs and URI components with full Unicode support. Includes interactive query parameter breakdown table. 100% client-side.',
    whatItDoes: [
      'Converts special characters into percent-encoded equivalents (%20, %2F, etc.) and decodes percent-encoded URLs back into readable text.',
      'Supports both URI Component mode (encodes all delimiters) and Full URI mode (preserves protocol and path).',
      'Automatically parses query strings and displays an interactive table of query parameter keys and values with individual copy actions.'
    ],
    howToUse: [
      'Choose "Encode" or "Decode" mode.',
      'Select "Component" for query parameters or "Full URI" for full website addresses.',
      'Paste your URL or text string into the input box.',
      'View the processed output instantly, inspect parsed query parameters below, and copy with one click.'
    ],
    example: {
      input: 'https://novatools.net/search?query=hello world&category=tools',
      output: 'https://novatools.net/search?query=hello%20world&category=tools',
      note: 'Spaces percent-encoded to %20 while structural URL components are preserved.'
    },
    howItWorks: 'Uses browser-native encodeURIComponent, decodeURIComponent, encodeURI, and decodeURI functions along with standard URLSearchParams for query string decomposition.',
    privacyInfo: 'All URL encoding, decoding, and parsing happen locally on your device. No URLs, tokens, or query strings are sent to any remote server.',
    faqs: [
      {
        question: 'When should I use "Component" vs "Full URI"?',
        answer: 'Use "Component" when encoding a specific parameter value or text string containing delimiters like & or =. Use "Full URI" when encoding an entire web address so http:// and / slashes are preserved.'
      },
      {
        question: 'Does this tool support international characters?',
        answer: 'Yes. All non-ASCII characters and UTF-8 multi-byte characters are encoded into standard percent-encoded octets.'
      }
    ],
    relatedSlugs: ['base64', 'json-formatter', 'uuid-generator']
  }
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  'Calculators',
  'Converters',
  'Generators',
  'Text Tools',
  'Developer Tools'
];
