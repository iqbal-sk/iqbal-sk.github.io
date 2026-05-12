import React from 'react';
import ReactDOM from 'react-dom/client';
import Lenis from 'lenis';
import App from './App.jsx';
import './index.css';
import siteConfig from './siteConfig';

// -----------------------------------------------------------------
// Analytics (Plausible, opt-in)
// -----------------------------------------------------------------
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

// -----------------------------------------------------------------
// Fonts — apply CSS variables from siteConfig
// -----------------------------------------------------------------
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

    setVar('--font-sans', fonts.sans?.family, fonts.sans?.fallback);
    setVar('--font-display', fonts.display?.family || fonts.sans?.family, fonts.display?.fallback || fonts.sans?.fallback);
    setVar('--font-mono', fonts.mono?.family, fonts.mono?.fallback);

    if (mode === 'web') {
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
  } catch {
    /* fail silent — system fallbacks are fine */
  }
}
applyFonts(siteConfig);

// -----------------------------------------------------------------
// Lenis smooth scroll — disabled under prefers-reduced-motion
// -----------------------------------------------------------------
function initSmoothScroll() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    smoothTouch: false,
    // Respect anchor clicks — Lenis handles #hash scrolls via window.scrollTo.
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Expose for components that want to imperatively scroll (e.g., nav anchors)
  window.__lenis = lenis;
}
initSmoothScroll();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
