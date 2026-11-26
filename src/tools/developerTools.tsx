import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Code2, Copy, Check, Braces, RefreshCw, Key, Shield,
  Link, Unlink, Lock, Clock, Terminal, Sparkles, FileJson, Play,
  Download, Upload, FileCode, Layers, AlertCircle, Eye, Binary
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface DevProps {
  toolSlug: string;
}

const getDefaultDevInput = (slug: string): string => {
  if (slug.includes('json')) {
    return '{"name":"NOVA TOOLS","type":"Productivity Suite","features":["100+ Tools","Client-Side","Zero-Upload"]}';
  }
  if (slug.includes('jwt')) {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFycGFuIEdvc3dhbWkiLCJyb2xlIjoiY3JlYXRvciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTAwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  }
  if (slug.includes('regex')) {
    return 'Contact us at nova@example.com or support@nova-tools.dev for updates on v2.1!';
  }
  if (slug === 'html-formatter') {
    return '<div class="container"><header><h1>NOVA TOOLS</h1><nav><a href="/tools">All Tools</a></nav></header><main><p>Fast client-side utilities.</p></main></div>';
  }
  if (slug === 'css-formatter') {
    return '.card{display:flex;align-items:center;background:#080D1C;color:#F5F7FF;padding:16px;border-radius:12px;border:1px solid rgba(170,190,255,0.15);}';
  }
  if (slug === 'sql-formatter') {
    return 'select u.id, u.name, count(o.id) as total_orders from users u left join orders o on u.id = o.user_id where u.active = 1 and o.status = "completed" group by u.id order by total_orders desc limit 20;';
  }
  return 'Hello NOVA TOOLS!';
};

const decodeBase64Url = (segment: string): string => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const DeveloperTools: React.FC<DevProps> = ({ toolSlug }) => {
  const [inputVal, setInputVal] = useState<string>(() => getDefaultDevInput(toolSlug));

  useEffect(() => {
    setInputVal(getDefaultDevInput(toolSlug));
  }, [toolSlug]);

  // ================= 1. CODE PLAYGROUND STATES =================
  const [htmlCode, setHtmlCode] = useState<string>(
    `<div class="card">\n  <h2>🚀 NOVA Interactive Card</h2>\n  <p>Click the button below to test reactive JS!</p>\n  <button id="counterBtn">Clicks: 0</button>\n</div>`
  );
  const [cssCode, setCssCode] = useState<string>(
    `body {\n  font-family: system-ui, sans-serif;\n  background: #080D1C;\n  color: #F5F7FF;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 90vh;\n  margin: 0;\n}\n.card {\n  background: #10182B;\n  border: 1px solid rgba(118, 87, 255, 0.3);\n  padding: 24px;\n  border-radius: 16px;\n  text-align: center;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.5);\n}\nbutton {\n  background: linear-gradient(135deg, #7657FF, #00D9FF);\n  border: none;\n  color: white;\n  padding: 10px 20px;\n  border-radius: 10px;\n  font-weight: bold;\n  cursor: pointer;\n  transition: transform 0.15s;\n}\nbutton:active { transform: scale(0.95); }`
  );
  const [jsCode, setJsCode] = useState<string>(
    `let count = 0;\nconst btn = document.getElementById('counterBtn');\nbtn.addEventListener('click', () => {\n  count++;\n  btn.textContent = 'Clicks: ' + count;\n  console.log('Button clicked! New count:', count);\n});`
  );
  const [activeEditorTab, setActiveEditorTab] = useState<'html' | 'css' | 'js' | 'console'>('html');
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: 'log' | 'error' | 'warn'; text: string; time: string }>>([]);

  // ================= 2. FILE INSPECTOR STATES =================
  const [inspectedFile, setInspectedFile] = useState<{
    name: string;
    size: number;
    type: string;
    lastModified: number;
  } | null>(null);
  const [fileHashes, setFileHashes] = useState<{ sha256: string; sha1: string; sha384: string }>({
    sha256: '',
    sha1: '',
    sha384: ''
  });
  const [hexRows, setHexRows] = useState<string[]>([]);
  const [hexPage, setHexPage] = useState<number>(0);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);

  const [regexPattern, setRegexPattern] = useState<string>('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [regexFlags, setRegexFlags] = useState<string>('g');
  const [regexReplace, setRegexReplace] = useState<string>('');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState<boolean>(false);

  // UUID batch count
  const [uuidCount, setUuidCount] = useState<number>(5);
  // Hash algorithm
  const [hashResults, setHashResults] = useState<{ sha256: string; sha512: string; sha384: string; sha1: string }>({
    sha256: '',
    sha512: '',
    sha384: '',
    sha1: ''
  });

  // Timestamp
  const [epochInput, setEpochInput] = useState<string>(Math.floor(Date.now() / 1000).toString());

  // Random string generator
  const [strLength, setStrLength] = useState<number>(32);
  const [charSet, setCharSet] = useState<{ upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }>({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });

  // Color converter states
  const [hexInput, setHexInput] = useState<string>('#3b82f6');

  // HTTP Status codes states
  const [httpSearch, setHttpSearch] = useState<string>('');
  const [httpFilter, setHttpFilter] = useState<'all' | '2xx' | '3xx' | '4xx' | '5xx'>('all');

  const httpStatusCatalog = useMemo(() => [
    { code: 200, name: 'OK', desc: 'Standard successful HTTP response for request.' },
    { code: 201, name: 'Created', desc: 'The request has succeeded and a new resource has been created.' },
    { code: 204, name: 'No Content', desc: 'The server successfully processed the request, but is not returning any content.' },
    { code: 301, name: 'Moved Permanently', desc: 'The requested resource has been assigned a new permanent URI.' },
    { code: 302, name: 'Found', desc: 'The resource resides temporarily under a different URI.' },
    { code: 304, name: 'Not Modified', desc: 'Indicates the client has the latest version cached and no body needs to be retransmitted.' },
    { code: 400, name: 'Bad Request', desc: 'The server cannot process the request due to client syntax error or malformed frame.' },
    { code: 401, name: 'Unauthorized', desc: 'Authentication is required and has failed or has not yet been provided.' },
    { code: 403, name: 'Forbidden', desc: 'The client does not have access rights to the requested content.' },
    { code: 404, name: 'Not Found', desc: 'The server cannot find the requested resource.' },
    { code: 405, name: 'Method Not Allowed', desc: 'The request method is known by the server but not supported by the target resource.' },
    { code: 409, name: 'Conflict', desc: 'The request could not be completed due to a conflict with the current state of the resource.' },
    { code: 422, name: 'Unprocessable Entity', desc: 'The request was well-formed but was unable to be followed due to semantic errors.' },
    { code: 429, name: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time (rate limited).' },
    { code: 500, name: 'Internal Server Error', desc: 'The server encountered an unexpected condition that prevented it from fulfilling the request.' },
    { code: 502, name: 'Bad Gateway', desc: 'The server, while acting as a gateway or proxy, received an invalid response.' },
    { code: 503, name: 'Service Unavailable', desc: 'The server is currently unable to handle the request due to maintenance or overload.' },
    { code: 504, name: 'Gateway Timeout', desc: 'The server acting as a gateway or proxy did not receive a timely response from an upstream server.' }
  ], []);

  const filteredHttpStatuses = useMemo(() => {
    return httpStatusCatalog.filter((item) => {
      const matchFilter =
        httpFilter === 'all' ||
        (httpFilter === '2xx' && item.code >= 200 && item.code < 300) ||
        (httpFilter === '3xx' && item.code >= 300 && item.code < 400) ||
        (httpFilter === '4xx' && item.code >= 400 && item.code < 500) ||
        (httpFilter === '5xx' && item.code >= 500 && item.code < 600);
      const q = httpSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        String(item.code).includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [httpStatusCatalog, httpFilter, httpSearch]);

  // Code playground message listener for logs
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data && e.data.type === 'NOVA_CONSOLE') {
        const time = new Date().toLocaleTimeString();
        setConsoleLogs((prev) => [{ type: e.data.level, text: e.data.text, time }, ...prev.slice(0, 49)]);
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  const playgroundSrcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>${cssCode}</style>
    <script>
      const _log = console.log;
      const _err = console.error;
      window.addEventListener('error', (e) => {
        window.parent.postMessage({ type: 'NOVA_CONSOLE', level: 'error', text: e.message }, '*');
      });
      console.log = (...args) => {
        _log(...args);
        window.parent.postMessage({ type: 'NOVA_CONSOLE', level: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
      };
      console.error = (...args) => {
        _err(...args);
        window.parent.postMessage({ type: 'NOVA_CONSOLE', level: 'error', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
      };
    <\/script>
  </head>
  <body>
    ${htmlCode}
    <script>${jsCode}<\/script>
  </body>
</html>`;
  }, [htmlCode, cssCode, jsCode]);

  const handleDownloadPlayground = () => {
    const blob = new Blob([playgroundSrcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-playground-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadPlaygroundTemplate = (name: 'counter' | 'neon' | 'particles') => {
    if (name === 'counter') {
      setHtmlCode(`<div class="card">\n  <h2>🚀 Counter App</h2>\n  <p>Interactive client-side JavaScript</p>\n  <div class="actions">\n    <button id="dec">-</button>\n    <span id="num">0</span>\n    <button id="inc">+</button>\n  </div>\n</div>`);
      setCssCode(`body { font-family: system-ui, sans-serif; background: #080D1C; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 90vh; margin: 0; }\n.card { background: #10182B; padding: 32px; border-radius: 16px; text-align: center; border: 1px solid rgba(118,87,255,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }\n.actions { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 16px; }\nbutton { width: 44px; height: 44px; font-size: 20px; font-weight: bold; border-radius: 12px; border: none; background: #7657FF; color: white; cursor: pointer; }\n#num { font-size: 28px; font-weight: bold; min-width: 40px; font-family: monospace; }`);
      setJsCode(`let val = 0;\nconst num = document.getElementById('num');\ndocument.getElementById('inc').onclick = () => { val++; num.textContent = val; console.log('Incremented:', val); };\ndocument.getElementById('dec').onclick = () => { val--; num.textContent = val; console.log('Decremented:', val); };`);
    } else if (name === 'neon') {
      setHtmlCode(`<div class="container">\n  <button class="neon-btn">NOVA CYBERPUNK</button>\n</div>`);
      setCssCode(`body { background: #050811; display: grid; place-items: center; min-height: 90vh; margin: 0; font-family: sans-serif; }\n.neon-btn {\n  padding: 16px 36px;\n  color: #00D9FF;\n  background: transparent;\n  border: 2px solid #00D9FF;\n  border-radius: 12px;\n  font-size: 18px;\n  font-weight: 900;\n  letter-spacing: 2px;\n  cursor: pointer;\n  box-shadow: 0 0 15px rgba(0,217,255,0.4), inset 0 0 15px rgba(0,217,255,0.2);\n  transition: 0.2s;\n}\n.neon-btn:hover {\n  background: #00D9FF;\n  color: #050811;\n  box-shadow: 0 0 30px rgba(0,217,255,0.8);\n}`);
      setJsCode(`document.querySelector('.neon-btn').addEventListener('click', () => {\n  console.log('Neon button activated!');\n});`);
    } else if (name === 'particles') {
      setHtmlCode(`<canvas id="canvas"></canvas>`);
      setCssCode(`body { margin: 0; overflow: hidden; background: #080D1C; }\ncanvas { display: block; }`);
      setJsCode(`const canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\ncanvas.width = 400;\ncanvas.height = 300;\nconst particles = Array.from({ length: 40 }, () => ({\n  x: Math.random() * canvas.width,\n  y: Math.random() * canvas.height,\n  vx: (Math.random() - 0.5) * 2,\n  vy: (Math.random() - 0.5) * 2,\n  r: Math.random() * 3 + 1\n}));\nfunction animate() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  ctx.fillStyle = '#00D9FF';\n  particles.forEach(p => {\n    p.x += p.vx; p.y += p.vy;\n    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;\n    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;\n    ctx.beginPath();\n    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);\n    ctx.fill();\n  });\n  requestAnimationFrame(animate);\n}\nanimate();\nconsole.log('Particle simulation initialized!');`);
    }
  };

  // File inspector upload handler
  const handleInspectFile = async (file: File) => {
    setIsInspecting(true);
    setInspectedFile({
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      lastModified: file.lastModified,
    });

    try {
      const buffer = await file.arrayBuffer();

      const toHex = (buf: ArrayBuffer) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

      const sha256Buf = await crypto.subtle.digest('SHA-256', buffer);
      const sha1Buf = await crypto.subtle.digest('SHA-1', buffer);
      const sha384Buf = await crypto.subtle.digest('SHA-384', buffer);

      setFileHashes({
        sha256: toHex(sha256Buf),
        sha1: toHex(sha1Buf),
        sha384: toHex(sha384Buf),
      });

      // Generate Hex Dump (first 4KB max for smooth performance)
      const sliceLen = Math.min(buffer.byteLength, 4096);
      const uint8 = new Uint8Array(buffer.slice(0, sliceLen));
      const rows: string[] = [];
      for (let i = 0; i < uint8.length; i += 16) {
        const offset = i.toString(16).padStart(8, '0');
        const chunk = Array.from(uint8.slice(i, i + 16));
        const hex = chunk.map((b) => b.toString(16).padStart(2, '0')).join(' ').padEnd(48, ' ');
        const ascii = chunk.map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('');
        rows.push(`${offset}  ${hex}  |${ascii}|`);
      }
      setHexRows(rows);
      setHexPage(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInspecting(false);
    }
  };

  // Trigger hash calculation when input changes for hash-generator
  React.useEffect(() => {
    if (toolSlug === 'hash-generator') {
      const calcHashes = async () => {
        const encoder = new TextEncoder();
        const data = encoder.encode(inputVal);
        const toHex = (buf: ArrayBuffer) =>
          Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        try {
          const s256 = await crypto.subtle.digest('SHA-256', data);
          const s512 = await crypto.subtle.digest('SHA-512', data);
          const s384 = await crypto.subtle.digest('SHA-384', data);
          const s1 = await crypto.subtle.digest('SHA-1', data);
          setHashResults({
            sha256: toHex(s256),
            sha512: toHex(s512),
            sha384: toHex(s384),
            sha1: toHex(s1),
          });
        } catch {}
      };
      calcHashes();
    }
  }, [inputVal, toolSlug]);

  // Main output processing
  const { outputText, error } = useMemo(() => {
    try {
      switch (toolSlug) {
        case 'json-formatter':
        case 'json-validator': {
          const parsed = JSON.parse(inputVal);
          return { outputText: JSON.stringify(parsed, null, 2), error: null };
        }
        case 'json-minifier': {
          const parsed = JSON.parse(inputVal);
          return { outputText: JSON.stringify(parsed), error: null };
        }
        case 'json-to-csv': {
          const parsed = JSON.parse(inputVal);
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          if (arr.length === 0) return { outputText: '', error: null };
          const keys = Object.keys(arr[0]);
          const csvLines = [
            keys.join(','),
            ...arr.map((row) => keys.map((k) => JSON.stringify(row[k] ?? '')).join(',')),
          ];
          return { outputText: csvLines.join('\n'), error: null };
        }
        case 'csv-to-json': {
          const lines = inputVal.trim().split('\n');
          if (lines.length === 0) return { outputText: '[]', error: null };
          const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
          const rows = lines.slice(1).map((line) => {
            const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
            const obj: Record<string, any> = {};
            headers.forEach((h, i) => {
              const val = values[i];
              obj[h] = !isNaN(Number(val)) && val !== '' ? Number(val) : val;
            });
            return obj;
          });
          return { outputText: JSON.stringify(rows, null, 2), error: null };
        }
        case 'base64-encoder':
          return { outputText: btoa(unescape(encodeURIComponent(inputVal))), error: null };
        case 'base64':
          return base64Mode === 'encode'
            ? { outputText: btoa(unescape(encodeURIComponent(inputVal))), error: null }
            : { outputText: decodeURIComponent(escape(atob(inputVal))), error: null };
        case 'base64-decoder':
          return { outputText: decodeURIComponent(escape(atob(inputVal))), error: null };
        case 'url-encoder':
          return { outputText: encodeURIComponent(inputVal), error: null };
        case 'url-decoder':
          return { outputText: decodeURIComponent(inputVal), error: null };
        case 'uuid-generator': {
          const list = Array.from({ length: uuidCount }, () => crypto.randomUUID());
          return { outputText: list.join('\n'), error: null };
        }
        case 'jwt-decoder': {
          const parts = inputVal.trim().split('.');
          if (parts.length < 2) throw new Error('Invalid JWT format (must have at least header.payload parts).');
          const header = JSON.parse(decodeBase64Url(parts[0]));
          const payload = JSON.parse(decodeBase64Url(parts[1]));
          const res = {
            header,
            payload,
            expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiration',
            issuedAt: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'Unknown',
          };
          return { outputText: JSON.stringify(res, null, 2), error: null };
        }
        case 'html-entity-encoder': {
          const enc = inputVal
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
          return { outputText: enc, error: null };
        }
        case 'html-entity-decoder': {
          const doc = new DOMParser().parseFromString(inputVal, 'text/html');
          return { outputText: doc.documentElement.textContent || '', error: null };
        }
        case 'random-string-generator': {
          let pool = '';
          if (charSet.upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          if (charSet.lower) pool += 'abcdefghijklmnopqrstuvwxyz';
          if (charSet.numbers) pool += '0123456789';
          if (charSet.symbols) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?';
          if (!pool) pool = 'abcdefghijklmnopqrstuvwxyz';
          const randomVals = new Uint32Array(strLength);
          crypto.getRandomValues(randomVals);
          let res = '';
          for (let i = 0; i < strLength; i++) {
            res += pool[randomVals[i] % pool.length];
          }
          return { outputText: res, error: null };
        }
        case 'user-agent-parser': {
          const ua = navigator.userAgent;
          const info = {
            userAgent: ua,
            platform: navigator.platform,
            language: navigator.language,
            cores: navigator.hardwareConcurrency || 'Unknown',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: `${window.screen.colorDepth}-bit`,
            online: navigator.onLine,
          };
          return { outputText: JSON.stringify(info, null, 2), error: null };
        }
        case 'html-formatter': {
          let formatted = '';
          let indent = 0;
          const tab = '  ';
          const clean = inputVal.replace(/>\s*</g, '><').trim();
          const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean);
          for (const token of tokens) {
            if (token.startsWith('</')) {
              indent = Math.max(0, indent - 1);
              formatted += `${tab.repeat(indent)}${token}\n`;
            } else if (
              token.startsWith('<') &&
              !token.endsWith('/>') &&
              !token.startsWith('<!') &&
              !token.startsWith('<?') &&
              !['<area', '<base', '<br', '<col', '<embed', '<hr', '<img', '<input', '<link', '<meta', '<param', '<source', '<track', '<wbr'].some((vt) => token.toLowerCase().startsWith(vt))
            ) {
              formatted += `${tab.repeat(indent)}${token}\n`;
              indent += 1;
            } else if (token.startsWith('<')) {
              formatted += `${tab.repeat(indent)}${token}\n`;
            } else {
              const text = token.trim();
              if (text) {
                formatted += `${tab.repeat(indent)}${text}\n`;
              }
            }
          }
          return { outputText: formatted.trim(), error: null };
        }
        case 'css-formatter': {
          let formatted = inputVal
            .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
            .replace(/;/g, ';\n  ')
            .replace(/\{/g, ' {\n  ')
            .replace(/\n\s*\}/g, '\n}\n\n')
            .replace(/\}/g, '\n}\n\n')
            .trim();
          return { outputText: formatted, error: null };
        }
        case 'sql-formatter': {
          const keywords = [
            'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
            'INNER JOIN', 'OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT',
            'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
            'DROP TABLE', 'ALTER TABLE', 'AS', 'DISTINCT', 'UNION', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
          ];
          let sql = inputVal;
          for (const kw of keywords) {
            const regex = new RegExp(`\\b${kw}\\b`, 'gi');
            sql = sql.replace(regex, kw);
          }
          const mainClauses = [
            'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT',
            'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'SET', 'VALUES'
          ];
          for (const clause of mainClauses) {
            const re = new RegExp(`\\s*\\b(${clause})\\b\\s*`, 'g');
            sql = sql.replace(re, `\n$1 `);
          }
          return { outputText: sql.trim(), error: null };
        }
        default:
          return { outputText: inputVal, error: null };
      }
    } catch (e: any) {
      return { outputText: '', error: e.message || 'Syntax Error' };
    }
  }, [inputVal, toolSlug, uuidCount, strLength, charSet, base64Mode]);

  // Regex parsed analysis
  const regexAnalysis = useMemo(() => {
    if (toolSlug !== 'regex-tester') {
      return { valid: true, error: null as string | null, matches: [] as Array<{ text: string; index: number; groups: string[] }>, segments: [] as Array<{ text: string; isMatch: boolean }>, replaced: '' };
    }
    if (!regexPattern) {
      return { valid: true, error: null, matches: [], segments: [{ text: inputVal, isMatch: false }], replaced: inputVal };
    }
    try {
      const cleanFlags = Array.from(new Set(regexFlags.split('').filter((f) => 'gimsu'.includes(f)))).join('');
      const re = new RegExp(regexPattern, cleanFlags);
      const matches: Array<{ text: string; index: number; groups: string[] }> = [];
      const segments: Array<{ text: string; isMatch: boolean }> = [];

      if (cleanFlags.includes('g')) {
        let lastIndex = 0;
        let m: RegExpExecArray | null;
        let safety = 0;
        while ((m = re.exec(inputVal)) !== null && safety < 500) {
          safety++;
          if (m.index > lastIndex) {
            segments.push({ text: inputVal.slice(lastIndex, m.index), isMatch: false });
          }
          if (m[0].length > 0) {
            segments.push({ text: m[0], isMatch: true });
          }
          matches.push({ text: m[0], index: m.index, groups: m.slice(1).map((g) => g ?? '') });
          lastIndex = m.index + m[0].length;
          if (m[0].length === 0) {
            re.lastIndex += 1;
          }
        }
        if (lastIndex < inputVal.length) {
          segments.push({ text: inputVal.slice(lastIndex), isMatch: false });
        }
      } else {
        const m = re.exec(inputVal);
        if (m) {
          if (m.index > 0) segments.push({ text: inputVal.slice(0, m.index), isMatch: false });
          segments.push({ text: m[0], isMatch: true });
          if (m.index + m[0].length < inputVal.length) {
            segments.push({ text: inputVal.slice(m.index + m[0].length), isMatch: false });
          }
          matches.push({ text: m[0], index: m.index, groups: m.slice(1).map((g) => g ?? '') });
        } else {
          segments.push({ text: inputVal, isMatch: false });
        }
      }

      const replaced = regexReplace !== '' ? inputVal.replace(new RegExp(regexPattern, cleanFlags), regexReplace) : '';
      return { valid: true, error: null, matches, segments, replaced };
    } catch (e: any) {
      return { valid: false, error: e?.message || 'Invalid regular expression', matches: [], segments: [{ text: inputVal, isMatch: false }], replaced: '' };
    }
  }, [toolSlug, regexPattern, regexFlags, regexReplace, inputVal]);

  // JWT detailed analysis
  const jwtDetails = useMemo(() => {
    if (toolSlug !== 'jwt-decoder') return null;
    try {
      const parts = inputVal.trim().split('.');
      if (parts.length < 2) {
        return { error: 'Invalid JWT format. A valid token must contain at least Header and Payload segments separated by dots.' };
      }
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));
      const signature = parts[2] || '';
      const nowSec = Math.floor(Date.now() / 1000);
      const exp = typeof payload.exp === 'number' ? payload.exp : null;
      const iat = typeof payload.iat === 'number' ? payload.iat : null;
      const isExpired = exp !== null ? exp < nowSec : false;

      let expirySummary = 'No expiration claim (exp)';
      if (exp !== null) {
        const diff = Math.abs(exp - nowSec);
        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        const span = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        expirySummary = isExpired ? `Expired ${span} ago` : `Valid for ${span}`;
      }

      return {
        error: null,
        header,
        payload,
        signature,
        iatFormatted: iat ? new Date(iat * 1000).toLocaleString() : null,
        expFormatted: exp ? new Date(exp * 1000).toLocaleString() : null,
        isExpired,
        expirySummary,
      };
    } catch (e: any) {
      return { error: e?.message || 'Failed to decode JWT segments. Ensure Base64URL encoding is valid.' };
    }
  }, [toolSlug, inputVal]);

  const toggleRegexFlag = (flag: string) => {
    setRegexFlags((prev) => (prev.includes(flag) ? prev.replace(flag, '') : prev + flag));
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Special Control Header for UUID & Random String */}
      {toolSlug === 'uuid-generator' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Batch Count:</span>
            <input
              type="number"
              min="1"
              max="50"
              value={uuidCount}
              onChange={(e) => setUuidCount(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-16 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => setUuidCount((c) => c)}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-Generate UUIDs
          </button>
        </div>
      )}

      {toolSlug === 'random-string-generator' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Length: {strLength} chars</span>
            <input
              type="range"
              min="8"
              max="128"
              value={strLength}
              onChange={(e) => setStrLength(Number(e.target.value))}
              className="w-48 accent-emerald-500"
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={charSet.upper}
                onChange={(e) => setCharSet({ ...charSet, upper: e.target.checked })}
                className="rounded text-emerald-500"
              />
              Uppercase (A-Z)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={charSet.lower}
                onChange={(e) => setCharSet({ ...charSet, lower: e.target.checked })}
                className="rounded text-emerald-500"
              />
              Lowercase (a-z)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={charSet.numbers}
                onChange={(e) => setCharSet({ ...charSet, numbers: e.target.checked })}
                className="rounded text-emerald-500"
              />
              Numbers (0-9)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={charSet.symbols}
                onChange={(e) => setCharSet({ ...charSet, symbols: e.target.checked })}
                className="rounded text-emerald-500"
              />
              Symbols (!@#$)
            </label>
          </div>
        </div>
      )}

      {toolSlug === 'base64' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex gap-2">
          <button type="button" onClick={() => setBase64Mode('encode')} className={`flex-1 min-h-11 rounded-lg px-3 py-2 text-sm font-semibold ${base64Mode === 'encode' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>Encode to Base64</button>
          <button type="button" onClick={() => setBase64Mode('decode')} className={`flex-1 min-h-11 rounded-lg px-3 py-2 text-sm font-semibold ${base64Mode === 'decode' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>Decode Base64</button>
        </div>
      )}

      {/* Regex Live Tester Special Interactive View */}
      {toolSlug === 'regex-tester' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Regular Expression Pattern
                </label>
                <div className="flex items-center font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                  <span className="px-3 text-slate-400 select-none">/</span>
                  <input
                    type="text"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    placeholder="Enter regex pattern..."
                    className="w-full py-2.5 bg-transparent text-emerald-600 dark:text-emerald-400 focus:outline-none"
                  />
                  <span className="px-3 text-slate-400 select-none">/{regexFlags}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Regex Flags
                </label>
                <div className="flex items-center gap-1.5">
                  {[
                    { flag: 'g', title: 'Global match' },
                    { flag: 'i', title: 'Case-insensitive' },
                    { flag: 'm', title: 'Multiline' },
                    { flag: 's', title: 'Dot matches newline' },
                    { flag: 'u', title: 'Unicode' },
                  ].map((item) => {
                    const active = regexFlags.includes(item.flag);
                    return (
                      <button
                        key={item.flag}
                        type="button"
                        onClick={() => toggleRegexFlag(item.flag)}
                        title={item.title}
                        className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                          active
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {item.flag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Live Replace With (Optional)
              </label>
              <input
                type="text"
                value={regexReplace}
                onChange={(e) => setRegexReplace(e.target.value)}
                placeholder="e.g. [REDACTED] or $1@domain.com"
                className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            {!regexAnalysis.valid && (
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regexAnalysis.error}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Test String</span>
                <button
                  type="button"
                  onClick={() => setInputVal('')}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full h-56 p-4 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                placeholder="Paste text to test against regex..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live Match Highlighting
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono tabular-nums text-[11px] font-bold">
                  {regexAnalysis.matches.length} {regexAnalysis.matches.length === 1 ? 'match' : 'matches'}
                </span>
              </div>
              <div className="w-full h-56 p-4 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 overflow-y-auto whitespace-pre-wrap break-words leading-relaxed">
                {regexAnalysis.segments.map((seg, i) =>
                  seg.isMatch ? (
                    <mark
                      key={i}
                      className="px-0.5 rounded bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 font-semibold"
                    >
                      {seg.text}
                    </mark>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  )
                )}
              </div>
            </div>
          </div>

          {regexReplace !== '' && regexAnalysis.valid && (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Replacement Output Preview
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(regexAnalysis.replaced)}
                  className="text-xs text-emerald-500 hover:underline font-semibold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words">
                {regexAnalysis.replaced}
              </pre>
            </div>
          )}

          {regexAnalysis.matches.length > 0 && (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Matched Tokens & Capture Groups
              </span>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {regexAnalysis.matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 font-mono text-xs flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 tabular-nums">
                        #{idx + 1} @ {m.index}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white break-all">{m.text}</span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.groups.map((grp, gIdx) => (
                          <span
                            key={gIdx}
                            className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-300 text-[11px]"
                          >
                            ${gIdx + 1}: {grp || '""'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* JWT Decoder Interactive Inspector */}
      {toolSlug === 'jwt-decoder' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Encoded JWT Token
              </label>
              <button
                type="button"
                onClick={() => setInputVal('')}
                className="text-xs text-rose-500 hover:underline"
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Paste header.payload.signature JWT token here..."
              className="w-full h-28 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white break-all"
            />
          </div>

          {jwtDetails && jwtDetails.error ? (
            <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{jwtDetails.error}</span>
            </div>
          ) : jwtDetails ? (
            <div className="space-y-4">
              {/* Token Claims Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Algorithm</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white mt-1 block">
                    {jwtDetails.header?.alg || 'Unknown'} ({jwtDetails.header?.typ || 'JWT'})
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Issued At (iat)</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white mt-1 block">
                    {jwtDetails.iatFormatted || 'Not specified'}
                  </span>
                </div>
                <div
                  className={`p-3.5 rounded-xl border ${
                    jwtDetails.isExpired
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block">
                    Expiration Status
                  </span>
                  <span className="font-mono font-bold mt-1 block">{jwtDetails.expirySummary}</span>
                  {jwtDetails.expFormatted && (
                    <span className="text-[10px] font-mono opacity-80 block mt-0.5">{jwtDetails.expFormatted}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Header (Algorithm & Type)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(JSON.stringify(jwtDetails.header, null, 2))}
                      className="text-xs text-emerald-500 hover:underline font-medium"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto">
                    {JSON.stringify(jwtDetails.header, null, 2)}
                  </pre>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-500">Payload (Claims & Data)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(JSON.stringify(jwtDetails.payload, null, 2))}
                      className="text-xs text-emerald-500 hover:underline font-medium"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-emerald-600 dark:text-emerald-400 overflow-x-auto">
                    {JSON.stringify(jwtDetails.payload, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/30 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 block">
                  Signature Segment (Decoded locally; verify HMAC/RSA keys server-side before trusting claims)
                </span>
                <p className="font-mono text-xs text-slate-600 dark:text-slate-300 break-all">
                  {jwtDetails.signature || '(unsigned / empty signature)'}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Hash Generator Special View */}
      {toolSlug === 'hash-generator' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Input String to Hash
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 font-mono text-xs">
            {Object.entries(hashResults).map(([algo, h]) => (
              <div
                key={algo}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 block">
                    {algo.toUpperCase()}
                  </span>
                  <span className="text-slate-900 dark:text-slate-200 break-all">{h}</span>
                </div>
                <button
                  onClick={() => handleCopy(h)}
                  className="text-xs text-emerald-500 hover:underline shrink-0 self-start sm:self-center"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unix Timestamp Converter Special View */}
      {toolSlug === 'timestamp-converter' && (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Unix Epoch Seconds
            </label>
            <button
              onClick={() => setEpochInput(Math.floor(Date.now() / 1000).toString())}
              className="text-xs text-emerald-500 hover:underline"
            >
              Current Epoch Time
            </button>
          </div>
          <input
            type="number"
            value={epochInput}
            onChange={(e) => setEpochInput(e.target.value)}
            className="w-full px-4 py-2.5 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-sans">GMT / UTC</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {new Date(Number(epochInput) * 1000).toUTCString()}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-sans">Local Time</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {new Date(Number(epochInput) * 1000).toString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* HTTP Status Codes Interactive Reference */}
      {toolSlug === 'http-status-codes' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search by code (e.g. 404) or description..."
              value={httpSearch}
              onChange={(e) => setHttpSearch(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <div className="flex flex-wrap gap-1.5">
              {(['all', '2xx', '3xx', '4xx', '5xx'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHttpFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                    httpFilter === filter
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredHttpStatuses.map((item) => (
              <div
                key={item.code}
                onClick={() => handleCopy(`${item.code} ${item.name}`)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1 group"
                title="Click to copy code & name"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-base font-bold font-mono ${
                    item.code >= 500 ? 'text-rose-500' :
                    item.code >= 400 ? 'text-amber-500' :
                    item.code >= 300 ? 'text-sky-500' : 'text-emerald-500'
                  }`}>
                    {item.code}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-500">Copy</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Playground */}
      {toolSlug === 'code-playground' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveEditorTab('html')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeEditorTab === 'html'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveEditorTab('css')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeEditorTab === 'css'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setActiveEditorTab('js')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeEditorTab === 'js'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                JS
              </button>
              <button
                onClick={() => setActiveEditorTab('console')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeEditorTab === 'console'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console ({consoleLogs.length})</span>
              </button>
            </div>

            {/* Template Selector & Export */}
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => loadPlaygroundTemplate(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="">Load Template...</option>
                <option value="counter">Counter App</option>
                <option value="neon">Neon Cyberpunk Card</option>
                <option value="particles">2D Particle Canvas</option>
              </select>

              <button
                onClick={handleDownloadPlayground}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .HTML</span>
              </button>
            </div>
          </div>

          {/* Dual Split Pane: Editor Left, Live Preview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor Area */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xs flex flex-col h-[460px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {activeEditorTab.toUpperCase()} Editor
                </span>
                <span className="text-[11px] text-slate-400">Updates live</span>
              </div>

              {activeEditorTab === 'html' && (
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="w-full flex-1 p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none leading-relaxed"
                />
              )}

              {activeEditorTab === 'css' && (
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="w-full flex-1 p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none leading-relaxed"
                />
              )}

              {activeEditorTab === 'js' && (
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="w-full flex-1 p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
                />
              )}

              {activeEditorTab === 'console' && (
                <div className="flex-1 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-slate-950 text-xs font-mono">
                  {consoleLogs.length > 0 ? (
                    consoleLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-500 shrink-0">[{log.time}]</span>
                        <span className={log.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}>
                          {log.text}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-500">Console is empty. Run JS code to see logs.</span>
                  )}
                </div>
              )}
            </div>

            {/* Live Sandboxed Preview */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xs flex flex-col h-[460px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Isolated Sandboxed Preview
                  </span>
                </div>
                {consoleLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setConsoleLogs([])}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Clear Console
                  </button>
                )}
              </div>

              <iframe
                title="NOVA Code Playground Preview"
                srcDoc={playgroundSrcDoc}
                sandbox="allow-scripts allow-modals"
                className="w-full flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white shadow-inner"
              />
            </div>
          </div>
        </div>
      )}

      {/* File Inspector & Hex Dump Viewer */}
      {toolSlug === 'file-inspector' && (
        <div className="space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleInspectFile(f);
            }}
            className="p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-center space-y-3 hover:border-violet-500 transition-colors cursor-pointer"
            onClick={() => {
              const el = document.getElementById('file-inspector-input');
              if (el) el.click();
            }}
          >
            <input
              id="file-inspector-input"
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleInspectFile(f);
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center mx-auto">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Drop any file to inspect metadata, hashes & hex dump
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Images, PDFs, audio, videos, archives, binaries (processed 100% in-browser)
              </p>
            </div>
          </div>

          {/* Inspected Results */}
          {inspectedFile && (
            <div className="space-y-4 animate-page-enter">
              {/* Metadata Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">File Name</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-1" title={inspectedFile.name}>
                    {inspectedFile.name}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">File Size</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mt-1">
                    {(inspectedFile.size / 1024).toFixed(2)} KB ({inspectedFile.size.toLocaleString()} bytes)
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">MIME Type</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-1">
                    {inspectedFile.type}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Last Modified</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-1">
                    {new Date(inspectedFile.lastModified).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isInspecting && (
                <div className="text-xs text-violet-500 font-semibold">
                  Computing cryptographic hashes and reading binary header...
                </div>
              )}

              {/* Cryptographic Hashes */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Cryptographic Checksums
                </span>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-slate-400 shrink-0 font-bold uppercase">SHA-256</span>
                    <span className="text-emerald-500 font-semibold truncate mx-2">{fileHashes.sha256}</span>
                    <button onClick={() => handleCopy(fileHashes.sha256)} className="text-[11px] text-slate-400 hover:text-emerald-400">Copy</button>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-slate-400 shrink-0 font-bold uppercase">SHA-384</span>
                    <span className="text-violet-500 font-semibold truncate mx-2">{fileHashes.sha384}</span>
                    <button onClick={() => handleCopy(fileHashes.sha384)} className="text-[11px] text-slate-400 hover:text-violet-400">Copy</button>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-slate-400 shrink-0 font-bold uppercase">SHA-1</span>
                    <span className="text-sky-500 font-semibold truncate mx-2">{fileHashes.sha1}</span>
                    <button onClick={() => handleCopy(fileHashes.sha1)} className="text-[11px] text-slate-400 hover:text-sky-400">Copy</button>
                  </div>
                </div>
              </div>

              {/* Hex Dump Viewer */}
              {hexRows.length > 0 && (
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Hex Dump Viewer ({hexRows.length} lines of 16-bytes)
                    </span>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      Page {hexPage + 1} of {Math.ceil(hexRows.length / 16)}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                    {hexRows.slice(hexPage * 16, (hexPage + 1) * 16).map((line, idx) => (
                      <div key={idx} className="whitespace-pre">{line}</div>
                    ))}
                  </div>

                  {hexRows.length > 16 && (
                    <div className="flex justify-between items-center pt-2">
                      <button
                        disabled={hexPage === 0}
                        onClick={() => setHexPage((p) => Math.max(0, p - 1))}
                        className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs disabled:opacity-30"
                      >
                        Previous Page
                      </button>
                      <button
                        disabled={(hexPage + 1) * 16 >= hexRows.length}
                        onClick={() => setHexPage((p) => p + 1)}
                        className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs disabled:opacity-30"
                      >
                        Next Page
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Standard Dual Pane Layout for Formatter/Decoder/Encoder */}
      {toolSlug !== 'hash-generator' &&
        toolSlug !== 'timestamp-converter' &&
        toolSlug !== 'http-status-codes' &&
        toolSlug !== 'code-playground' &&
        toolSlug !== 'file-inspector' &&
        toolSlug !== 'regex-tester' &&
        toolSlug !== 'jwt-decoder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Input</span>
              <button
                onClick={() => setInputVal('')}
                className="text-xs text-rose-500 hover:underline"
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full h-80 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              placeholder="Paste code or data here..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {error ? 'Status' : 'Output'}
              </span>
              {!error && (
                <button
                  onClick={() => handleCopy(outputText)}
                  className="text-xs flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {error ? (
              <div className="w-full h-80 p-6 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-mono">
                <span className="font-bold block mb-2">Validation Error:</span>
                {error}
              </div>
            ) : (
              <textarea
                readOnly
                value={outputText}
                className="w-full h-80 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-emerald-600 dark:text-emerald-400 shadow-inner"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
