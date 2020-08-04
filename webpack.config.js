const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')

module.exports = {
    entry: './dist/index.js',
    output: {
        path: path.resolve(__dirname, 'umd'),
        filename: 'recordable.js',
        publicPath: './dist',
    },
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
}
