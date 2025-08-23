import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import baseConfig from '@hono/eslint-config'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...baseConfig,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/generated/**',
      'coverage/**',
      '**/*.js',
      './global.d.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-this-alias': 'off',
      'no-console': 'warn',
    },
  },
)
