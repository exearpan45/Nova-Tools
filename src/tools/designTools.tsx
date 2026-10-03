import React, { useState } from 'react';
import {
  Palette, Pipette, Layers, Sparkles, Box, SquareDashedBottomCode,
  MousePointerClick, Airplay, Type, Shapes, Image, Check, Copy, Download
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface DesignProps {
  toolSlug: string;
}

export const DesignTools: React.FC<DesignProps> = ({ toolSlug }) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Gradient Generator states
  const [gradType, setGradType] = useState<'linear' | 'radial'>('linear');
  const [gradAngle, setGradAngle] = useState<number>(135);
  const [gradColor1, setGradColor1] = useState<string>('#3b82f6');
  const [gradColor2, setGradColor2] = useState<string>('#8b5cf6');
  const [gradColor3, setGradColor3] = useState<string>('#ec4899');

  // Box Shadow states
  const [shadowX, setShadowX] = useState<number>(0);
  const [shadowY, setShadowY] = useState<number>(10);
  const [shadowBlur, setShadowBlur] = useState<number>(25);
  const [shadowSpread, setShadowSpread] = useState<number>(-5);
  const [shadowColor, setShadowColor] = useState<string>('rgba(0, 0, 0, 0.3)');
  const [shadowInset, setShadowInset] = useState<boolean>(false);

  // Glassmorphism states
  const [glassBlur, setGlassBlur] = useState<number>(16);
  const [glassOpacity, setGlassOpacity] = useState<number>(20);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState<number>(30);

  // Border Radius states
  const [radiusTL, setRadiusTL] = useState<number>(24);
  const [radiusTR, setRadiusTR] = useState<number>(24);
  const [radiusBR, setRadiusBR] = useState<number>(24);
  const [radiusBL, setRadiusBL] = useState<number>(24);

  // CSS Button Generator states
  const [btnText, setBtnText] = useState<string>('Explore Workflows');
  const [btnBg, setBtnBg] = useState<string>('#6366f1');
  const [btnTextColor, setBtnTextColor] = useState<string>('#ffffff');
  const [btnRadius, setBtnRadius] = useState<number>(12);
  const [btnPaddingX, setBtnPaddingX] = useState<number>(24);
  const [btnPaddingY, setBtnPaddingY] = useState<number>(12);

  // CSS Outputs
  const gradientCss = gradType === 'linear'
    ? `background: linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2}, ${gradColor3});`
    : `background: radial-gradient(circle at center, ${gradColor1}, ${gradColor2}, ${gradColor3});`;

  const shadowCss = `box-shadow: ${shadowInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};`;

  const glassCss = `background: rgba(255, 255, 255, ${(glassOpacity / 100).toFixed(2)});
backdrop-filter: blur(${glassBlur}px);
-webkit-backdrop-filter: blur(${glassBlur}px);
border: 1px solid rgba(255, 255, 255, ${(glassBorderOpacity / 100).toFixed(2)});`;

  const radiusCss = `border-radius: ${radiusTL}px ${radiusTR}px ${radiusBR}px ${radiusBL}px;`;

  const buttonCss = `background-color: ${btnBg};
color: ${btnTextColor};
padding: ${btnPaddingY}px ${btnPaddingX}px;
border-radius: ${btnRadius}px;
font-weight: 600;
transition: all 0.2s ease;`;

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* CSS Gradient Generator */}
      {(toolSlug === 'gradient-generator' || toolSlug === 'css-gradient-generator') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setGradType('linear')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg ${
                  gradType === 'linear' ? 'bg-fuchsia-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                Linear
              </button>
              <button
                onClick={() => setGradType('radial')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg ${
                  gradType === 'radial' ? 'bg-fuchsia-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                Radial
              </button>
            </div>

            {gradType === 'linear' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Angle: {gradAngle}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradAngle}
                  onChange={(e) => setGradAngle(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Color 1</label>
                <input
                  type="color"
                  value={gradColor1}
                  onChange={(e) => setGradColor1(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Color 2</label>
                <input
                  type="color"
                  value={gradColor2}
                  onChange={(e) => setGradColor2(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Color 3</label>
                <input
                  type="color"
                  value={gradColor3}
                  onChange={(e) => setGradColor3(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CSS Code</span>
                <button
                  onClick={() => handleCopy(gradientCss)}
                  className="text-xs text-fuchsia-500 hover:underline font-medium"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                value={gradientCss}
                className="w-full h-20 p-2 font-mono text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div
            className="w-full h-80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center text-white font-bold text-lg drop-shadow"
            style={{
              background:
                gradType === 'linear'
                  ? `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2}, ${gradColor3})`
                  : `radial-gradient(circle at center, ${gradColor1}, ${gradColor2}, ${gradColor3})`,
            }}
          >
            Live Gradient Canvas
          </div>
        </div>
      )}

      {/* Glassmorphism Generator */}
      {toolSlug === 'glassmorphism-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Backdrop Blur ({glassBlur}px)</label>
              <input
                type="range"
                min="0"
                max="40"
                value={glassBlur}
                onChange={(e) => setGlassBlur(Number(e.target.value))}
                className="w-full accent-fuchsia-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Background Opacity ({glassOpacity}%)</label>
              <input
                type="range"
                min="5"
                max="90"
                value={glassOpacity}
                onChange={(e) => setGlassOpacity(Number(e.target.value))}
                className="w-full accent-fuchsia-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Border Opacity ({glassBorderOpacity}%)</label>
              <input
                type="range"
                min="0"
                max="80"
                value={glassBorderOpacity}
                onChange={(e) => setGlassBorderOpacity(Number(e.target.value))}
                className="w-full accent-fuchsia-500"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CSS Code</span>
                <button
                  onClick={() => handleCopy(glassCss)}
                  className="text-xs text-fuchsia-500 hover:underline font-medium"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                value={glassCss}
                className="w-full h-24 p-2 font-mono text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          </div>

          {/* Frosted Glass Demo Container with Colorful Background Shapes */}
          <div className="relative w-full h-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center p-8">
            <div className="absolute top-4 left-6 w-32 h-32 rounded-full bg-cyan-500 blur-xl opacity-70 animate-pulse" />
            <div className="absolute bottom-4 right-6 w-36 h-36 rounded-full bg-fuchsia-500 blur-xl opacity-70 animate-pulse" />
            <div
              className="relative p-6 rounded-2xl shadow-xl max-w-sm text-center text-white"
              style={{
                background: `rgba(255, 255, 255, ${(glassOpacity / 100).toFixed(2)})`,
                backdropFilter: `blur(${glassBlur}px)`,
                WebkitBackdropFilter: `blur(${glassBlur}px)`,
                border: `1px solid rgba(255, 255, 255, ${(glassBorderOpacity / 100).toFixed(2)})`,
              }}
            >
              <h4 className="font-bold text-base mb-1">Glass Card Preview</h4>
              <p className="text-xs text-white/80">
                Smooth frosted glass surface over dynamic background colors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Box Shadow Generator */}
      {toolSlug === 'box-shadow-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Offset X ({shadowX}px)</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowX}
                  onChange={(e) => setShadowX(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Offset Y ({shadowY}px)</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowY}
                  onChange={(e) => setShadowY(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Blur Radius ({shadowBlur}px)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={shadowBlur}
                  onChange={(e) => setShadowBlur(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Spread Radius ({shadowSpread}px)</label>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={shadowSpread}
                  onChange={(e) => setShadowSpread(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CSS Code</span>
                <button
                  onClick={() => handleCopy(shadowCss)}
                  className="text-xs text-fuchsia-500 hover:underline font-medium"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                value={shadowCss}
                className="w-full h-16 p-2 font-mono text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          </div>

          <div className="w-full h-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
            <div
              className="w-48 h-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300"
              style={{
                boxShadow: `${shadowInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`,
              }}
            >
              Shadow Card
            </div>
          </div>
        </div>
      )}

      {/* Button & Border Radius Tools */}
      {(toolSlug === 'css-button-generator' || toolSlug === 'border-radius-generator') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Button Label</label>
              <input
                type="text"
                value={btnText}
                onChange={(e) => setBtnText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Background Color</label>
                <input
                  type="color"
                  value={btnBg}
                  onChange={(e) => setBtnBg(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Text Color</label>
                <input
                  type="color"
                  value={btnTextColor}
                  onChange={(e) => setBtnTextColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Border Radius ({btnRadius}px)</label>
              <input
                type="range"
                min="0"
                max="32"
                value={btnRadius}
                onChange={(e) => setBtnRadius(Number(e.target.value))}
                className="w-full accent-fuchsia-500"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CSS Code</span>
                <button
                  onClick={() => handleCopy(buttonCss)}
                  className="text-xs text-fuchsia-500 hover:underline font-medium"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                value={buttonCss}
                className="w-full h-24 p-2 font-mono text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          </div>

          <div className="w-full h-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
            <button
              style={{
                backgroundColor: btnBg,
                color: btnTextColor,
                padding: `${btnPaddingY}px ${btnPaddingX}px`,
                borderRadius: `${btnRadius}px`,
              }}
              className="font-semibold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              {btnText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
