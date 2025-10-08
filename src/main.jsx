import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  // Import Tailwind CSS
import siteConfig from './siteConfig'

// Lightweight analytics (Plausible) with opt-in toggle
function injectPlausible() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const enabled = localStorage.getItem('analytics:enabled');
  if (!domain || enabled === 'false') return;
  if (document.getElementById('plausible-script')) return;
  const s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = domain;
  s.src = 'https://plausible.io/js/script.js';
  s.id = 'plausible-script';
  document.head.appendChild(s);
}

window.enableAnalytics = () => {
  localStorage.setItem('analytics:enabled', 'true');
  injectPlausible();
};
window.disableAnalytics = () => {
  localStorage.setItem('analytics:enabled', 'false');
  const s = document.getElementById('plausible-script');
  if (s) s.remove();
};

injectPlausible();

// Apply font configuration early
function applyFonts(cfg) {
  try {
    const fonts = cfg?.fonts || {};
    const mode = fonts.mode || 'web';
    const root = document.documentElement;

    const setVar = (name, family, fallback) => {
      if (!family) return;
      const quoted = family.includes(' ') ? `'${family}'` : family;
      const value = fallback ? `${quoted}, ${fallback}` : quoted;
      root.style.setProperty(name, value);
    };

    // Always set variables to ensure consistency, even in system mode
    setVar('--font-sans', fonts.sans?.family || 'ui-sans-serif', fonts.sans?.fallback);
    setVar('--font-display', fonts.display?.family || fonts.sans?.family, fonts.display?.fallback || fonts.sans?.fallback);
    setVar('--font-mono', fonts.mono?.family || 'ui-monospace', fonts.mono?.fallback);

    if (mode === 'web') {
      // Preconnect to speed up font loading
      const preconnect = (href, cross=false) => {
        if (!href) return;
        if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
        const l = document.createElement('link');
        l.rel = 'preconnect';
        l.href = href;
        if (cross) l.crossOrigin = '';
        document.head.appendChild(l);
      };
      preconnect('https://fonts.googleapis.com');
      preconnect('https://fonts.gstatic.com', true);

      const urls = [fonts.sans?.url, fonts.display?.url, fonts.mono?.url].filter(Boolean);
      for (const href of urls) {
        if (!document.querySelector(`link[href="${href}"]`)) {
          const l = document.createElement('link');
          l.rel = 'stylesheet';
          l.href = href;
          document.head.appendChild(l);
        }
      }
    }
  } catch {}
}

applyFonts(siteConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
