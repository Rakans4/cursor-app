import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      // Error prevention
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'warn',

      // Code quality
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unreachable': 'error',
      'no-duplicate-imports': 'error',

      // Best practices
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // Node.js specific - allow process.exit in CLI scripts
      'no-process-exit': 'off',
      'no-path-concat': 'error',

      // ES6+ features
      'arrow-spacing': 'error',
      'no-useless-constructor': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',

      // Code style
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'eol-last': 'error'
    }
  },
  {
    ignores: [
      'node_modules/**',
      '*.min.js',
      'coverage/**',
      'dist/**',
      'build/**'
    ]
  }
];
