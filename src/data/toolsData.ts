import { ToolDefinition, ToolCategory, ToolSuite } from '../types';

const RAW_TOOLS_DATA: Omit<ToolDefinition, 'suite'>[] = [
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
      input: 'https://nova-tools2.pages.dev',
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
      input: '"NOVA TOOLS v1.1 is now live! Visit nova-tools2.pages.dev for clean, fast utilities."',
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
    relatedSlugs: ['time-converter', 'age-calculator']
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
      input: 'https://nova-tools2.pages.dev/search?query=hello world&category=tools',
      output: 'https://nova-tools2.pages.dev/search?query=hello%20world&category=tools',
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
  },
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images in your browser and compare the output before saving.',
    category: 'Converters',
    keywords: ["image","compress","photo","jpg","png"],
    icon: 'Image',
    popular: false,
    seoTitle: 'Image Compressor - Free Online Tool',
    seoDescription: 'Compress images in your browser and compare the output before saving.',
    whatItDoes: ['Compress images in your browser and compare the output before saving.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to custom dimensions with a simple local workflow.',
    category: 'Converters',
    keywords: ["image","resize","dimensions","photo"],
    icon: 'Image',
    popular: false,
    seoTitle: 'Image Resizer - Free Online Tool',
    seoDescription: 'Resize images to custom dimensions with a simple local workflow.',
    whatItDoes: ['Resize images to custom dimensions with a simple local workflow.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'pdf-merger',
    slug: 'pdf-merger',
    name: 'PDF Merger',
    description: 'Combine PDF documents into one file directly in your browser.',
    category: 'Converters',
    keywords: ["pdf","merge","combine","documents"],
    icon: 'FileText',
    popular: false,
    seoTitle: 'PDF Merger - Free Online Tool',
    seoDescription: 'Combine PDF documents into one file directly in your browser.',
    whatItDoes: ['Combine PDF documents into one file directly in your browser.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'pdf-splitter',
    slug: 'pdf-splitter',
    name: 'PDF Splitter',
    description: 'Extract selected pages from a PDF into a separate document.',
    category: 'Converters',
    keywords: ["pdf","split","pages","extract"],
    icon: 'FileText',
    popular: false,
    seoTitle: 'PDF Splitter - Free Online Tool',
    seoDescription: 'Extract selected pages from a PDF into a separate document.',
    whatItDoes: ['Extract selected pages from a PDF into a separate document.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'text-diff',
    slug: 'text-diff',
    name: 'Text Diff Checker',
    description: 'Compare two text blocks and spot additions or differences quickly.',
    category: 'Text Tools',
    keywords: ["text","diff","compare","difference"],
    icon: 'Type',
    popular: false,
    seoTitle: 'Text Diff Checker - Free Online Tool',
    seoDescription: 'Compare two text blocks and spot additions or differences quickly.',
    whatItDoes: ['Compare two text blocks and spot additions or differences quickly.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'lorem-ipsum-generator',
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for mockups, layouts, and design previews.',
    category: 'Generators',
    keywords: ["lorem","ipsum","placeholder","dummy text"],
    icon: 'Type',
    popular: false,
    seoTitle: 'Lorem Ipsum Generator - Free Online Tool',
    seoDescription: 'Generate placeholder text for mockups, layouts, and design previews.',
    whatItDoes: ['Generate placeholder text for mockups, layouts, and design previews.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions against sample text and inspect matches.',
    category: 'Developer Tools',
    keywords: ["regex","regexp","regular expression","developer"],
    icon: 'Code2',
    popular: false,
    seoTitle: 'Regex Tester - Free Online Tool',
    seoDescription: 'Test regular expressions against sample text and inspect matches.',
    whatItDoes: ['Test regular expressions against sample text and inspect matches.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'cgpa-calculator',
    slug: 'cgpa-calculator',
    name: 'CGPA Calculator',
    description: 'Calculate a CGPA from semester grades using a straightforward form.',
    category: 'Calculators',
    keywords: ["cgpa","gpa","student","grades","academic"],
    icon: 'GraduationCap',
    popular: false,
    seoTitle: 'CGPA Calculator - Free Online Tool',
    seoDescription: 'Calculate a CGPA from semester grades using a straightforward form.',
    whatItDoes: ['Calculate a CGPA from semester grades using a straightforward form.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'scientific-calculator',
    slug: 'scientific-calculator',
    name: 'Scientific Calculator',
    description: 'Handle common scientific and trigonometric calculations in your browser.',
    category: 'Calculators',
    keywords: ["scientific","trigonometry","math","sin","cos"],
    icon: 'Calculator',
    popular: false,
    seoTitle: 'Scientific Calculator - Free Online Tool',
    seoDescription: 'Handle common scientific and trigonometric calculations in your browser.',
    whatItDoes: ['Handle common scientific and trigonometric calculations in your browser.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'gradient-generator',
    slug: 'gradient-generator',
    name: 'CSS Gradient Generator',
    description: 'Create CSS gradients and copy the generated styles for your project.',
    category: 'Generators',
    keywords: ["css","gradient","design","colors"],
    icon: 'Palette',
    popular: false,
    seoTitle: 'CSS Gradient Generator - Free Online Tool',
    seoDescription: 'Create CSS gradients and copy the generated styles for your project.',
    whatItDoes: ['Create CSS gradients and copy the generated styles for your project.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate supported text hashes locally for development and verification.',
    category: 'Developer Tools',
    keywords: ["hash","sha","md5","checksum","developer"],
    icon: 'Code2',
    popular: false,
    seoTitle: 'Hash Generator - Free Online Tool',
    seoDescription: 'Generate supported text hashes locally for development and verification.',
    whatItDoes: ['Generate supported text hashes locally for development and verification.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'csv-viewer',
    slug: 'csv-viewer',
    name: 'CSV Viewer',
    description: 'Preview CSV data in a readable table and inspect rows and columns.',
    category: 'Converters',
    keywords: ["csv","table","data","spreadsheet"],
    icon: 'Database',
    popular: false,
    seoTitle: 'CSV Viewer - Free Online Tool',
    seoDescription: 'Preview CSV data in a readable table and inspect rows and columns.',
    whatItDoes: ['Preview CSV data in a readable table and inspect rows and columns.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'readability-checker',
    slug: 'readability-checker',
    name: 'Readability Checker',
    description: 'Review text readability and sentence statistics while drafting.',
    category: 'Text Tools',
    keywords: ["readability","writing","text","sentences"],
    icon: 'PenTool',
    popular: false,
    seoTitle: 'Readability Checker - Free Online Tool',
    seoDescription: 'Review text readability and sentence statistics while drafting.',
    whatItDoes: ['Review text readability and sentence statistics while drafting.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'random-number',
    slug: 'random-number',
    name: 'Random Number Generator',
    description: 'Generate random numbers within a range for everyday tasks and testing.',
    category: 'Generators',
    keywords: ["random","number","range","generator"],
    icon: 'Wrench',
    popular: false,
    seoTitle: 'Random Number Generator - Free Online Tool',
    seoDescription: 'Generate random numbers within a range for everyday tasks and testing.',
    whatItDoes: ['Generate random numbers within a range for everyday tasks and testing.'],
    howToUse: ['Open the tool interface.', 'Enter or select the required input.', 'Review the result and use the available copy or download action.'],
    howItWorks: 'Runs in the browser using the supported NOVA Tools interface for this tool.',
    privacyInfo: 'Processing is performed in the browser where supported. Avoid entering sensitive information into any online tool.',
    relatedSlugs: []
  },
  {
    id: 'uppercase-converter',
    slug: 'uppercase-converter',
    name: 'Uppercase Converter',
    description: 'Convert text to uppercase instantly in your browser.',
    category: 'Text Tools',
    keywords: ["uppercase","capital letters","text","case"],
    icon: 'CaseSensitive',
    popular: false,
    seoTitle: 'Uppercase Converter - Free Online Tool',
    seoDescription: 'Convert text to uppercase instantly in your browser.',
    whatItDoes: ['Convert text to uppercase instantly in your browser.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'lowercase-converter',
    slug: 'lowercase-converter',
    name: 'Lowercase Converter',
    description: 'Convert text to lowercase instantly in your browser.',
    category: 'Text Tools',
    keywords: ["lowercase","small letters","text","case"],
    icon: 'CaseSensitive',
    popular: false,
    seoTitle: 'Lowercase Converter - Free Online Tool',
    seoDescription: 'Convert text to lowercase instantly in your browser.',
    whatItDoes: ['Convert text to lowercase instantly in your browser.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'title-case-converter',
    slug: 'title-case-converter',
    name: 'Title Case Converter',
    description: 'Capitalize the first letter of each word for headings and titles.',
    category: 'Text Tools',
    keywords: ["title case","capitalize","headings","text"],
    icon: 'Type',
    popular: false,
    seoTitle: 'Title Case Converter - Free Online Tool',
    seoDescription: 'Capitalize the first letter of each word for headings and titles.',
    whatItDoes: ['Capitalize the first letter of each word for headings and titles.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'remove-duplicate-lines',
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    description: 'Remove repeated lines from a list while preserving the first occurrence.',
    category: 'Text Tools',
    keywords: ["duplicate lines","deduplicate","unique lines","text"],
    icon: 'ListOrdered',
    popular: false,
    seoTitle: 'Remove Duplicate Lines - Free Online Tool',
    seoDescription: 'Remove repeated lines from a list while preserving the first occurrence.',
    whatItDoes: ['Remove repeated lines from a list while preserving the first occurrence.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'remove-extra-spaces',
    slug: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    description: 'Normalize repeated spaces and trim line endings in pasted text.',
    category: 'Text Tools',
    keywords: ["spaces","whitespace","trim","text cleaner"],
    icon: 'AlignLeft',
    popular: false,
    seoTitle: 'Remove Extra Spaces - Free Online Tool',
    seoDescription: 'Normalize repeated spaces and trim line endings in pasted text.',
    whatItDoes: ['Normalize repeated spaces and trim line endings in pasted text.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'text-reverser',
    slug: 'text-reverser',
    name: 'Text Reverser',
    description: 'Reverse the characters in a text string directly in your browser.',
    category: 'Text Tools',
    keywords: ["reverse text","backwards","characters"],
    icon: 'ArrowLeftRight',
    popular: false,
    seoTitle: 'Text Reverser - Free Online Tool',
    seoDescription: 'Reverse the characters in a text string directly in your browser.',
    whatItDoes: ['Reverse the characters in a text string directly in your browser.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'text-cleaner',
    slug: 'text-cleaner',
    name: 'Text Cleaner',
    description: 'Clean pasted text by removing HTML tags and normalizing common punctuation.',
    category: 'Text Tools',
    keywords: ["clean text","html strip","quotes","punctuation"],
    icon: 'Sparkles',
    popular: false,
    seoTitle: 'Text Cleaner - Free Online Tool',
    seoDescription: 'Clean pasted text by removing HTML tags and normalizing common punctuation.',
    whatItDoes: ['Clean pasted text by removing HTML tags and normalizing common punctuation.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'find-and-replace',
    slug: 'find-and-replace',
    name: 'Find and Replace',
    description: 'Find text or regular-expression matches and replace them in your input.',
    category: 'Text Tools',
    keywords: ["find","replace","regex","text editing"],
    icon: 'Search',
    popular: false,
    seoTitle: 'Find and Replace - Free Online Tool',
    seoDescription: 'Find text or regular-expression matches and replace them in your input.',
    whatItDoes: ['Find text or regular-expression matches and replace them in your input.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'json-validator',
    slug: 'json-validator',
    name: 'JSON Validator',
    description: 'Validate JSON input and show a readable formatted result or a parsing error.',
    category: 'Developer Tools',
    keywords: ["json","validate","syntax","developer"],
    icon: 'Braces',
    popular: false,
    seoTitle: 'JSON Validator - Free Online Tool',
    seoDescription: 'Validate JSON input and show a readable formatted result or a parsing error.',
    whatItDoes: ['Validate JSON input and show a readable formatted result or a parsing error.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'json-minifier',
    slug: 'json-minifier',
    name: 'JSON Minifier',
    description: 'Minify valid JSON by removing unnecessary whitespace.',
    category: 'Developer Tools',
    keywords: ["json","minify","compress","developer"],
    icon: 'Braces',
    popular: false,
    seoTitle: 'JSON Minifier - Free Online Tool',
    seoDescription: 'Minify valid JSON by removing unnecessary whitespace.',
    whatItDoes: ['Minify valid JSON by removing unnecessary whitespace.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'json-to-csv',
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert arrays of JSON objects into CSV text for spreadsheets.',
    category: 'Developer Tools',
    keywords: ["json","csv","convert","data"],
    icon: 'ArrowLeftRight',
    popular: false,
    seoTitle: 'JSON to CSV Converter - Free Online Tool',
    seoDescription: 'Convert arrays of JSON objects into CSV text for spreadsheets.',
    whatItDoes: ['Convert arrays of JSON objects into CSV text for spreadsheets.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'csv-to-json',
    slug: 'csv-to-json',
    name: 'CSV to JSON Converter',
    description: 'Convert simple CSV rows into a JSON array for development workflows.',
    category: 'Developer Tools',
    keywords: ["csv","json","convert","data"],
    icon: 'ArrowLeftRight',
    popular: false,
    seoTitle: 'CSV to JSON Converter - Free Online Tool',
    seoDescription: 'Convert simple CSV rows into a JSON array for development workflows.',
    whatItDoes: ['Convert simple CSV rows into a JSON array for development workflows.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'base64-encoder',
    slug: 'base64-encoder',
    name: 'Base64 Encoder',
    description: 'Encode text as Base64 locally in your browser.',
    category: 'Developer Tools',
    keywords: ["base64","encode","text","developer"],
    icon: 'LockKeyhole',
    popular: false,
    seoTitle: 'Base64 Encoder - Free Online Tool',
    seoDescription: 'Encode text as Base64 locally in your browser.',
    whatItDoes: ['Encode text as Base64 locally in your browser.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'base64-decoder',
    slug: 'base64-decoder',
    name: 'Base64 Decoder',
    description: 'Decode valid Base64 text locally in your browser.',
    category: 'Developer Tools',
    keywords: ["base64","decode","text","developer"],
    icon: 'UnlockKeyhole',
    popular: false,
    seoTitle: 'Base64 Decoder - Free Online Tool',
    seoDescription: 'Decode valid Base64 text locally in your browser.',
    whatItDoes: ['Decode valid Base64 text locally in your browser.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'url-decoder',
    slug: 'url-decoder',
    name: 'URL Decoder',
    description: 'Decode percent-encoded URL components for debugging links and query strings.',
    category: 'Developer Tools',
    keywords: ["url","decode","percent encoding","developer"],
    icon: 'Link',
    popular: false,
    seoTitle: 'URL Decoder - Free Online Tool',
    seoDescription: 'Decode percent-encoded URL components for debugging links and query strings.',
    whatItDoes: ['Decode percent-encoded URL components for debugging links and query strings.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Inspect the header and payload of a JSON Web Token without verifying its signature.',
    category: 'Developer Tools',
    keywords: ["jwt","token","decode","developer"],
    icon: 'KeyRound',
    popular: false,
    seoTitle: 'JWT Decoder - Free Online Tool',
    seoDescription: 'Inspect the header and payload of a JSON Web Token without verifying its signature.',
    whatItDoes: ['Inspect the header and payload of a JSON Web Token without verifying its signature.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'html-entity-encoder',
    slug: 'html-entity-encoder',
    name: 'HTML Entity Encoder',
    description: 'Encode special characters as HTML entities for safe text display.',
    category: 'Developer Tools',
    keywords: ["html","entities","encode","developer"],
    icon: 'Code',
    popular: false,
    seoTitle: 'HTML Entity Encoder - Free Online Tool',
    seoDescription: 'Encode special characters as HTML entities for safe text display.',
    whatItDoes: ['Encode special characters as HTML entities for safe text display.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'html-entity-decoder',
    slug: 'html-entity-decoder',
    name: 'HTML Entity Decoder',
    description: 'Decode common HTML entities into readable text.',
    category: 'Developer Tools',
    keywords: ["html","entities","decode","developer"],
    icon: 'Code',
    popular: false,
    seoTitle: 'HTML Entity Decoder - Free Online Tool',
    seoDescription: 'Decode common HTML entities into readable text.',
    whatItDoes: ['Decode common HTML entities into readable text.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'random-string-generator',
    slug: 'random-string-generator',
    name: 'Random String Generator',
    description: 'Generate random strings using selected character sets and a configurable length.',
    category: 'Developer Tools',
    keywords: ["random string","password","token","generator"],
    icon: 'Shuffle',
    popular: false,
    seoTitle: 'Random String Generator - Free Online Tool',
    seoDescription: 'Generate random strings using selected character sets and a configurable length.',
    whatItDoes: ['Generate random strings using selected character sets and a configurable length.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },
  {
    id: 'user-agent-parser',
    slug: 'user-agent-parser',
    name: 'User Agent Parser',
    description: 'Inspect a browser user-agent string and identify common browser and platform hints.',
    category: 'Developer Tools',
    keywords: ["user agent","browser","platform","developer"],
    icon: 'Monitor',
    popular: false,
    seoTitle: 'User Agent Parser - Free Online Tool',
    seoDescription: 'Inspect a browser user-agent string and identify common browser and platform hints.',
    whatItDoes: ['Inspect a browser user-agent string and identify common browser and platform hints.'],
    howToUse: ['Enter or paste your input.', 'Review the result produced in your browser.', 'Copy the output when needed.'],
    howItWorks: 'Processes the supplied input in the browser using the tool interface.',
    privacyInfo: 'Input is processed in your browser. Avoid entering sensitive information into online tools.',
    relatedSlugs: []
  },

  // Useful PDF and file utilities already implemented in the browser workspace
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'Image to PDF Converter',
    description: 'Combine multiple JPG or PNG images into one downloadable PDF document.',
    category: 'Converters',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'photo pdf', 'combine images'],
    icon: 'FileImage',
    popular: true,
    seoTitle: 'Image to PDF Converter - Combine JPG and PNG Images',
    seoDescription: 'Convert and combine JPG or PNG images into one PDF directly in your browser, without uploading files.',
    whatItDoes: ['Combines selected JPG and PNG images into a single PDF, placing each image on its own page.'],
    howToUse: ['Select one or more JPG or PNG images.', 'Check the selected file list.', 'Choose Run Operation and download the generated PDF.'],
    howItWorks: 'Embeds image data into PDF pages locally using pdf-lib. Files are not uploaded to a server.',
    privacyInfo: 'Image conversion runs in your browser. Your selected images are not sent to NOVA Tools servers.',
    relatedSlugs: ['pdf-merger', 'image-compressor']
  },
  {
    id: 'pdf-page-rotator',
    slug: 'pdf-page-rotator',
    name: 'PDF Page Rotator',
    description: 'Rotate every page of a PDF by 90, 180, or 270 degrees and download the result.',
    category: 'Converters',
    keywords: ['rotate pdf', 'pdf rotate pages', 'turn pdf', 'page orientation'],
    icon: 'RotateCw',
    popular: false,
    seoTitle: 'PDF Page Rotator - Rotate PDF Pages Online',
    seoDescription: 'Rotate all pages in a PDF locally by 90, 180, or 270 degrees.',
    whatItDoes: ['Changes the rotation metadata of every page in a PDF without rasterizing the page contents.'],
    howToUse: ['Choose a PDF file.', 'Select a clockwise rotation angle.', 'Run the operation and download the rotated PDF.'],
    howItWorks: 'Uses pdf-lib to update each page rotation in the browser.',
    privacyInfo: 'The PDF is processed locally and is not uploaded.',
    relatedSlugs: ['pdf-page-extractor', 'pdf-page-deleter', 'pdf-merger']
  },
  {
    id: 'pdf-page-extractor',
    slug: 'pdf-page-extractor',
    name: 'PDF Page Extractor',
    description: 'Extract specific PDF pages using page numbers and ranges such as 1, 3, 5-8.',
    category: 'Converters',
    keywords: ['extract pdf pages', 'pdf page range', 'save selected pages', 'split pdf'],
    icon: 'Scissors',
    popular: true,
    seoTitle: 'PDF Page Extractor - Save Selected PDF Pages',
    seoDescription: 'Extract selected pages from a PDF by page number or range, directly in your browser.',
    whatItDoes: ['Copies selected pages into a new PDF while preserving their page content.'],
    howToUse: ['Choose a PDF.', 'Enter page numbers or ranges, for example 1, 3, 5-8.', 'Run the operation and download the extracted pages.'],
    howItWorks: 'Validates page numbers and copies matching pages with pdf-lib.',
    privacyInfo: 'Your document stays in your browser during processing.',
    relatedSlugs: ['pdf-splitter', 'pdf-page-deleter', 'pdf-merger']
  },
  {
    id: 'pdf-page-deleter',
    slug: 'pdf-page-deleter',
    name: 'PDF Page Deleter',
    description: 'Remove a selected page from a PDF and save the remaining pages.',
    category: 'Converters',
    keywords: ['delete pdf page', 'remove pdf page', 'remove page from pdf'],
    icon: 'Trash2',
    popular: false,
    seoTitle: 'PDF Page Deleter - Remove a Page from PDF',
    seoDescription: 'Remove one selected page from a PDF directly in your browser.',
    whatItDoes: ['Removes a selected page while retaining the other pages in the PDF.'],
    howToUse: ['Choose a PDF.', 'Enter the page number to remove.', 'Run the operation and download the result.'],
    howItWorks: 'Uses pdf-lib to remove the chosen page without converting the document into images.',
    privacyInfo: 'The document is processed locally in your browser.',
    relatedSlugs: ['pdf-page-extractor', 'pdf-page-rotator', 'pdf-merger']
  },
  {
    id: 'file-hash-checker',
    slug: 'file-hash-checker',
    name: 'File Hash Checker',
    description: 'Calculate SHA-256, SHA-384, and SHA-1 fingerprints for a local file.',
    category: 'Developer Tools',
    keywords: ['file hash', 'sha256', 'sha384', 'sha1', 'checksum', 'integrity'],
    icon: 'Fingerprint',
    popular: false,
    seoTitle: 'File Hash Checker - SHA-256 and SHA-384',
    seoDescription: 'Generate cryptographic file fingerprints in your browser to compare downloads and verify file integrity.',
    whatItDoes: ['Calculates SHA-256, SHA-384, and legacy SHA-1 hashes for a selected file.'],
    howToUse: ['Choose a file.', 'Wait for the hashes to be calculated.', 'Copy a hash and compare it with a trusted reference.'],
    howItWorks: 'Uses the browser Web Crypto API to calculate digests locally.',
    privacyInfo: 'The file contents are read locally and are not uploaded. A matching hash helps compare integrity but does not prove a file is safe.',
    relatedSlugs: ['file-size-checker', 'file-type-detector']
  },
  {
    id: 'file-size-checker',
    slug: 'file-size-checker',
    name: 'File Size Inspector',
    description: 'Inspect a file’s exact byte size, readable size, MIME type, and last-modified date.',
    category: 'Developer Tools',
    keywords: ['file size', 'bytes', 'file information', 'mime type', 'last modified'],
    icon: 'HardDrive',
    popular: false,
    seoTitle: 'File Size Inspector - Check Bytes and File Details',
    seoDescription: 'Inspect local file size, MIME type, and modification date without uploading it.',
    whatItDoes: ['Displays exact bytes, a human-readable size, detected browser MIME type, and the local last-modified timestamp.'],
    howToUse: ['Select a file.', 'Review the file breakdown.', 'Clear the selection before inspecting another file.'],
    howItWorks: 'Reads metadata provided by the browser File API; it does not need to upload or parse the file contents.',
    privacyInfo: 'Only local file metadata is shown. No file is uploaded.',
    relatedSlugs: ['file-hash-checker', 'file-type-detector']
  },
  {
    id: 'file-type-detector',
    slug: 'file-type-detector',
    name: 'File Type Inspector',
    description: 'Inspect the browser-reported MIME type and filename of a selected file.',
    category: 'Developer Tools',
    keywords: ['file type', 'mime type', 'file inspector', 'extension'],
    icon: 'FileSearch',
    popular: false,
    seoTitle: 'File Type Inspector - Check a File MIME Type',
    seoDescription: 'Inspect the file name, browser-reported MIME type, size, and modified date locally.',
    whatItDoes: ['Shows the filename and MIME type reported by the browser alongside basic file metadata.'],
    howToUse: ['Select a file.', 'Review the displayed MIME type and file details.'],
    howItWorks: 'Uses browser-provided File metadata. MIME type may be blank or unverified, so it should not be treated as a security guarantee.',
    privacyInfo: 'The selected file is inspected locally and is not uploaded.',
    relatedSlugs: ['file-size-checker', 'file-hash-checker']
  },

  {
  id: "password-strength-checker",
  slug: "password-strength-checker",
  name: "Password Strength Checker",
  description: "Calculate password entropy bits and evaluate resistance to brute-force attacks.",
  category: "Generators",
  keywords: [
    "password strength",
    "entropy",
    "security",
    "crack time",
    "passphrase evaluation"
  ],
  icon: "ShieldCheck",
  popular: false,
  seoTitle: "Password Strength Checker - Test Password Security & Entropy",
  seoDescription: "Check password entropy and estimate brute-force crack time directly in your browser.",
  whatItDoes: [
    "Analyzes password complexity by calculating character pool size and Shannon entropy in bits.",
    "Estimates the approximate time required for an attacker using modern hardware to brute-force the password."
  ],
  howToUse: [
    "Type or paste your password into the input field.",
    "Review the calculated entropy bits, strength rating, and estimated crack time."
  ],
  example: {
    input: "P@ssw0rd!2026Secure",
    output: "~98 bits (Very Strong)",
    note: "High entropy due to combination of uppercase, lowercase, numbers, and special symbols across 19 characters."
  },
  howItWorks: "Calculates entropy E = L * log2(R) where L is password length and R is the total character pool size based on character variety.",
  privacyInfo: "Tested entirely on your local CPU. Passwords are never sent to external servers or logged.",
  faqs: [
    {
      question: "Are my passwords transmitted anywhere?",
      answer: "No. Evaluation runs completely offline inside your browser memory using local JavaScript."
    }
  ],
  relatedSlugs: [
    "password-generator",
    "random-password",
    "checksum-generator"
  ]
},

  {
  id: "checksum-generator",
  slug: "checksum-generator",
  name: "Checksum Generator & Validator",
  description: "Compute and verify cryptographic SHA-256 checksums to validate file and data integrity.",
  category: "Generators",
  keywords: [
    "checksum",
    "sha256",
    "hash verify",
    "integrity",
    "file verification"
  ],
  icon: "Shield",
  popular: false,
  seoTitle: "Online Checksum Generator - Verify File & Data Integrity",
  seoDescription: "Generate SHA-256 cryptographic checksums and compare with expected values in your browser.",
  whatItDoes: [
    "Computes SHA-256 cryptographic hashes from any input text string using the browser Web Crypto API.",
    "Allows instant comparison against an expected checksum to verify data authenticity and prevent tampering."
  ],
  howToUse: [
    "Enter or paste the data string into the input box.",
    "Copy the calculated SHA-256 hash or paste your expected hash to check for a match."
  ],
  example: {
    input: "Verify file authenticity",
    output: "SHA-256 hash output with match comparison",
    note: "Cryptographically compares expected and computed hashes in constant-time."
  },
  howItWorks: "Utilizes crypto.subtle.digest with the standard SHA-256 algorithm.",
  privacyInfo: "All hashing calculations are performed in your local browser.",
  faqs: [
    {
      question: "What is a checksum used for?",
      answer: "Checksums allow you to verify that a file or message has not been altered or corrupted in transit."
    }
  ],
  relatedSlugs: [
    "hash-generator",
    "file-hash-checker",
    "password-strength-checker"
  ]
},

  {
  id: "random-password",
  slug: "random-password",
  name: "Memorable Passphrase Generator",
  description: "Generate secure, easy-to-remember multi-word passphrases using dictionary words.",
  category: "Generators",
  keywords: [
    "passphrase",
    "memorable password",
    "diceware",
    "secure password",
    "password generator"
  ],
  icon: "Key",
  popular: false,
  seoTitle: "Memorable Passphrase Generator - Easy to Remember, Hard to Crack",
  seoDescription: "Generate secure multi-word passphrases locally using cryptographically secure random values.",
  whatItDoes: [
    "Generates multi-word passphrases that are easy for humans to memorize but extremely difficult for computers to crack.",
    "Configurable word count (3 to 8 words) and custom delimiters (hyphens, spaces, underscores, dots)."
  ],
  howToUse: [
    "Choose the desired word count using the slider.",
    "Select a separator symbol and click regenerate or copy."
  ],
  example: {
    input: "4 words with hyphen delimiter",
    output: "glacier-dragon-matrix-breeze",
    note: "Combines multiple dictionary words for high entropy while remaining effortless to type."
  },
  howItWorks: "Uses window.crypto.getRandomValues to sample unbiased entries from an curated word dictionary.",
  privacyInfo: "Generated passphrases remain strictly in browser volatile memory.",
  faqs: [
    {
      question: "Why are passphrases safer than complex random symbols?",
      answer: "Length provides massive entropy. A 4-word passphrase typically provides over 50 bits of entropy while remaining easy to remember."
    }
  ],
  relatedSlugs: [
    "password-generator",
    "password-strength-checker",
    "random-string-generator"
  ]
},

  {
  id: "text-encrypt-decrypt",
  slug: "text-encrypt-decrypt",
  name: "Text Encrypt & Decrypt",
  description: "Encrypt and decrypt confidential text using industry-standard AES-GCM 256-bit encryption.",
  category: "Generators",
  keywords: [
    "encrypt",
    "decrypt",
    "aes-gcm",
    "crypto",
    "confidential notes",
    "cipher"
  ],
  icon: "Lock",
  popular: false,
  seoTitle: "Online Text Encryption & Decryption - AES-GCM 256-bit",
  seoDescription: "Encrypt and decrypt text messages privately in your browser using PBKDF2 and AES-GCM 256-bit.",
  whatItDoes: [
    "Encrypts plain text into an encrypted Base64 string using AES-GCM 256-bit cryptography.",
    "Decrypts ciphertext back into original plaintext with the correct secret passphrase."
  ],
  howToUse: [
    "Select Encrypt mode, type your message, enter a secret password, and click Encrypt.",
    "To decrypt, paste the Base64 ciphertext, enter the password, and click Decrypt."
  ],
  example: {
    input: "Message: Confidential Notes, Passphrase: Key123!",
    output: "Base64 AES-GCM ciphertext with random IV prepended",
    note: "Every encryption produces a unique ciphertext because a fresh 12-byte initialization vector (IV) is generated each time."
  },
  howItWorks: "Derives a 256-bit key from the passphrase using PBKDF2 with SHA-256 and 100,000 iterations, then performs authenticated AES-GCM encryption.",
  privacyInfo: "Processing is 100% client-side via window.crypto.subtle. No keys or plaintexts leave your browser.",
  faqs: [
    {
      question: "Can anyone decrypt my message without the passphrase?",
      answer: "No. AES-GCM with a 256-bit key is computationally infeasible to break without knowing the password."
    }
  ],
  relatedSlugs: [
    "password-generator",
    "hash-generator",
    "base64"
  ]
},

  {
  id: "box-shadow-generator",
  slug: "box-shadow-generator",
  name: "CSS Box Shadow Generator",
  description: "Design and customize multi-layered CSS box shadows with live interactive visual preview.",
  category: "Developer Tools",
  keywords: [
    "box shadow",
    "css shadow",
    "elevation",
    "drop shadow",
    "css generator"
  ],
  icon: "Box",
  popular: false,
  seoTitle: "CSS Box Shadow Generator - Interactive Shadow Designer",
  seoDescription: "Design sleek CSS box shadows with horizontal, vertical, blur, spread, and inset controls.",
  whatItDoes: [
    "Visually adjust X/Y offsets, blur radius, spread distance, and inset shadow styling with live rendering.",
    "Exports clean, cross-browser CSS code with 1-click copy."
  ],
  howToUse: [
    "Adjust the sliders for Offset X, Offset Y, Blur, and Spread.",
    "Copy the generated CSS code into your stylesheet."
  ],
  example: {
    input: "X: 0, Y: 10, Blur: 25, Spread: -5",
    output: "box-shadow: 0px 10px 25px -5px rgba(0, 0, 0, 0.3);",
    note: "Creates an elegant soft elevation shadow ideal for modern cards and modals."
  },
  howItWorks: "Directly computes standard CSS box-shadow declarations and renders them on an interactive canvas card.",
  privacyInfo: "All design adjustments are calculated locally.",
  faqs: [
    {
      question: "Does this shadow support inset mode?",
      answer: "Yes, toggle the inset checkbox to create pressed or recessed inner shadow effects."
    }
  ],
  relatedSlugs: [
    "gradient-generator",
    "border-radius-generator",
    "glassmorphism-generator"
  ]
},

  {
  id: "border-radius-generator",
  slug: "border-radius-generator",
  name: "CSS Border Radius Generator",
  description: "Create uniform or asymmetric rounded corners with visual preview and clean CSS export.",
  category: "Developer Tools",
  keywords: [
    "border radius",
    "rounded corners",
    "css shapes",
    "ui design",
    "css styling"
  ],
  icon: "Shapes",
  popular: false,
  seoTitle: "CSS Border Radius Generator - Visual Corner Styling Tool",
  seoDescription: "Customize CSS border-radius for buttons and containers with live interactive preview.",
  whatItDoes: [
    "Adjust individual corner radii (top-left, top-right, bottom-right, bottom-left) independently.",
    "Generates precise CSS border-radius code with live button and card previews."
  ],
  howToUse: [
    "Drag the radius slider to tweak corner curvature.",
    "Copy the generated CSS border-radius declaration."
  ],
  example: {
    input: "Radius: 16px",
    output: "border-radius: 16px;",
    note: "Creates smooth modern corners that match current design systems."
  },
  howItWorks: "Calculates CSS pixel values and applies them in real-time to the preview element.",
  privacyInfo: "Local in-browser styling calculator.",
  faqs: [
    {
      question: "Can I use this for button styling?",
      answer: "Yes, you can configure both button padding and border radius together."
    }
  ],
  relatedSlugs: [
    "box-shadow-generator",
    "css-button-generator",
    "gradient-generator"
  ]
},

  {
  id: "glassmorphism-generator",
  slug: "glassmorphism-generator",
  name: "CSS Glassmorphism Generator",
  description: "Generate modern frosted glass UI effects using CSS backdrop-filter and translucency.",
  category: "Developer Tools",
  keywords: [
    "glassmorphism",
    "frosted glass",
    "backdrop-filter",
    "glass css",
    "translucent card"
  ],
  icon: "Layers",
  popular: false,
  seoTitle: "CSS Glassmorphism Generator - Frosted Glass Effect Designer",
  seoDescription: "Design beautiful frosted glass UI cards with adjustable blur, opacity, and borders in CSS.",
  whatItDoes: [
    "Customizes backdrop-filter blur, background alpha opacity, and border translucency.",
    "Renders a live frosted glass card over vibrant ambient shapes to preview realistic depth."
  ],
  howToUse: [
    "Adjust the Backdrop Blur, Background Opacity, and Border Opacity sliders.",
    "Copy the generated CSS rules including vendor prefixes."
  ],
  example: {
    input: "Blur: 16px, Opacity: 20%, Border: 30%",
    output: "background: rgba(255, 255, 255, 0.20); backdrop-filter: blur(16px);",
    note: "Delivers a modern Apple/macOS-style frosted glass effect."
  },
  howItWorks: "Combines CSS backdrop-filter with semi-transparent rgba() colors for hardware-accelerated glass effects.",
  privacyInfo: "Runs completely client-side in your browser.",
  faqs: [
    {
      question: "Is backdrop-filter widely supported?",
      answer: "Yes, modern Chrome, Safari, Edge, and Firefox all support backdrop-filter with hardware acceleration."
    }
  ],
  relatedSlugs: [
    "box-shadow-generator",
    "gradient-generator",
    "border-radius-generator"
  ]
},

  {
  id: "css-button-generator",
  slug: "css-button-generator",
  name: "CSS Button Generator",
  description: "Design beautiful, accessible CSS buttons with customizable colors, padding, and corner radii.",
  category: "Developer Tools",
  keywords: [
    "css button",
    "button generator",
    "button designer",
    "cta design",
    "css styles"
  ],
  icon: "MousePointerClick",
  popular: false,
  seoTitle: "CSS Button Generator - Design Buttons with Live Preview",
  seoDescription: "Create custom CSS buttons with real-time preview, color pickers, padding, and radius sliders.",
  whatItDoes: [
    "Interactive control over button background color, label text, text color, padding, and corner radius.",
    "Provides ready-to-use CSS declarations for web apps and landing pages."
  ],
  howToUse: [
    "Type your button label and select background and text colors.",
    "Adjust padding and radius, then copy the generated CSS snippet."
  ],
  example: {
    input: "Label: \"Explore Workflows\", Background: #6366f1, Radius: 12px",
    output: "CSS button styles ready for production",
    note: "Clean, accessible button styling with smooth interactive active states."
  },
  howItWorks: "Computes CSS layout and color declarations and binds them directly to the live preview button.",
  privacyInfo: "Client-side only utility.",
  faqs: [
    {
      question: "Can I customize hover states?",
      answer: "Yes, the generated CSS includes smooth transition rules so you can add hover opacity effortlessly."
    }
  ],
  relatedSlugs: [
    "border-radius-generator",
    "gradient-generator",
    "box-shadow-generator"
  ]
},

  {
  id: "gpa-calculator",
  slug: "gpa-calculator",
  name: "GPA & CGPA Calculator",
  description: "Calculate your semester GPA or cumulative CGPA based on course credit hours and grades.",
  category: "Calculators",
  keywords: [
    "gpa",
    "cgpa",
    "grade calculator",
    "credits",
    "college grades",
    "academic score"
  ],
  icon: "GraduationCap",
  popular: false,
  seoTitle: "Free GPA Calculator - Calculate College & High School GPA",
  seoDescription: "Calculate semester GPA and cumulative CGPA quickly with credit weighting and course grades.",
  whatItDoes: [
    "Allows adding multiple courses with custom credit weights and numerical grades.",
    "Computes the exact weighted Grade Point Average (GPA) out of 10.0 or 4.0."
  ],
  howToUse: [
    "Add your semester courses with their respective credit values and grades.",
    "The estimated GPA updates automatically with every change."
  ],
  example: {
    input: "Math (4cr, 9), CS (4cr, 10), Physics (3cr, 8), Writing (2cr, 9)",
    output: "9.08 / 10.0 GPA",
    note: "Weighted sum of credit points divided by total course credits."
  },
  howItWorks: "Formula: Sum(Credits * Grade) / Sum(Credits).",
  privacyInfo: "Academic data is processed locally in volatile browser memory.",
  faqs: [
    {
      question: "Can I add or remove courses?",
      answer: "Yes, you can add as many courses as needed or delete courses with 1 click."
    }
  ],
  relatedSlugs: [
    "cgpa-calculator",
    "scientific-calculator",
    "fraction-calculator"
  ]
},

  {
  id: "pomodoro-timer",
  slug: "pomodoro-timer",
  name: "Pomodoro Focus Timer",
  description: "Boost focus and productivity with customizable work intervals and break timers.",
  category: "Calculators",
  keywords: [
    "pomodoro",
    "focus timer",
    "productivity timer",
    "study timer",
    "interval timer"
  ],
  icon: "Timer",
  popular: false,
  seoTitle: "Online Pomodoro Timer - Boost Study & Work Focus",
  seoDescription: "Free online Pomodoro timer with 25-minute focus intervals and 5/15-minute break timers.",
  whatItDoes: [
    "Implements the proven Pomodoro Technique: 25-minute focused sprint followed by short and long breaks.",
    "Offers 1-click presets for Focus (25m), Short Break (5m), and Long Break (15m)."
  ],
  howToUse: [
    "Select Focus mode and click Start.",
    "When the timer concludes, switch to Short Break or Long Break to rest before your next session."
  ],
  example: {
    input: "Focus Mode (25 minutes)",
    output: "Digital countdown with start, pause, and reset controls",
    note: "Keeps track of seconds in real-time with responsive pause/resume controls."
  },
  howItWorks: "Uses client-side setInterval timers with second-level countdown accuracy.",
  privacyInfo: "Runs locally with zero external network tracking.",
  faqs: [
    {
      question: "Can I pause the timer during a session?",
      answer: "Yes, click Pause at any time to freeze the countdown, then click Start to resume."
    }
  ],
  relatedSlugs: [
    "stopwatch",
    "time-converter",
    "random-question-picker"
  ]
},

  {
  id: "stopwatch",
  slug: "stopwatch",
  name: "Stopwatch & Lap Timer",
  description: "Track elapsed time with millisecond precision, pause controls, and reset capabilities.",
  category: "Calculators",
  keywords: [
    "stopwatch",
    "timer",
    "lap timer",
    "elapsed time",
    "counter"
  ],
  icon: "Clock",
  popular: false,
  seoTitle: "Online Stopwatch - Accurate Time Tracking Tool",
  seoDescription: "Track time with start, pause, and reset controls directly in your browser.",
  whatItDoes: [
    "Accurate digital stopwatch for tracking elapsed time during workouts, testing, or study sessions.",
    "Instant Start, Pause, and Reset controls."
  ],
  howToUse: [
    "Click Start to begin timing.",
    "Click Pause to halt elapsed time, or Reset to return to 00:00."
  ],
  example: {
    input: "Start stopwatch",
    output: "Live digital counter formatted in MM:SS",
    note: "Zero server dependencies, works completely offline."
  },
  howItWorks: "Uses high-precision interval timing in local browser JavaScript.",
  privacyInfo: "Timing data is maintained only in local browser state.",
  faqs: [
    {
      question: "Does the stopwatch keep running if I switch tabs?",
      answer: "Yes, the timer continues tracking elapsed time in your active browser window."
    }
  ],
  relatedSlugs: [
    "pomodoro-timer",
    "time-converter",
    "date-difference-calculator"
  ]
},

  {
  id: "fraction-calculator",
  slug: "fraction-calculator",
  name: "Fraction Calculator",
  description: "Add, subtract, multiply, and divide fractions with automated reduction and decimal conversion.",
  category: "Calculators",
  keywords: [
    "fraction",
    "fraction calculator",
    "math",
    "numerator",
    "denominator",
    "simplify fractions"
  ],
  icon: "Scale",
  popular: false,
  seoTitle: "Fraction Calculator - Add, Subtract, Multiply & Divide Fractions",
  seoDescription: "Solve fraction arithmetic problems with simplified fractional results and decimal equivalents.",
  whatItDoes: [
    "Performs addition, subtraction, multiplication, and division on two fractions.",
    "Automatically reduces the result using the Greatest Common Divisor (GCD) and displays the decimal value."
  ],
  howToUse: [
    "Enter the numerator and denominator for both fractions.",
    "Choose the arithmetic operator (+, -, *, /) to see the simplified result immediately."
  ],
  example: {
    input: "1/2 + 3/4",
    output: "5/4 (Decimal: 1.2500)",
    note: "Common denominator calculated, numerators added, and reduced to lowest terms."
  },
  howItWorks: "Applies standard fraction arithmetic rules and Euclid’s algorithm for greatest common divisor simplification.",
  privacyInfo: "Calculations run 100% on your device.",
  faqs: [
    {
      question: "Does it automatically reduce fractions to lowest terms?",
      answer: "Yes, the result is always simplified to its lowest terms alongside its decimal equivalent."
    }
  ],
  relatedSlugs: [
    "calculator",
    "percentage-calculator",
    "scientific-calculator"
  ]
},

  {
  id: "random-question-picker",
  slug: "random-question-picker",
  name: "Random Question & Decision Picker",
  description: "Pick random questions, student names, or decisions from any custom list.",
  category: "Generators",
  keywords: [
    "decision picker",
    "random question",
    "random name picker",
    "raffle",
    "shuffle list"
  ],
  icon: "Shuffle",
  popular: false,
  seoTitle: "Random Question & Name Picker - Instant Random Selector",
  seoDescription: "Paste any list of names or questions and pick a random item fairly and instantly.",
  whatItDoes: [
    "Accepts any multi-line list of questions, topics, student names, or lunch options.",
    "Fairly and randomly selects one item from your list with 1 click."
  ],
  howToUse: [
    "Type or paste your items (one per line) into the text box.",
    "Click Pick a Random Item to see the chosen selection highlighted."
  ],
  example: {
    input: "Mathematics\nComputer Science\nPhysics\nChemistry",
    output: "Randomly Selected: Computer Science",
    note: "Cryptographically unbiased pseudo-random selection."
  },
  howItWorks: "Splits text by newline and uses Math.random() over array indices.",
  privacyInfo: "Lists are processed locally and are never stored or uploaded.",
  faqs: [
    {
      question: "Can I use this for giveaways or student calling?",
      answer: "Yes, it provides an unbiased random pick every time you click the button."
    }
  ],
  relatedSlugs: [
    "random-choice",
    "random-number",
    "random-password"
  ]
},

  {
  id: "url-parser",
  slug: "url-parser",
  name: "URL Parser & Inspector",
  description: "Break down complex URLs into protocol, hostname, path, query parameters, and hash fragments.",
  category: "Developer Tools",
  keywords: [
    "url parser",
    "query string",
    "utm params",
    "url inspector",
    "hostname"
  ],
  icon: "Link2",
  popular: false,
  seoTitle: "URL Parser - Deconstruct URLs and Query Parameters",
  seoDescription: "Inspect URL components, decode query string parameters, and clean tracking tokens locally.",
  whatItDoes: [
    "Deconstructs any web address into its constituent protocol, hostname, port, pathname, and hash.",
    "Displays an organized table of all query string parameters with keys and decoded values.",
    "Provides a clean URL option with UTM and marketing tracking tokens stripped."
  ],
  howToUse: [
    "Paste your URL into the input field.",
    "Inspect the protocol, hostname, path, and detailed query parameter table below."
  ],
  example: {
    input: "https://example.com/shop?id=492&utm_source=news",
    output: "Protocol: https:, Hostname: example.com, Params: [id=492, utm_source=news]",
    note: "Cleanly isolates tracking query arguments and server paths."
  },
  howItWorks: "Uses the browser standard WHATWG URL API for robust URL decomposition.",
  privacyInfo: "URLs are parsed locally in browser memory and are never fetched over the network.",
  faqs: [
    {
      question: "Does this tool remove tracking tags like utm_source?",
      answer: "Yes, it provides a Cleaned URL feature that automatically strips utm_source, fbclid, and gclid parameters."
    }
  ],
  relatedSlugs: [
    "url-encoder",
    "url-decoder",
    "meta-tag-generator"
  ]
},

  {
  id: "meta-tag-generator",
  slug: "meta-tag-generator",
  name: "HTML Meta Tags Generator",
  description: "Generate SEO meta tags, OpenGraph social preview cards, and Twitter Cards for web pages.",
  category: "Developer Tools",
  keywords: [
    "meta tags",
    "seo generator",
    "opengraph",
    "twitter cards",
    "html head"
  ],
  icon: "Tag",
  popular: false,
  seoTitle: "SEO Meta Tag Generator - OpenGraph & Twitter Cards Tool",
  seoDescription: "Generate HTML meta tags, OpenGraph tags, and Twitter Cards with 1-click copy.",
  whatItDoes: [
    "Generates standard HTML <meta> tags for search engine titles and descriptions.",
    "Produces OpenGraph and Twitter Card markup for rich social media sharing previews."
  ],
  howToUse: [
    "Enter your page title, description, canonical URL, and social share image URL.",
    "Copy the generated HTML code directly into your document <head> section."
  ],
  example: {
    input: "Title: NOVA TOOLS, Description: Fast utilities",
    output: "<!-- Primary Meta Tags -->\n<title>NOVA TOOLS</title>\n<meta name=\"title\" content=\"NOVA TOOLS\" />...",
    note: "Produces valid W3C and OpenGraph standard markup."
  },
  howItWorks: "Formats standard HTML metadata elements and handles XML/HTML character escaping.",
  privacyInfo: "All metadata is generated client-side.",
  faqs: [
    {
      question: "What is the recommended description length?",
      answer: "Search engines typically display the first 150–160 characters of a meta description."
    }
  ],
  relatedSlugs: [
    "robots-txt-generator",
    "url-parser",
    "html-formatter"
  ]
},

  {
  id: "hex-color-tools",
  slug: "hex-color-tools",
  name: "WCAG Contrast Checker",
  description: "Check color contrast ratios against WCAG 2.1 AA and AAA accessibility standards.",
  category: "Developer Tools",
  keywords: [
    "contrast checker",
    "wcag",
    "accessibility",
    "color contrast",
    "a11y"
  ],
  icon: "Eye",
  popular: false,
  seoTitle: "WCAG Color Contrast Checker - Accessible Design Tool",
  seoDescription: "Check text and background contrast ratios for WCAG AA and AAA compliance with live preview.",
  whatItDoes: [
    "Calculates the exact contrast ratio between any foreground text color and background color.",
    "Evaluates compliance with WCAG 2.1 AA (4.5:1 normal, 3:1 large) and AAA (7:1 normal, 4.5:1 large) benchmarks."
  ],
  howToUse: [
    "Select or type hex values for text and background colors.",
    "Review the live text preview and passing/failing accessibility badges."
  ],
  example: {
    input: "Text: #ffffff, Background: #0f172a",
    output: "Contrast Ratio: 15.68 : 1 (PASS WCAG AAA Normal & Large)",
    note: "High-contrast pairing ensures optimal legibility for all users."
  },
  howItWorks: "Computes relative luminance for each color using the standard sRGB gamma-expansion formula.",
  privacyInfo: "Runs in local JavaScript.",
  faqs: [
    {
      question: "What contrast ratio is required for body text?",
      answer: "WCAG Level AA requires a contrast ratio of at least 4.5:1 for normal body text."
    }
  ],
  relatedSlugs: [
    "gradient-generator",
    "color-picker-image",
    "color-palette-generator"
  ]
},

  {
  id: "robots-txt-generator",
  slug: "robots-txt-generator",
  name: "Robots.txt Generator",
  description: "Generate valid robots.txt files to manage search engine crawler access and sitemap indexing.",
  category: "Developer Tools",
  keywords: [
    "robots.txt",
    "seo",
    "crawlers",
    "disallow",
    "sitemap robots"
  ],
  icon: "Bot",
  popular: false,
  seoTitle: "Free Robots.txt Generator - Create Search Engine Directives",
  seoDescription: "Generate valid robots.txt rules and directives for Googlebot and other web crawlers.",
  whatItDoes: [
    "Creates standard robots.txt files specifying crawler user-agents, disallow rules, and sitemap locations.",
    "Helps prevent private directories from being indexed by search engines."
  ],
  howToUse: [
    "Configure the User-agent (* for all crawlers), disallowed paths, and sitemap URL.",
    "Copy the generated robots.txt content into your website root directory."
  ],
  example: {
    input: "Agent: *, Disallow: /admin/\n/api/",
    output: "User-agent: *\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://...",
    note: "Standard robots exclusion protocol format."
  },
  howItWorks: "Parses path lines and formats directives according to the standard robots exclusion protocol.",
  privacyInfo: "Generated locally on your device.",
  faqs: [
    {
      question: "Where should the robots.txt file be placed?",
      answer: "It must be uploaded directly to the root directory of your domain (e.g. https://yourdomain.com/robots.txt)."
    }
  ],
  relatedSlugs: [
    "meta-tag-generator",
    "url-parser",
    "html-formatter"
  ]
},

  {
  id: "jpg-to-png",
  slug: "jpg-to-png",
  name: "JPG to PNG Converter",
  description: "Convert JPEG and JPG photos into lossless PNG format directly in your browser.",
  category: "Converters",
  keywords: [
    "jpg to png",
    "jpeg to png",
    "image converter",
    "lossless png",
    "convert photo"
  ],
  icon: "FileImage",
  popular: false,
  seoTitle: "JPG to PNG Converter - Fast, Free & Private Image Conversion",
  seoDescription: "Convert JPG images to PNG format locally in your browser with zero quality degradation.",
  whatItDoes: [
    "Converts JPEG images into high-quality PNG format with standard MIME typing.",
    "Performs 100% of image rendering in browser memory with instant download."
  ],
  howToUse: [
    "Select or drop your JPG/JPEG image.",
    "Preview the converted image and click Download PNG."
  ],
  example: {
    input: "photo.jpg (compressed raster)",
    output: "photo.png (lossless PNG image)",
    note: "Decoded and re-encoded using high-fidelity browser canvas rendering."
  },
  howItWorks: "Draws the image onto an HTML5 2D canvas and exports via canvas.toBlob() with image/png MIME type.",
  privacyInfo: "Images never leave your computer or device.",
  faqs: [
    {
      question: "Will converting a JPG to PNG improve image quality?",
      answer: "No, PNG cannot restore detail already lost to JPEG compression, but it prevents any further loss during future edits."
    }
  ],
  relatedSlugs: [
    "png-to-jpg",
    "webp-to-png",
    "image-compressor"
  ]
},

  {
  id: "png-to-jpg",
  slug: "png-to-jpg",
  name: "PNG to JPG Converter",
  description: "Convert transparent or large PNG images to lightweight JPG format with adjustable quality.",
  category: "Converters",
  keywords: [
    "png to jpg",
    "png to jpeg",
    "image converter",
    "compress png",
    "flatten image"
  ],
  icon: "FileImage",
  popular: false,
  seoTitle: "PNG to JPG Converter - Convert PNG to JPEG Online",
  seoDescription: "Convert PNG graphics and screenshots into compact JPEG format with custom quality sliders.",
  whatItDoes: [
    "Converts PNG files to lightweight JPG images, flattening transparency with a clean white background.",
    "Adjustable compression quality slider to reduce file size significantly."
  ],
  howToUse: [
    "Upload a PNG file, adjust the quality slider, and download the converted JPG."
  ],
  example: {
    input: "screenshot.png (3.2 MB)",
    output: "screenshot.jpg (420 KB at 80% quality)",
    note: "Significantly smaller file size suitable for web publishing and email attachments."
  },
  howItWorks: "Fills the canvas background with solid white before drawing the PNG to prevent dark transparency artifacts.",
  privacyInfo: "Processed locally in browser memory.",
  faqs: [
    {
      question: "What happens to transparent backgrounds?",
      answer: "Since JPEG does not support transparency, transparent areas are automatically rendered with a clean white fill."
    }
  ],
  relatedSlugs: [
    "jpg-to-png",
    "webp-to-jpg",
    "image-compressor"
  ]
},

  {
  id: "webp-to-png",
  slug: "webp-to-png",
  name: "WebP to PNG Converter",
  description: "Convert modern WebP images into universally compatible PNG format.",
  category: "Converters",
  keywords: [
    "webp to png",
    "convert webp",
    "image converter",
    "png export",
    "webp decoder"
  ],
  icon: "FileImage",
  popular: false,
  seoTitle: "WebP to PNG Converter - Convert WebP Images Free",
  seoDescription: "Convert WebP images to PNG files locally for maximum compatibility across older software.",
  whatItDoes: [
    "Converts WebP graphics and photos into standard PNG files.",
    "Preserves image transparency and full resolution."
  ],
  howToUse: [
    "Drop your WebP file and click Download PNG once conversion completes."
  ],
  example: {
    input: "asset.webp",
    output: "asset.png",
    note: "Ensures compatibility with legacy image editors and older operating systems."
  },
  howItWorks: "Decodes the WebP bitmap through native browser image decoders and exports as PNG.",
  privacyInfo: "100% private in-browser conversion.",
  faqs: [
    {
      question: "Does this preserve transparent layers?",
      answer: "Yes, PNG preserves all alpha transparency from the original WebP."
    }
  ],
  relatedSlugs: [
    "webp-to-jpg",
    "jpg-to-png",
    "image-resizer"
  ]
},

  {
  id: "webp-to-jpg",
  slug: "webp-to-jpg",
  name: "WebP to JPG Converter",
  description: "Convert WebP images to standard JPG format with adjustable compression quality.",
  category: "Converters",
  keywords: [
    "webp to jpg",
    "webp to jpeg",
    "image converter",
    "photo converter"
  ],
  icon: "FileImage",
  popular: false,
  seoTitle: "WebP to JPG Converter - Fast In-Browser Tool",
  seoDescription: "Easily convert WebP image files to standard JPEG photos without downloading software.",
  whatItDoes: [
    "Converts WebP images into standard JPG files compatible with all devices and printers.",
    "Offers fine-tuned quality sliders to balance clarity and file size."
  ],
  howToUse: [
    "Upload a WebP file, choose your compression level, and click Download."
  ],
  example: {
    input: "banner.webp",
    output: "banner.jpg",
    note: "Universally supported on every photo viewer and mobile device."
  },
  howItWorks: "Uses HTML5 canvas image decoding with adjustable JPEG encoder quality factors.",
  privacyInfo: "No server uploads. Entirely processed on your local CPU.",
  faqs: [
    {
      question: "Can I convert multiple formats?",
      answer: "Yes, NOVA TOOLS supports conversions across JPG, PNG, and WebP."
    }
  ],
  relatedSlugs: [
    "webp-to-png",
    "png-to-jpg",
    "image-compressor"
  ]
},

  {
  id: "image-grayscale",
  slug: "image-grayscale",
  name: "Image Grayscale Filter",
  description: "Convert color photos into high-contrast black and white images with instant preview.",
  category: "Converters",
  keywords: [
    "grayscale",
    "black and white",
    "monochrome",
    "photo filter",
    "image filter"
  ],
  icon: "Contrast",
  popular: false,
  seoTitle: "Image Grayscale Converter - Turn Photos Black & White",
  seoDescription: "Transform colored pictures into beautiful black and white monochrome images online.",
  whatItDoes: [
    "Converts any photo into a clean monochrome grayscale version.",
    "Maintains original dimensions and details while eliminating color channels."
  ],
  howToUse: [
    "Select a photo, preview the grayscale result, and download the processed image."
  ],
  example: {
    input: "vibrant_portrait.jpg",
    output: "vibrant_portrait_grayscale.jpg",
    note: "Luminance-weighted grayscale filter applied cleanly across all pixels."
  },
  howItWorks: "Applies CSS canvas filter grayscale(100%) and renders the result to an exportable blob.",
  privacyInfo: "Zero server communication. Runs offline.",
  faqs: [
    {
      question: "Does this alter my original file on disk?",
      answer: "No, your original file remains untouched. The converted image is saved as a new file."
    }
  ],
  relatedSlugs: [
    "image-blur",
    "image-compressor",
    "image-resizer"
  ]
},

  {
  id: "image-blur",
  slug: "image-blur",
  name: "Image Blur Tool",
  description: "Apply adjustable Gaussian blur filters to photos for backgrounds and privacy masking.",
  category: "Converters",
  keywords: [
    "image blur",
    "blur photo",
    "gaussian blur",
    "background blur",
    "privacy mask"
  ],
  icon: "Eye",
  popular: false,
  seoTitle: "Online Image Blur Tool - Apply Gaussian Blur Filter",
  seoDescription: "Add smooth Gaussian blur to any photo with an adjustable intensity slider in your browser.",
  whatItDoes: [
    "Applies smooth Gaussian blur effects to images with real-time intensity adjustments.",
    "Great for creating soft website background wallpapers and obscuring sensitive details."
  ],
  howToUse: [
    "Upload an image and adjust the Blur Intensity slider (1px to 40px) to desired softness.",
    "Download the blurred image in your chosen format."
  ],
  example: {
    input: "photo.jpg with Blur Intensity: 12px",
    output: "Smoothly blurred wallpaper-ready image",
    note: "Calculates convolution blur directly on canvas."
  },
  howItWorks: "Employs hardware-accelerated canvas filter blur() functions.",
  privacyInfo: "All image rendering happens locally.",
  faqs: [
    {
      question: "Can I adjust the blur strength?",
      answer: "Yes, use the slider to control the radius anywhere from a subtle 1px to heavy 40px blur."
    }
  ],
  relatedSlugs: [
    "image-grayscale",
    "image-compressor",
    "image-resizer"
  ]
},

  {
  id: "image-rotate",
  slug: "image-rotate",
  name: "Image Rotator",
  description: "Rotate images by 90-degree increments with automatic canvas dimension swapping.",
  category: "Converters",
  keywords: [
    "rotate image",
    "image orientation",
    "turn photo",
    "rotate 90 degrees"
  ],
  icon: "RotateCw",
  popular: false,
  seoTitle: "Rotate Image Online - Rotate Photos 90, 180, 270 Degrees",
  seoDescription: "Quickly rotate photos clockwise or counter-clockwise without losing quality.",
  whatItDoes: [
    "Rotates images by 90°, 180°, or 270° clockwise with proper dimension preservation.",
    "Fixes sideways or upside-down camera photos instantly."
  ],
  howToUse: [
    "Upload an image and click the Rotate 90° button until properly oriented.",
    "Click Download to save the rotated image."
  ],
  example: {
    input: "sideways_photo.jpg (1200x800)",
    output: "upright_photo.jpg (800x1200)",
    note: "Canvas dimensions automatically swap to fit rotated orientation."
  },
  howItWorks: "Applies canvas context rotation transformations and exports a clean output file.",
  privacyInfo: "Completely private client-side processing.",
  faqs: [
    {
      question: "Does rotating reduce photo quality?",
      answer: "No, rotation maintains the full pixel data and resolution."
    }
  ],
  relatedSlugs: [
    "image-flip",
    "image-resizer",
    "image-compressor"
  ]
},

  {
  id: "image-flip",
  slug: "image-flip",
  name: "Image Flipper",
  description: "Mirror images horizontally or vertically with instant interactive preview.",
  category: "Converters",
  keywords: [
    "flip image",
    "mirror photo",
    "flip horizontal",
    "flip vertical",
    "invert image"
  ],
  icon: "FlipHorizontal",
  popular: false,
  seoTitle: "Flip Image Online - Mirror Photos Horizontally & Vertically",
  seoDescription: "Mirror images horizontally or flip them vertically with 1-click preview and download.",
  whatItDoes: [
    "Flips images horizontally (mirror effect) or vertically (upside down).",
    "Supports combining both horizontal and vertical flips."
  ],
  howToUse: [
    "Upload an image and click Flip Horizontal or Flip Vertical.",
    "Download your mirrored image in PNG or JPG format."
  ],
  example: {
    input: "selfie.jpg",
    output: "mirrored_selfie.jpg",
    note: "Corrects mirrored front-facing smartphone camera photos."
  },
  howItWorks: "Uses canvas ctx.scale(-1, 1) or ctx.scale(1, -1) coordinate flipping.",
  privacyInfo: "Local device processing only.",
  faqs: [
    {
      question: "Can I flip and rotate an image at the same time?",
      answer: "Yes, flip and rotation controls can be combined seamlessly."
    }
  ],
  relatedSlugs: [
    "image-rotate",
    "image-resizer",
    "image-compressor"
  ]
},

  {
  id: "color-picker-image",
  slug: "color-picker-image",
  name: "Image Color Eyedropper",
  description: "Inspect exact HEX, RGB, and HSL color values from any pixel of an uploaded image.",
  category: "Developer Tools",
  keywords: [
    "image color picker",
    "eyedropper",
    "sample color",
    "extract hex",
    "pixel color"
  ],
  icon: "Pipette",
  popular: false,
  seoTitle: "Image Color Picker - Eyedropper Tool for Images",
  seoDescription: "Pick colors directly from photos and get exact HEX, RGB, and HSL color codes.",
  whatItDoes: [
    "Interactive crosshair eyedropper tool: click anywhere on an uploaded image to inspect the exact pixel color.",
    "Displays color swatch with 1-click copy buttons for HEX, RGB, and HSL formats."
  ],
  howToUse: [
    "Upload an image and click on any point on the canvas preview.",
    "Copy the sampled HEX or RGB color code."
  ],
  example: {
    input: "Click on a vibrant sky pixel",
    output: "HEX: #38bdf8 | RGB: rgb(56, 189, 248) | HSL: hsl(198, 93%, 60%)",
    note: "Sub-pixel accurate color sampling via 2D canvas context."
  },
  howItWorks: "Reads pixel data using canvas getImageData(x, y, 1, 1) and formats RGB channels.",
  privacyInfo: "All image sampling happens in local browser memory.",
  faqs: [
    {
      question: "Does it work with high-resolution photos?",
      answer: "Yes, it accurately maps canvas coordinate clicks to full natural image dimensions."
    }
  ],
  relatedSlugs: [
    "color-palette-generator",
    "hex-color-tools",
    "gradient-generator"
  ]
},

  {
  id: "color-palette-generator",
  slug: "color-palette-generator",
  name: "Image Color Palette Extractor",
  description: "Extract dominant color palettes and theme swatches automatically from any photo.",
  category: "Developer Tools",
  keywords: [
    "color palette",
    "palette generator",
    "dominant colors",
    "theme extractor",
    "swatches"
  ],
  icon: "Palette",
  popular: false,
  seoTitle: "Image Color Palette Extractor - Extract Dominant Colors Free",
  seoDescription: "Extract harmonious color palettes from any photo with 1-click HEX color copying.",
  whatItDoes: [
    "Analyzes pixel clusters across an uploaded image and extracts the 6 most prominent colors.",
    "Generates an interactive color palette card with 1-click HEX code copying."
  ],
  howToUse: [
    "Upload an image to automatically generate its dominant color palette.",
    "Click any color tile to copy its HEX code."
  ],
  example: {
    input: "sunset_beach.jpg",
    output: "Palette of 6 dominant tones: [#f97316, #0284c7, #fbbf24, #0f172a, #f43f5e, #e2e8f0]",
    note: "Quantized color clustering provides a cohesive design palette."
  },
  howItWorks: "Samples pixel distribution, quantizes color values into buckets, and returns the top frequency clusters.",
  privacyInfo: "Local in-browser color extraction.",
  faqs: [
    {
      question: "Can I copy individual colors from the palette?",
      answer: "Yes, clicking on any swatch immediately copies its HEX code to your clipboard."
    }
  ],
  relatedSlugs: [
    "color-picker-image",
    "gradient-generator",
    "hex-color-tools"
  ]
},

  {
  id: "image-base64",
  slug: "image-base64",
  name: "Image to Base64 Data URL",
  description: "Convert image files into inline Base64 data URLs for embedding directly into HTML and CSS.",
  category: "Developer Tools",
  keywords: [
    "image to base64",
    "data uri",
    "inline image",
    "base64 image",
    "data url"
  ],
  icon: "FileCode",
  popular: false,
  seoTitle: "Image to Base64 Converter - Generate Inline Data URIs",
  seoDescription: "Convert PNG, JPG, WebP, or SVG images into Base64 data strings for direct embedding in code.",
  whatItDoes: [
    "Encodes any image file into a standard data:image/...;base64,... string.",
    "Enables embedding icons and small graphics directly into HTML, CSS, or JSON without separate HTTP requests."
  ],
  howToUse: [
    "Upload an image file to instantly view its Base64 string and character count.",
    "Click Copy Data URL to paste into your codebase."
  ],
  example: {
    input: "logo.png (12 KB)",
    output: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0...",
    note: "Ideal for embedding vector badges and small icons directly in source files."
  },
  howItWorks: "Reads the binary file stream via FileReader.readAsDataURL().",
  privacyInfo: "Images remain entirely local.",
  faqs: [
    {
      question: "When should I use Base64 images?",
      answer: "Base64 is great for small icons, offline web pages, or email templates where external image requests are blocked."
    }
  ],
  relatedSlugs: [
    "base64",
    "base64-encoder",
    "svg-previewer"
  ]
},

  {
  id: "svg-previewer",
  slug: "svg-previewer",
  name: "SVG Viewer & Code Tester",
  description: "Preview, test, sanitize, and download scalable vector graphics (SVG) in real-time.",
  category: "Developer Tools",
  keywords: [
    "svg viewer",
    "svg preview",
    "vector preview",
    "svg code",
    "test svg"
  ],
  icon: "Sparkles",
  popular: false,
  seoTitle: "Online SVG Viewer & Code Tester - Real-Time Vector Preview",
  seoDescription: "Paste raw SVG markup to inspect, validate, and download clean vector files in real-time.",
  whatItDoes: [
    "Renders live SVG code with DOMPurify sanitization to prevent malicious script injection.",
    "Offers 1-click SVG download and code copying."
  ],
  howToUse: [
    "Paste your raw <svg> markup into the code editor.",
    "Review the live scalable rendering on the right and download when satisfied."
  ],
  example: {
    input: "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"#3b82f6\"/></svg>",
    output: "Rendered vector graphic preview with download button",
    note: "Sanitized with DOMPurify SVG profile."
  },
  howItWorks: "Validates vector markup, applies DOMPurify sanitization, and renders into an isolated container.",
  privacyInfo: "Zero remote server processing.",
  faqs: [
    {
      question: "Is it safe to paste untrusted SVG code?",
      answer: "Yes, all vector markup is sanitized with DOMPurify to strip any embedded script tags."
    }
  ],
  relatedSlugs: [
    "image-base64",
    "html-formatter",
    "image-resizer"
  ]
},

  {
  id: "pdf-compressor",
  slug: "pdf-compressor",
  name: "PDF Compressor",
  description: "Reduce PDF document file size with client-side object stream optimization.",
  category: "Converters",
  keywords: [
    "compress pdf",
    "pdf size reducer",
    "shrink pdf",
    "pdf compression",
    "small pdf"
  ],
  icon: "FileArchive",
  popular: true,
  seoTitle: "Free PDF Compressor - Reduce PDF File Size Online",
  seoDescription: "Compress PDF files directly in your browser without uploading private documents to external servers.",
  whatItDoes: [
    "Shrinks PDF file sizes using client-side stream deduplication and dictionary compression.",
    "Offers a Target Size mode with optional page rasterization for graphic-heavy documents."
  ],
  howToUse: [
    "Upload a PDF document.",
    "Specify your target file size or select standard compression mode.",
    "Click Compress PDF and download the optimized document."
  ],
  example: {
    input: "report.pdf (8.4 MB)",
    output: "compressed-document.pdf (reduced file size with intact text)",
    note: "Preserves selectable text in default safe mode."
  },
  howItWorks: "Rebuilds document cross-reference streams and compresses internal streams using pdf-lib.",
  privacyInfo: "All PDF processing happens 100% inside your browser. No files are uploaded.",
  faqs: [
    {
      question: "Are my confidential documents uploaded to any server?",
      answer: "No. All decompression and compression runs locally on your machine."
    }
  ],
  relatedSlugs: [
    "pdf-merger",
    "pdf-splitter",
    "file-size-checker"
  ]
},

  {
  id: "random-choice",
  slug: "random-choice",
  name: "Random Choice Picker",
  description: "Make decisions effortlessly by picking a random option from your custom list.",
  category: "Generators",
  keywords: [
    "random choice",
    "decision maker",
    "random pick",
    "choose for me",
    "pick option"
  ],
  icon: "Shuffle",
  popular: false,
  seoTitle: "Random Choice Picker - Instant Decision Maker",
  seoDescription: "Paste any list of choices and let the random picker select an option for you.",
  whatItDoes: [
    "Takes any list of options (restaurants, movies, tasks, names) and picks one randomly.",
    "Helps eliminate decision fatigue with quick unbiased picks."
  ],
  howToUse: [
    "Enter your options (one per line) in the text area.",
    "Click Pick a Random Item to see the chosen selection."
  ],
  example: {
    input: "Pizza\nSushi\nTacos\nBurger",
    output: "Selected Choice: Tacos",
    note: "Equally weighted probability for every item."
  },
  howItWorks: "Splits input by line breaks, filters empty rows, and picks an element via Math.floor(Math.random() * length).",
  privacyInfo: "Executed purely client-side.",
  faqs: [
    {
      question: "How many items can I enter?",
      answer: "You can enter as many choices as you want, with no arbitrary limits."
    }
  ],
  relatedSlugs: [
    "random-number",
    "random-question-picker",
    "random-password"
  ]
},

  {
  id: "number-base-converter",
  slug: "number-base-converter",
  name: "Number Base Converter",
  description: "Convert numbers simultaneously across Decimal, Binary, Octal, and Hexadecimal bases.",
  category: "Converters",
  keywords: [
    "number base",
    "binary to hex",
    "decimal to binary",
    "hexadecimal converter",
    "octal"
  ],
  icon: "Binary",
  popular: false,
  seoTitle: "Number Base Converter - Binary, Octal, Decimal & Hex",
  seoDescription: "Convert numbers across base 2 (binary), base 8 (octal), base 10 (decimal), and base 16 (hex).",
  whatItDoes: [
    "Converts integers instantaneously across Binary, Octal, Decimal, and Hexadecimal representations.",
    "Displays all four number systems in real-time side by side."
  ],
  howToUse: [
    "Enter a decimal number into the input field.",
    "Inspect the computed Binary, Octal, and Hexadecimal values."
  ],
  example: {
    input: "255",
    output: "Binary: 11111111 | Octal: 377 | Hexadecimal: 0xFF",
    note: "Standard representation across computer science numbering systems."
  },
  howItWorks: "Uses JavaScript native parseInt(val, 10).toString(radix) conversions.",
  privacyInfo: "Processed locally in browser memory.",
  faqs: [
    {
      question: "Does it support large integers?",
      answer: "Yes, standard integer range up to Number.MAX_SAFE_INTEGER is fully supported."
    }
  ],
  relatedSlugs: [
    "unit-converter",
    "data-converter",
    "calculator"
  ]
},

  {
  id: "markdown-editor",
  slug: "markdown-editor",
  name: "Markdown Editor & Live Previewer",
  description: "Write, format, preview, and sanitize Markdown documents with live split-pane rendering.",
  category: "Text Tools",
  keywords: [
    "markdown editor",
    "markdown preview",
    "md editor",
    "html preview",
    "write markdown"
  ],
  icon: "Edit",
  popular: true,
  seoTitle: "Online Markdown Editor - Live Split Preview & HTML Export",
  seoDescription: "Write and preview Markdown in real-time with formatting shortcuts and sanitized HTML export.",
  whatItDoes: [
    "Split-pane Markdown editor with real-time synchronized HTML preview.",
    "Includes one-click formatting buttons for Bold, Italic, Blockquote, and Code.",
    "Full DOMPurify sanitization ensures safe preview rendering with 1-click HTML copying."
  ],
  howToUse: [
    "Type or paste Markdown into the left editor pane.",
    "Inspect the formatted preview on the right and click Copy HTML when ready."
  ],
  example: {
    input: "# Heading 1\n**Bold text** and *italic*",
    output: "Clean HTML output with sanitized tags",
    note: "Real-time Markdown parsing with zero server round-trips."
  },
  howItWorks: "Parses Markdown syntax and sanitizes the generated HTML markup using DOMPurify.",
  privacyInfo: "Documents are processed locally in your browser session.",
  faqs: [
    {
      question: "Can I export the rendered HTML?",
      answer: "Yes, click Copy HTML to copy the sanitized HTML markup directly to your clipboard."
    }
  ],
  relatedSlugs: [
    "readability-checker",
    "word-counter",
    "html-formatter"
  ]
},

  {
  id: "text-to-slug",
  slug: "text-to-slug",
  name: "Text to URL Slug Converter",
  description: "Convert headlines and article titles into clean, SEO-friendly URL slugs.",
  category: "Text Tools",
  keywords: [
    "slug converter",
    "url slug",
    "seo slug",
    "kebab-case",
    "clean url"
  ],
  icon: "Link",
  popular: false,
  seoTitle: "Text to URL Slug Converter - Generate SEO-Friendly Slugs",
  seoDescription: "Turn headlines and titles into clean URL slugs with lowercase formatting and hyphens.",
  whatItDoes: [
    "Converts human-readable titles and strings into standardized URL slugs.",
    "Strips special punctuation, normalizes whitespace, and replaces spaces with clean hyphens."
  ],
  howToUse: [
    "Type or paste your headline into the input box.",
    "Copy the generated URL slug from the output pane."
  ],
  example: {
    input: "Top 10 Fast & Free Browser Utilities in 2026!",
    output: "top-10-fast-free-browser-utilities-in-2026",
    note: "Clean URL-safe slug with symbols removed and lowercase formatting."
  },
  howItWorks: "Performs regex normalization: lowercases, removes non-alphanumeric chars, and replaces spaces with single hyphens.",
  privacyInfo: "Runs in local memory.",
  faqs: [
    {
      question: "Why are clean URL slugs important for SEO?",
      answer: "Clean slugs improve search engine ranking and make links easy for users to read and share."
    }
  ],
  relatedSlugs: [
    "case-converter",
    "url-parser",
    "remove-extra-spaces"
  ]
},

  {
  id: "html-formatter",
  slug: "html-formatter",
  name: "HTML Formatter & Beautifier",
  description: "Format, indent, and beautify messy HTML code with clean tag hierarchy.",
  category: "Developer Tools",
  keywords: [
    "html formatter",
    "beautify html",
    "indent html",
    "clean html",
    "html prettify"
  ],
  icon: "FileCode",
  popular: false,
  seoTitle: "HTML Formatter - Beautify and Indent HTML Code",
  seoDescription: "Format and beautify raw HTML code with consistent 2-space indentation and tag alignment.",
  whatItDoes: [
    "Parses unformatted or minified HTML and indents tags with standard 2-space nesting.",
    "Handles self-closing void elements (<br>, <img>, <input>, <meta>) properly."
  ],
  howToUse: [
    "Paste your raw HTML markup into the input box.",
    "Copy the clean, indented HTML code from the output editor."
  ],
  example: {
    input: "<div><p>Hello World</p></div>",
    output: "<div>\n  <p>\n    Hello World\n  </p>\n</div>",
    note: "Hierarchical indentation makes code readable and easy to debug."
  },
  howItWorks: "Tokenizes HTML tag open/close boundaries and manages indentation depth levels.",
  privacyInfo: "Code is processed locally and never transmitted.",
  faqs: [
    {
      question: "Does this handle self-closing tags?",
      answer: "Yes, void tags such as <input>, <img>, <meta>, and <br> are detected so indentation remains accurate."
    }
  ],
  relatedSlugs: [
    "css-formatter",
    "json-formatter",
    "html-entity-encoder"
  ]
},

  {
  id: "css-formatter",
  slug: "css-formatter",
  name: "CSS Formatter & Beautifier",
  description: "Format unorganized or minified CSS stylesheets with clean brackets, indentation, and newlines.",
  category: "Developer Tools",
  keywords: [
    "css formatter",
    "beautify css",
    "css prettify",
    "indent css",
    "clean stylesheets"
  ],
  icon: "Braces",
  popular: false,
  seoTitle: "CSS Formatter - Beautify and Clean CSS Stylesheets",
  seoDescription: "Clean and format messy CSS code with proper indentation, spacing, and bracket alignment.",
  whatItDoes: [
    "Formats messy or minified CSS rules into clean, organized code blocks.",
    "Adds consistent indentation to property declarations and aligns braces."
  ],
  howToUse: [
    "Paste your CSS stylesheet code into the input pane.",
    "Copy the formatted CSS from the output editor."
  ],
  example: {
    input: ".card{display:flex;color:#fff;}",
    output: ".card {\n  display: flex;\n  color: #fff;\n}",
    note: "Properly indented rules for readability and code review."
  },
  howItWorks: "Parses CSS tokens, normalizes punctuation spacing, and inserts standardized indentation.",
  privacyInfo: "Local in-browser formatter.",
  faqs: [
    {
      question: "Can this beautify minified CSS?",
      answer: "Yes, it breaks minified one-line CSS into clear, readable multi-line rules."
    }
  ],
  relatedSlugs: [
    "html-formatter",
    "json-formatter",
    "gradient-generator"
  ]
},

  {
  id: "sql-formatter",
  slug: "sql-formatter",
  name: "SQL Query Formatter",
  description: "Format complex SQL queries with capitalized keywords and structured clause indentation.",
  category: "Developer Tools",
  keywords: [
    "sql formatter",
    "beautify sql",
    "format query",
    "uppercase sql",
    "sql beautifier"
  ],
  icon: "Terminal",
  popular: false,
  seoTitle: "SQL Formatter - Format and Indent SQL Queries Online",
  seoDescription: "Format SQL queries with capitalized keywords (SELECT, FROM, WHERE) and clean indentation.",
  whatItDoes: [
    "Formats messy single-line SQL queries into clean, readable structured SQL statements.",
    "Automatically capitalizes major SQL keywords (SELECT, FROM, WHERE, JOIN, GROUP BY, ORDER BY, etc.)."
  ],
  howToUse: [
    "Paste your raw SQL query into the input field.",
    "Copy the formatted query with capitalized clauses and proper line breaks."
  ],
  example: {
    input: "select id, name from users where active = 1 order by id desc;",
    output: "SELECT id, name \nFROM users \nWHERE active = 1 \nORDER BY id desc;",
    note: "Highlights query logic and improves team code readability."
  },
  howItWorks: "Identifies standard ANSI SQL keywords using regex boundaries and structures clauses with line breaks.",
  privacyInfo: "Database queries and schema names remain 100% private in browser memory.",
  faqs: [
    {
      question: "Does this tool connect to my database?",
      answer: "No. It is a pure text syntax formatter that never connects to or executes against any database."
    }
  ],
  relatedSlugs: [
    "json-formatter",
    "html-formatter",
    "csv-viewer"
  ]
},

  {
  id: "http-status-codes",
  slug: "http-status-codes",
  name: "HTTP Status Code Reference",
  description: "Searchable interactive guide for HTTP response codes across 2xx, 3xx, 4xx, and 5xx ranges.",
  category: "Developer Tools",
  keywords: [
    "http status",
    "status codes",
    "404 not found",
    "500 error",
    "http reference"
  ],
  icon: "Sparkles",
  popular: false,
  seoTitle: "HTTP Status Codes Reference - Searchable Developer Guide",
  seoDescription: "Look up HTTP response status codes (200, 301, 404, 500, etc.) with explanations and category filters.",
  whatItDoes: [
    "Comprehensive reference of standard HTTP response status codes with official RFC definitions.",
    "Instant search by code number or description, plus 1-click category filters (2xx, 3xx, 4xx, 5xx)."
  ],
  howToUse: [
    "Use the search bar to find a status code (e.g. \"404\" or \"gateway\") or filter by category tab.",
    "Click any card to copy the status code and title to your clipboard."
  ],
  example: {
    input: "Search: 429",
    output: "429 Too Many Requests (Rate limited by upstream API)",
    note: "Instant lookup with plain-English explanation."
  },
  howItWorks: "Maintains an offline reference catalog of IETF RFC HTTP status codes.",
  privacyInfo: "Runs entirely offline with zero network requests.",
  faqs: [
    {
      question: "What is the difference between 401 and 403?",
      answer: "401 Unauthorized means the client has not authenticated, while 403 Forbidden means the identity is known but lacks permission."
    }
  ],
  relatedSlugs: [
    "url-parser",
    "meta-tag-generator",
    "user-agent-parser"
  ]
},

  {
  id: "gst-calculator",
  slug: "gst-calculator",
  name: "Goods & Services Tax (GST) Calculator",
  description: "Calculate inclusive or exclusive GST amounts, CGST, SGST, and net totals instantly.",
  category: "Calculators",
  keywords: [
    "gst calculator",
    "tax calculator",
    "vat",
    "sales tax",
    "cgst",
    "sgst"
  ],
  icon: "Calculator",
  popular: false,
  seoTitle: "Free GST Calculator - Calculate GST Exclusive & Inclusive",
  seoDescription: "Calculate Goods and Services Tax (GST) with preset tax rates (5%, 12%, 18%, 28%) and CGST/SGST split.",
  whatItDoes: [
    "Calculates both GST Inclusive (extracting tax from a gross amount) and GST Exclusive (adding tax to a base amount).",
    "Provides quick-rate preset buttons (5%, 12%, 18%, 28%) and breaks down the Central (CGST) and State (SGST) tax shares."
  ],
  howToUse: [
    "Select Exclusive (Add GST) or Inclusive (Remove GST).",
    "Enter the amount, select or type the GST rate, and inspect the detailed financial summary."
  ],
  example: {
    input: "Amount: $5,000, GST Rate: 18% (Exclusive)",
    output: "Net: $5,000 | CGST: $450 | SGST: $450 | Total: $5,900",
    note: "Breaks down national and provincial tax components."
  },
  howItWorks: "Uses standard formulas: GST = (Amount * Rate) / 100 for exclusive, and GST = Amount - (Amount / (1 + Rate / 100)) for inclusive.",
  privacyInfo: "All financial calculations run locally.",
  faqs: [
    {
      question: "What is the difference between GST inclusive and exclusive?",
      answer: "GST Exclusive means the rate is added on top of your base price. GST Inclusive means the entered price already contains the tax amount."
    }
  ],
  relatedSlugs: [
    "discount-calculator",
    "percentage-calculator",
    "emi-calculator"
  ]
},

  {
  id: "emi-calculator",
  slug: "emi-calculator",
  name: "Loan EMI Calculator",
  description: "Calculate monthly loan EMI payments, total interest payable, and total loan cost.",
  category: "Calculators",
  keywords: [
    "emi calculator",
    "loan calculator",
    "mortgage",
    "monthly emi",
    "interest rate"
  ],
  icon: "Calculator",
  popular: false,
  seoTitle: "Loan EMI Calculator - Calculate Monthly Installments Online",
  seoDescription: "Calculate Equated Monthly Installments (EMI) for home, car, or personal loans with interest breakdown.",
  whatItDoes: [
    "Calculates your exact Equated Monthly Installment (EMI) based on principal, interest rate, and tenure.",
    "Computes total interest payable over the loan life and the total payment amount."
  ],
  howToUse: [
    "Enter the loan principal amount, annual interest rate (%), and tenure in months.",
    "Review the calculated Monthly EMI and total interest cost."
  ],
  example: {
    input: "Loan: $100,000, Interest: 8.5%, Tenure: 24 Months",
    output: "Monthly EMI: $4,545.61 | Total Interest: $9,094.67 | Total: $109,094.67",
    note: "Standard reducing balance amortization formula."
  },
  howItWorks: "Formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1] where r is monthly interest and n is total months.",
  privacyInfo: "Your financial information is processed strictly on your local device.",
  faqs: [
    {
      question: "Does this use the standard reducing balance method?",
      answer: "Yes, this uses the industry-standard reducing balance amortization formula used by banks."
    }
  ],
  relatedSlugs: [
    "gst-calculator",
    "percentage-calculator",
    "calculator"
  ]
},

  {
  id: "date-difference-calculator",
  slug: "date-difference-calculator",
  name: "Date Difference Calculator",
  description: "Calculate the exact number of days, weeks, months, and business days between two dates.",
  category: "Calculators",
  keywords: [
    "date difference",
    "days between dates",
    "business days",
    "calendar calculator",
    "duration"
  ],
  icon: "Calendar",
  popular: false,
  seoTitle: "Date Difference Calculator - Days Between Two Dates",
  seoDescription: "Calculate the total days, weeks, business days, and weekend days between any two calendar dates.",
  whatItDoes: [
    "Calculates total calendar days, weeks, and remaining days between any start and end date.",
    "Separates weekdays (business days) from weekend days (Saturday and Sunday)."
  ],
  howToUse: [
    "Select a Start Date and an End Date using the date pickers.",
    "Review the calculated total days, business days, and duration breakdown."
  ],
  example: {
    input: "Start: 2026-01-01, End: 2026-12-31",
    output: "Total Days: 364 | Business Days: 261 | Weekend Days: 103",
    note: "Accounts for leap years and calendar weekday distributions."
  },
  howItWorks: "Computes timestamp delta and iterates calendar days to accurately classify business vs weekend days.",
  privacyInfo: "Dates are processed locally in your browser.",
  faqs: [
    {
      question: "Does it count business days excluding weekends?",
      answer: "Yes, it counts Monday through Friday as business days and separates weekend days."
    }
  ],
  relatedSlugs: [
    "age-calculator",
    "time-converter",
    "stopwatch"
  ]
},

  {
  id: "roman-numeral-converter",
  slug: "roman-numeral-converter",
  name: "Roman Numeral Converter",
  description: "Convert numbers between standard Arabic integers and classical Roman numerals.",
  category: "Converters",
  keywords: [
    "roman numeral",
    "roman converter",
    "arabic to roman",
    "numeral converter",
    "latin numbers"
  ],
  icon: "Scale",
  popular: false,
  seoTitle: "Roman Numeral Converter - Convert Numbers to Roman Numerals",
  seoDescription: "Convert numbers between Roman numerals and Arabic digits (1 to 3999) with instant validation.",
  whatItDoes: [
    "Bidirectional conversion: enter an integer (1 to 3999) to get Roman numerals (e.g. 2026 -> MMXXVI), or enter Roman numerals to get an integer.",
    "Instant validation with copy button."
  ],
  howToUse: [
    "Type an integer number or a Roman numeral string into the input box.",
    "The converted value updates instantly."
  ],
  example: {
    input: "2026",
    output: "MMXXVI",
    note: "Calculates standard subtractive notation (IV, IX, XL, XC, CD, CM)."
  },
  howItWorks: "Uses subtractive notation lookup maps for integers to Roman, and lookahead accumulation for Roman to integers.",
  privacyInfo: "Runs in local memory.",
  faqs: [
    {
      question: "What is the maximum supported number?",
      answer: "Standard Roman numeral notation supports numbers from 1 up to 3999 (MMMCMXCIX)."
    }
  ],
  relatedSlugs: [
    "calculator",
    "number-base-converter",
    "unit-converter"
  ]
},
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  'Calculators',
  'Converters',
  'Generators',
  'Text Tools',
  'Developer Tools'
];

const CATEGORY_TO_SUITE: Record<string, ToolSuite> = {
  'Calculators': 'calculators',
  'Converters': 'utility',
  'Generators': 'security',
  'Text Tools': 'text',
  'Developer Tools': 'developer'
};

export const TOOLS_DATA: ToolDefinition[] = RAW_TOOLS_DATA.map((tool) => ({
  ...tool,
  suite: (({
    'image-compressor': 'image', 'image-resizer': 'image',
    'pdf-merger': 'pdf', 'pdf-splitter': 'pdf', 'jpg-to-pdf': 'pdf', 'pdf-page-rotator': 'pdf', 'pdf-page-extractor': 'pdf', 'pdf-page-deleter': 'pdf', 'file-hash-checker': 'pdf', 'file-size-checker': 'pdf', 'file-type-detector': 'pdf',
    'text-diff': 'text', 'word-counter': 'text', 'character-counter': 'text',
    'lorem-ipsum-generator': 'text', 'readability-checker': 'writing',
    'regex-tester': 'developer', 'hash-generator': 'developer', 'base64': 'developer',
    'cgpa-calculator': 'student', 'scientific-calculator': 'student',
    'gradient-generator': 'design', 'csv-viewer': 'data',
    'data-converter': 'utility', 'random-number': 'utility',
    'password-strength-checker': 'security',
    'checksum-generator': 'security',
    'random-password': 'security',
    'text-encrypt-decrypt': 'security',
    'box-shadow-generator': 'design',
    'border-radius-generator': 'design',
    'glassmorphism-generator': 'design',
    'css-button-generator': 'design',
    'gpa-calculator': 'student',
    'pomodoro-timer': 'student',
    'stopwatch': 'student',
    'fraction-calculator': 'student',
    'random-question-picker': 'student',
    'url-parser': 'web',
    'meta-tag-generator': 'web',
    'hex-color-tools': 'web',
    'robots-txt-generator': 'web',
    'jpg-to-png': 'image',
    'png-to-jpg': 'image',
    'webp-to-png': 'image',
    'webp-to-jpg': 'image',
    'image-grayscale': 'image',
    'image-blur': 'image',
    'image-rotate': 'image',
    'image-flip': 'image',
    'color-picker-image': 'image',
    'color-palette-generator': 'image',
    'image-base64': 'image',
    'svg-previewer': 'image',
    'pdf-compressor': 'pdf',
    'random-choice': 'utility',
    'number-base-converter': 'utility',
    'markdown-editor': 'writing',
    'text-to-slug': 'text',
    'html-formatter': 'developer',
    'css-formatter': 'developer',
    'sql-formatter': 'developer',
    'http-status-codes': 'developer',
    'gst-calculator': 'calculators',
    'emi-calculator': 'calculators',
    'date-difference-calculator': 'calculators',
    'roman-numeral-converter': 'calculators'
  } as Record<string, ToolSuite>)[tool.id] || (tool.id === 'qr-generator'
    ? 'web'
    : tool.id === 'data-converter'
    ? 'data'
    : tool.id === 'temperature-converter'
    ? 'calculators'
    : tool.id === 'uuid-generator' || tool.id === 'timestamp-converter'
    ? 'developer'
    : CATEGORY_TO_SUITE[tool.category || ''] || 'utility')) as ToolSuite,
}));

export const TOOLS_BY_SLUG: Map<string, ToolDefinition> = new Map(
  TOOLS_DATA.map((tool) => [tool.slug, tool])
);

export const FEATURED_TOOLS: ToolDefinition[] = TOOLS_DATA.filter(
  (t) => t.popular || t.featured
);

