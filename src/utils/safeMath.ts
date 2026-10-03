/**
 * Safe Mathematical Expression Parser & Evaluator
 * Absolutely NO eval(), Function(), or dynamic code execution.
 * Evaluates expressions using an AST / recursive-descent parser.
 */

type TokenType = 'NUMBER' | 'OP' | 'LPAREN' | 'RPAREN' | 'FUNC' | 'CONST';

interface Token {
  type: TokenType;
  value: string;
  numValue?: number;
}

export function evaluateSafeMath(expression: string): { result?: number; error?: string } {
  try {
    const clean = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/MOD/gi, '%')
      .trim();

    if (!clean) return { result: 0 };

    const tokens = tokenize(clean);
    if (tokens.length === 0) return { result: 0 };

    let pos = 0;

    function peek(): Token | undefined {
      return tokens[pos];
    }

    function consume(expected?: string): Token {
      const token = tokens[pos];
      if (!token) throw new Error('Unexpected end of expression');
      if (expected && token.value !== expected) {
        throw new Error(`Expected '${expected}', got '${token.value}'`);
      }
      pos++;
      return token;
    }

    // Grammar:
    // Expr   := Term (('+' | '-') Term)*
    // Term   := Factor (('*' | '/' | '%') Factor)*
    // Factor := Power ('^' Power)*
    // Power  := ('+' | '-')? Primary
    // Primary:= NUMBER | CONST | FUNC '(' Expr ')' | '(' Expr ')'

    function parseExpression(): number {
      let left = parseTerm();
      while (peek() && (peek()!.value === '+' || peek()!.value === '-')) {
        const op = consume().value;
        const right = parseTerm();
        if (op === '+') left += right;
        else left -= right;
      }
      return left;
    }

    function parseTerm(): number {
      let left = parseFactor();
      while (peek() && (peek()!.value === '*' || peek()!.value === '/' || peek()!.value === '%')) {
        const op = consume().value;
        const right = parseFactor();
        if (op === '*') left *= right;
        else if (op === '/') {
          if (right === 0) throw new Error('Division by zero');
          left /= right;
        } else if (op === '%') {
          if (right === 0) throw new Error('Modulo by zero');
          left %= right;
        }
      }
      return left;
    }

    function parseFactor(): number {
      let base = parsePower();
      if (peek() && peek()!.value === '^') {
        consume('^');
        const exponent = parseFactor();
        return Math.pow(base, exponent);
      }
      return base;
    }

    function parsePower(): number {
      if (peek() && (peek()!.value === '+' || peek()!.value === '-')) {
        const op = consume().value;
        const val = parsePrimary();
        return op === '-' ? -val : val;
      }
      return parsePrimary();
    }

    function parsePrimary(): number {
      const token = peek();
      if (!token) throw new Error('Unexpected end of expression');

      if (token.type === 'NUMBER') {
        consume();
        return token.numValue!;
      }

      if (token.type === 'CONST') {
        consume();
        if (token.value === 'π' || token.value === 'pi') return Math.PI;
        if (token.value === 'e') return Math.E;
        throw new Error(`Unknown constant: ${token.value}`);
      }

      if (token.type === 'FUNC') {
        const fnName = consume().value.toLowerCase();
        consume('(');
        const arg = parseExpression();
        consume(')');

        switch (fnName) {
          case 'sin':
            return Math.sin(arg);
          case 'cos':
            return Math.cos(arg);
          case 'tan':
            return Math.tan(arg);
          case 'sqrt':
            if (arg < 0) throw new Error('Square root of negative number');
            return Math.sqrt(arg);
          case 'log':
          case 'log10':
            if (arg <= 0) throw new Error('Logarithm of non-positive number');
            return Math.log10(arg);
          case 'ln':
            if (arg <= 0) throw new Error('Logarithm of non-positive number');
            return Math.log(arg);
          case 'abs':
            return Math.abs(arg);
          case 'round':
            return Math.round(arg);
          case 'floor':
            return Math.floor(arg);
          case 'ceil':
            return Math.ceil(arg);
          default:
            throw new Error(`Unsupported function: ${fnName}`);
        }
      }

      if (token.type === 'LPAREN') {
        consume('(');
        const val = parseExpression();
        consume(')');
        return val;
      }

      throw new Error(`Unexpected token: ${token.value}`);
    }

    const value = parseExpression();

    if (pos < tokens.length) {
      throw new Error(`Extra token found: ${tokens[pos].value}`);
    }

    if (!isFinite(value)) {
      return { error: 'Calculation resulted in infinity or undefined' };
    }

    // Round subtle float inaccuracies (e.g. 0.1 + 0.2)
    const rounded = Number(Math.round(Number(value + 'e+12')) + 'e-12');
    return { result: rounded };
  } catch (err: any) {
    return { error: err.message || 'Invalid mathematical expression' };
  }
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (char === '+' || char === '-' || char === '*' || char === '/' || char === '^' || char === '%') {
      tokens.push({ type: 'OP', value: char });
      i++;
      continue;
    }

    // Numbers
    if (/\d|\./.test(char)) {
      let numStr = '';
      let hasDot = false;
      while (i < input.length && (/\d|\./.test(input[i]))) {
        if (input[i] === '.') {
          if (hasDot) throw new Error('Malformed number with multiple decimal points');
          hasDot = true;
        }
        numStr += input[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr, numValue: parseFloat(numStr) });
      continue;
    }

    // Identifiers (functions or constants)
    if (/[a-zA-Zπ]/.test(char)) {
      let ident = '';
      while (i < input.length && /[a-zA-Z0-9π]/.test(input[i])) {
        ident += input[i];
        i++;
      }
      const lower = ident.toLowerCase();
      if (lower === 'pi' || ident === 'π' || lower === 'e') {
        tokens.push({ type: 'CONST', value: lower === 'pi' ? 'π' : ident });
      } else if (['sin', 'cos', 'tan', 'sqrt', 'log', 'log10', 'ln', 'abs', 'round', 'floor', 'ceil'].includes(lower)) {
        tokens.push({ type: 'FUNC', value: lower });
      } else {
        throw new Error(`Unrecognized symbol: ${ident}`);
      }
      continue;
    }

    throw new Error(`Unrecognized character: ${char}`);
  }

  return tokens;
}
