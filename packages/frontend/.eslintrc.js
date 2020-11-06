module.exports = {
    extends: ['plugin:react/recommended', '../.eslintrc.js'],
    parserOptions: {
        ecmaFeatures: {
            jsx: 2,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}
