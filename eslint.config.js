import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

export default defineConfig([
  {
    files: ['**/*.js'],
    plugins: {
      js,
    },
    extends: ['js/recommended'],
    env: {
      browser: true,
      es2021: true,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
]);
