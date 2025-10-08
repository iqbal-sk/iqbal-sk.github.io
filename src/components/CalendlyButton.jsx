import React, { useCallback, useState } from 'react';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

function loadStyles(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
}

async function ensureCalendly() {
  loadStyles('https://assets.calendly.com/assets/external/widget.css');
  if (window.Calendly) return;
  await loadScript('https://assets.calendly.com/assets/external/widget.js');
}

export default function CalendlyButton({ url, label = 'Book a call', className = '', variant = 'primary' }) {
  const [loading, setLoading] = useState(false);
  const open = useCallback(async () => {
    if (!url) return;
    try {
      setLoading(true);
      await ensureCalendly();
      window.Calendly.initPopupWidget({ url });
    } finally {
      setLoading(false);
    }
  }, [url]);

  const base =
    variant === 'primary'
      ? 'inline-flex items-center justify-center h-10 rounded-lg px-4 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity'
      : 'inline-flex items-center justify-center h-10 rounded-lg px-4 text-sm font-medium border border-border bg-card text-foreground hover:bg-muted/60';

  return (
    <button onClick={open} disabled={!url || loading} className={`${base} ${className}`}>
      {loading ? 'Opening…' : label}
    </button>
  );
}

