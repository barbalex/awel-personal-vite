import reactRefresh from 'eslint-plugin-react-refresh'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import _import from 'eslint-plugin-import'
import { fixupPluginRules, fixupConfigRules } from '@eslint/compat'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '**/logs',
      '**/*.log',
      '**/pids',
      '**/*.pid',
      '**/*.seed',
      '**/lib-cov',
      '**/coverage',
      '**/.grunt',
      '**/.lock-wscript',
      'build/Release',
      '**/.eslintcache',
      '**/node_modules',
      '**/.DS_Store',
      '**/release',
      'app/main.prod.js',
      'app/main.prod.js.map',
      'app/renderer.prod.js',
      'app/renderer.prod.js.map',
      'app/style.css',
      'app/style.css.map',
      '**/dist',
      '**/dll',
      '**/main.js',
      '**/main.js.map',
      '**/out',
      '**/.idea',
      '**/npm-debug.log.*',
      '**/__snapshots__',
      '**/package.json',
      '**/.travis.yml',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/stylistic',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ),
  ),
  {
    plugins: {
      'react-refresh': reactRefresh,
      import: _import,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      strict: 0,
      'react/prop-types': 0,
      'react/display-name': 'off',
      'no-console': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-unused-vars': 1,

      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],

      'react/react-in-jsx-scope': 'off',

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'require-await': 1,

      'import/extensions': [
        'warn',
        'ignorePackages',
        {
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
    },
  },
]
