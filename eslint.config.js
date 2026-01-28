import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: ['dist/**', '.yarn/**'],
  },
  {
    // Apply this only to test files
    files: ['tests/**'], 
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // You can override specific rules here
      'playwright/no-skipped-test': 'warn',
    },
  },
  {
    settings: {
      playwright: {
        messages: {
          'no-skipped-test': '🛑 Please do not commit .skip()! If the test is broken, fix it or delete it.',
          'no-focused-test': '⚠️ You left a .only() in your code. Remove it before pushing.',
          "conditionalExpect": "Avoid conditional expects as they can lead to false positives",
        }
      }
    }
  }
]