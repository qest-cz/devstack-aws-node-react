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
        'prettier',
    ],
    plugins: ['prettier', '@typescript-eslint', 'import', 'unused-imports'],
    rules: {
        'prettier/prettier': 'error',
        'arrow-body-style': 'error',
        curly: ['warn', 'multi-line'],
        'default-case': 'error',
        'eol-last': 'error',
        eqeqeq: ['warn', 'always'],
        'new-parens': 'error',
        'no-irregular-whitespace': 'warn',
        'no-multiple-empty-lines': 'warn',
        'no-trailing-spaces': 'warn',
        'prefer-arrow-callback': 'warn',
        'prefer-const': 'warn',
        'import/no-cycle': 'error',
        'import/order': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-vars-ts': 'off',
        'unused-imports/no-unused-imports-ts': 'error',
    },
}
