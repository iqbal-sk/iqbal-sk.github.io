import React, { useEffect, useState } from 'react';
import SegmentedSwitch from './SegmentedSwitch';

function SunIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SystemIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 20h8" />
    </svg>
  );
}

// Theme toggle: Light | Dark | System
export default function ThemeToggle({ className = '', compact = false }) {
  const readPref = () => {
    try {
      const v = localStorage.getItem('theme');
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch { return 'system'; }
  };

  const [mode, setMode] = useState(readPref);

  useEffect(() => {
    try {
      if (mode === 'system') {
        localStorage.removeItem('theme');
        document.documentElement.removeAttribute('data-theme');
      } else {
        localStorage.setItem('theme', mode);
        document.documentElement.setAttribute('data-theme', mode);
      }
    } catch {}
  }, [mode]);

  const opts = compact
    ? [
        { label: <SunIcon />, value: 'light', aria: 'Light theme' },
        { label: <MoonIcon />, value: 'dark', aria: 'Dark theme' },
        { label: <SystemIcon />, value: 'system', aria: 'System theme' },
      ]
    : [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'System', value: 'system' },
      ];

  return (
    <div className={className} aria-label="Theme">
      <SegmentedSwitch
        value={mode}
        onChange={setMode}
        options={opts}
        buttonClassName={compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}
      />
    </div>
  );
}
