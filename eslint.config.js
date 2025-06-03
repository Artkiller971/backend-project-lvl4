import globals from 'globals';
import stylisticJs from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@stylistic/js': stylisticJs,
      importPlugin,
    },
    ignores: ['dist/**', 'src/**', '__tests__/**'],
    rules: {
      semi: 'error',
      'no-shadow': 'error',
      'importPlugin/newline-after-import': 'error',
      'importPlugin/first': 'error',
      'object-shorthand': 'error',
      'no-undef': 'error',
      'key-spacing': 'error',
      'no-unused-vars': 'error',
      'prefer-const': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'consistent-return': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'default-case': 'error',
      'no-else-return': 'error',
      'prefer-destructuring': ['error', {
        array: true,
        object: true,
      }],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/max-len': ['error', { ignoreStrings: true, code: 100 }],
      '@stylistic/js/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always',
        functions: 'always-multiline',
        importAttributes: 'always',
        dynamicImports: 'always',
      }],
      '@stylistic/js/no-extra-semi': 'error',
      '@stylistic/js/padded-blocks': ['error', { blocks: 'never' }],
      '@stylistic/js/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      '@stylistic/js/no-trailing-spaces': ['error'],
      '@stylistic/js/eol-last': ['error', 'always'],
      '@stylistic/js/no-multi-spaces': ['error'],
      '@stylistic/js/quote-props': ['error', 'as-needed'],
      '@stylistic/js/space-infix-ops': ['error'],
      '@stylistic/js/space-in-parens': ['error'],
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      '@stylistic/js/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/js/comma-spacing': ['error'],
    },
  },

];
