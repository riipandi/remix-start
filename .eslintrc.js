/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node', 'prettier'],
  ignorePatterns: ['.eslintrc.js', '.cache', 'node_modules', 'build', '**/public/build/*'],
  rules: {
    'tailwindcss/no-custom-classname': 'off',
  },
}
