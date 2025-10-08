import React, { useEffect, useState } from 'react';
import SegmentedSwitch from './SegmentedSwitch';

// Theme toggle: Light | Dark | System
export default function ThemeToggle({ className = '' }) {
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

  return (
    <div className={className} aria-label="Theme">
      <SegmentedSwitch
        value={mode}
        onChange={setMode}
        options={[
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
          { label: 'System', value: 'system' },
        ]}
      />
    </div>
  );
}

