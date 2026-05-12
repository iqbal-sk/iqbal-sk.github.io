/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        'ink-faint': 'var(--ink-faint)',
        rule: 'var(--rule)',
        'rule-strong': 'var(--rule-strong)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
      },
      borderRadius: {
        sm: '2px',
        md: '6px',
        lg: '10px',
      },
      maxWidth: {
        reading: '720px',
        aside: '920px',
        page: '1080px',
      },
      transitionTimingFunction: {
        'out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-quint': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
    },
  },
  plugins: [],
};
