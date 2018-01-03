import { publicEncrypt } from 'crypto';

const webpack = require('webpack');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.config.js');

module.exports = function (env, compileRntries, publicPath) {
    return Merge(CommonConfig(env, compileRntries, publicPath), {
        devServer: {
            hot: true,

            contentBase: `${__dirname}/dist`,

            publicPath: '/',
        },

        plugins: [
            new webpack.HotModuleReplacementPlugin(),

            new webpack.NamedModulesPlugin(),

            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('local'),
                },
            }),
        ],
    });
};