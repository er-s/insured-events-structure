/** ESLint config for Angular 13 */
module.exports = {
  root: true,

  ignorePatterns: [
    'dist/',
    'coverage/',
    'node_modules/',
    '*.min.js',
  ],

  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['tsconfig.eslint.json'],
        sourceType: 'module',
      },
      plugins: [
        '@typescript-eslint',
        '@angular-eslint',
        'prettier',
        'simple-import-sort',
      ],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:prettier/recommended',
      ],
      rules: {
        quotes: ['error', 'single', { avoidEscape: true }],
        'newline-before-return': 'error',
        'prettier/prettier': 'error',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',

        // TypeScript
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
          },
        ],
        '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports' },
        ],

        // Angular
        '@angular-eslint/component-selector': [
          'error',
          { type: 'element', prefix: 'app', style: 'kebab-case' },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          { type: 'attribute', prefix: 'app', style: 'camelCase' },
        ],
      },
    },

    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        '@angular-eslint/template/banana-in-box': 'error',
        '@angular-eslint/template/no-negated-async': 'error',
        '@angular-eslint/template/eqeqeq': 'error',
      },
    },

    {
      files: [
        'karma.conf.js',
        'webpack*.config.js',
        'scripts/**/*.js',
        'tailwind.config.js',
      ],
      env: { node: true },
    },
  ],
};

if (module && module.exports) {
  const merge = (a, b) => (a ? Object.assign({}, a, b) : b);
  module.exports.rules = merge(module.exports.rules, {
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],

    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'if' },
    ],

    'keyword-spacing': ['error', { before: true, after: true }],
    'space-before-blocks': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
  });
}
