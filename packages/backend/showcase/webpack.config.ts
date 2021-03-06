/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import { Configuration } from 'webpack'
import common from '../../webpack.base.config'

export default [
    {
        ...common,
        target: 'node',
        entry: {
            apiHandler: path.join(__dirname, 'src', 'TodosApi', 'handlers', 'api-gateway.ts'),
        },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist', 'todos-api'),
            libraryTarget: 'commonjs2',
        },
        devtool: 'inline-source-map',
    },
] as Configuration
