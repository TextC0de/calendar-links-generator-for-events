/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const env = process.env.NODE_ENV;

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
            chunkFilename: '/styles/[id].css'
        }),
        new Dotenv({
            path: `./.env.${env === 'production' ? 'prod' : 'dev'}`
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
                options: {
                    presets: [require.resolve('babel-preset-react-app')]
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false, sourceMap: true } }
                ]
            }
        ]
    }
};
