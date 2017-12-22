const Webpack = require('webpack');
const Merge = require('webpack-merge');

const CommonConfig = require('./webpack.common.js');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

process.env.NODE_ENV = 'production';

module.exports = function (evn, compileEntries, publicPath) {
    return Merge(CommonConfig(env, compileEntries, publicPath), {
        devtool: 'cheap-module-source-map',

        plugins: [
            new CleanWebpackPlugin(['dist/entries']),

            new StyleLintPlugin({
                quiet: false,
                syntax: 'scss',
                failOnError: true
            }),

            new Webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                },
            }),
        ],
    });
};