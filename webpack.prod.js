// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

process.env.NODE_ENV = 'production';

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map'
});
