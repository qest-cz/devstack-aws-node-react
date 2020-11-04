/* eslint-disable @typescript-eslint/no-var-requires */

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration } from 'webpack'
import common from '../../webpack.base.config'

const DIST_FOLDER_NAME = 'dist'
const PUBLIC_FOLDER_NAME = 'public'

module.exports = [
    {
        ...common,
        entry: {
            app: path.join(__dirname, 'src', 'index.tsx'),
        },
        target: 'web',
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, DIST_FOLDER_NAME),
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, PUBLIC_FOLDER_NAME, 'index.html'),
            }),
        ],
        devServer: {
            contentBase: path.join(__dirname, DIST_FOLDER_NAME),
            compress: true,
            port: 3000,
        },
    },
] as Configuration
