const webpack = require('webpack');
const Merge   = require('webpack-merge');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const CommonConfig       = require('./webpack.common.js');

module.exports = function (env, compileEntries, publicPath) {
    return Merge(CommonConfig(env, compileEntries, publicPath), {
        entry: {
            static: './src/static/static-entry.jsx'
        },

        pulgins: [
            new CleanWebpackPlugin(['dist']),

            new StaticSiteGeneratorPlugin({ entry: 'static' }),

            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('static'),
                },
            }),

            new CopyWebpackPlugin([
                { from: './src/assets/lib/*', to: 'lib', flatten: true },
                { from: './src/interface/*', to: 'interface', flatten: true },
                { from: './src/assets/images/*', to: 'images', flatten: true }
            ]),
        ],
    });
};