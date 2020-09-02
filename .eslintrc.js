module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: 2,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    plugins: ['import'],
    rules: {
        '@typescript-eslint/ban-types': 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/indent': 'error',
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'none',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/naming-convention': 'off',
        'no-param-reassign': 'error',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/quotes': ['error', 'single'],
        '@typescript-eslint/semi': ['off', null],
        '@typescript-eslint/no-explicit-any': 'warn',
        'arrow-body-style': 'error',
        'arrow-parens': ['error', 'always'],
        'brace-style': ['error', '1tbs'],
        curly: 'error',
        'default-case': 'error',
        'eol-last': 'error',
        eqeqeq: ['error', 'always'],
        'id-blacklist': 'error',
        'id-match': 'error',
        'import/order': 'error',
        'linebreak-style': 'off',
        'max-len': [
            'off',
            {
                ignorePattern: '^import |^export {(.*?)}',
                code: 140,
            },
        ],
        'new-parens': 'off',
        'newline-per-chained-call': 'off',
        'no-duplicate-case': 'error',
        'no-duplicate-imports': 'error',
        'no-empty': 'error',
        'no-eval': 'error',
        'no-extra-semi': 'off',
        'no-fallthrough': 'error',
        'no-irregular-whitespace': 'off',
        'no-multiple-empty-lines': 'error',
        'no-new-wrappers': 'error',
        'no-null/no-null': 'off',
        'no-redeclare': 'error',
        'no-return-await': 'error',
        'no-new': 'off',
        'no-shadow': [
            'off',
            {
                hoist: 'all',
            },
        ],
        'no-trailing-spaces': 'off',
        'no-underscore-dangle': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'one-var': ['error', 'never'],
        'prefer-arrow-callback': 'error',
        'prefer-const': 'error',
    },
}