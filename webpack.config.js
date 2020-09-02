const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = {
    mode: 'none',
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/',
            },
        ],
    },
}

module.exports = [
    {
        ...common,
        entry: {
            app: path.join(__dirname, 'src', 'frontend', 'index.tsx'),
        },
        target: 'web',
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist-web'),
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src', 'frontend', 'public', 'index.html'),
            }),
        ],
    },
    {
        ...common,
        target: 'node',
        entry: {
            apiHandler: path.join(__dirname, 'src', 'backend', 'Todos', 'RestApi', 'aws', 'api-handler.ts'),
        },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist', 'api-handler'),
            libraryTarget: 'commonjs2',
        },
        devtool: 'inline-source-map',
    },
]
