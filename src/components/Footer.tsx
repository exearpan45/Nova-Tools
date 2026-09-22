import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#121214] mt-auto transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand & Slogan */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                NOVA <span className="text-blue-600 dark:text-blue-400 font-medium">TOOLS</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Simple tools. Done well.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            <button
              id="footer-link-tools"
              onClick={() => onNavigate('/tools')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Tools
            </button>
            <button
              id="footer-link-about"
              onClick={() => onNavigate('/about')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              id="footer-link-contact"
              onClick={() => onNavigate('/contact')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button
              id="footer-link-privacy"
              onClick={() => onNavigate('/privacy-policy')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              id="footer-link-terms"
              onClick={() => onNavigate('/terms')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              id="footer-link-cookies"
              onClick={() => onNavigate('/cookie-policy')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cookies
            </button>
            <button
              id="footer-link-disclaimer"
              onClick={() => onNavigate('/disclaimer')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
          <p>Created by Arpan Goswami</p>
          <p>© 2026 Copyright Arpan Goswami. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
