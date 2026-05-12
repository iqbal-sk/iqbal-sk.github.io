module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true, // Add this to handle Node.js globals like `module`
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'no-unused-vars': 'warn',
    'react/no-unescaped-entities': 'off',
    'no-prototype-builtins': 'off',
    // Project doesn't use prop-types; tokens come from TypeScript types or are inline.
    'react/prop-types': 'off',
    'no-empty': ['warn', { allowEmptyCatch: true }],
  },
};
