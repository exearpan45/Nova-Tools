export interface MathExpressionResult {
  success: boolean;
  result: number | string;
  error?: string;
}

/**
 * Evaluate a small arithmetic language without eval or Function.
 * Supports decimal numbers, parentheses, unary signs, +, -, *, / and remainder (%).
 */
export function evaluateMathExpression(expression: string): MathExpressionResult {
  const input = expression.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/');
  if (!input) return { success: true, result: 0 };

  const tokens: Array<number | string> = [];
  let index = 0;

  while (index < input.length) {
    const char = input[index];
    if (/[0-9.]/.test(char)) {
      const start = index;
      let dots = 0;
      let digits = 0;
      while (index < input.length && /[0-9.]/.test(input[index])) {
        if (input[index] === '.') dots++;
        else digits++;
        index++;
      }
      if (dots > 1 || digits === 0) {
        return { success: false, result: '', error: 'Invalid number format' };
      }
      const value = Number(input.slice(start, index));
      if (!Number.isFinite(value)) {
        return { success: false, result: '', error: 'Number is outside the supported range' };
      }
      tokens.push(value);
      continue;
    }

    if ('+-*/%()'.includes(char)) {
      tokens.push(char);
      index++;
      continue;
    }

    return { success: false, result: '', error: 'Invalid characters in expression' };
  }

  let cursor = 0;
  const peek = () => tokens[cursor];
  const consume = () => tokens[cursor++];

  const parsePrimary = (): number => {
    const token = consume();
    if (typeof token === 'number') return token;
    if (token === '(') {
      const value = parseExpression();
      if (consume() !== ')') throw new Error('Missing closing parenthesis');
      return value;
    }
    throw new Error('Expected a number or opening parenthesis');
  };

  const parseUnary = (): number => {
    if (peek() === '+') {
      consume();
      return parseUnary();
    }
    if (peek() === '-') {
      consume();
      return -parseUnary();
    }
    return parsePrimary();
  };

  const parseTerm = (): number => {
    let value = parseUnary();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const operator = consume();
      const right = parseUnary();
      if ((operator === '/' || operator === '%') && right === 0) {
        throw new Error(operator === '/' ? 'Cannot divide by zero' : 'Cannot calculate remainder by zero');
      }
      if (operator === '*') value *= right;
      else if (operator === '/') value /= right;
      else value %= right;
      if (!Number.isFinite(value)) throw new Error('Calculation result is outside the supported range');
    }
    return value;
  };

  function parseExpression(): number {
    let value = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const operator = consume();
      const right = parseTerm();
      value = operator === '+' ? value + right : value - right;
      if (!Number.isFinite(value)) throw new Error('Calculation result is outside the supported range');
    }
    return value;
  }

  try {
    const value = parseExpression();
    if (cursor !== tokens.length) throw new Error('Unexpected operator or missing operator');
    const rounded = Math.round((value + Number.EPSILON) * 1e8) / 1e8;
    if (!Number.isFinite(rounded)) throw new Error('Calculation result is outside the supported range');
    return { success: true, result: Object.is(rounded, -0) ? 0 : rounded };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Calculation error';
    return { success: false, result: message.includes('zero') ? message : '', error: message };
  }
}
