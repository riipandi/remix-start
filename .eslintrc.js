/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  plugins: ['simple-import-sort'],
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node', 'prettier'],
  ignorePatterns: ['.eslintrc.js', '.cache', 'node_modules', 'build', '**/public/build/*'],
  rules: {
    'tailwindcss/no-custom-classname': 'off',
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^react', '^@?\\w', '^\\u0000'],
          ['^@/modules', '^@/services', '^@/utils'],
          ['^@/components', '^@/hooks', '^@/styles'],
          ['^@/', '^.+\\.s?css$', '^~/'],
          [
            '^\\./?$',
            '^\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\./\\.\\.(?!/?$)',
          ],
          ['^'],
        ],
      },
    ],
  },
}
