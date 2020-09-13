/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(
    {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: path.resolve(__dirname, 'public'),
            compress: true,
            hot: true,
            port: 3000,
            publicPath: '/',
            host: '0.0.0.0',
            historyApiFallback: true,
            stats: { colors: true }
        }
    },
    common
);
