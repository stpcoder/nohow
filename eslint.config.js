import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  files: ['src/**/*.{ts,tsx}'],
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  languageOptions: {
    ecmaVersion: 2022,
    globals: globals.browser,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
  },
})
