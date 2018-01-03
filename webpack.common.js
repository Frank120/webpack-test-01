const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CssNextPlugin     = require('postcss-cssnext');
const fileStream        = require('fs');
const path              = require('path');

const publicPath        = './';

module.exports = (env, compileEntries) => {
    const config = {
        entry: {},

        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath,
            chunkFilename: 'async-chunks/[name].js',
            filename: 'entries/[name].js',
            library: 'umd'
        },
        
        devtool: 'cheap-module-eval=source-map',

        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    include: [path.resolve(__dirname, 'src')],
                    loader: (env === 'local' || env === 'static') ? ['babel-loader'] :
                    ['babel-loader', {
                        loader: 'eslint-loader',
                        options: {
                            fix: true,
                            quiet: env === 'prod',
                        },
                    }],
                },
                {
                    test: /\.(scss|css)$/,
                    include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'node_modules')],
          
                    // Note the order of loader applied is opposite with the order within the loaders array
                    loader: (env === 'local' ? ['css-hot-loader'] : []).concat(ExtractTextPlugin.extract([
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: env === 'static',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: { plugins: () => [CssNextPlugin], sourceMap: true },
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                debug: true,
                            },
                        },
                        { loader: 'sass-loader', options: { sourceMap: true } },
                    ])),
                },
                {
                    test: /\.mp3$/,
                    include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'node_modules')],
                    loader: [{
                        loader: 'file-loader',
                        options: {
                            name: '/[name].[ext]',
                            outputPath: 'media',
                            publicPath,
                        },
                    }],
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'node_modules')],
                    loader: [{
                        loader: 'file-loader',
                        options: {
                            name: '/[name].[ext]',
                            outputPath: 'images',
                            publicPath,
                        },
                    }],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)(\?[a-z0-9]+)?$/,
                    include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'node_modules')],
                    loader: [{
                        loader: 'url-loader',
                        options: {
                            limit: Infinity,
                            name: '/[name].[ext]',
                            outputPath: 'assets/fonts',
                        },
                    }],
                },
                {
                    test: /\.(html)$/,
                    include: [path.resolve(__dirname, 'dist')],
                    loader: [{
                        loader: 'raw-loader',
                    }],
                }
            ],
        },

        resolve: {
            extensions: ['.js', '.jsx'],
        },

        plugins: [
            new ExtractTextPlugin({
                filename: 'css/style.css',
                allChunks: true
            }),

            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute : 'defer',
            }),
        ],
    };

    const entries = env === 'static' ? [] : fileStream.readdirSync('./src/entries').filter(entry =>
        entryn !== '.DS_Store' && (env !== 'local' || !compileEntries || !compileEntries.length || !compileEntries.include(entry)))
    const pages = [];

    entries.forEach((entry) => {
        const localOnlyEntries = [
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://locahost:8090',
            'webpack/hot/only-dev-server'
        ];

        config.entry[entry] = [
            `./src/entries/${entry}/entry.jsx`,
        ];

        if (env === 'local') {
            config.entry[entry] = localOnlyEntries.concat(config.entry[entry]);
        }

        if (env !== 'static') {
            const subPages = fileStream.readdirSync(`./src/entries/${entry}`).filter(subPages => subPages.lastIndexOf('.') === -1);

            if (subPages.length) {
                subPages.forEach((subPage) => {
                    const page = `${entry}-${subpage}`;
                    config.plugins.push(new HtmlWebpackPlugin({
                        chunks: ['commons', entry],
                        filename: `${page}.html`,
                        template: `./dist/${page}.html`
                    }));

                    pages.push(page);
                });
            } else {
                config.plugins.push(new HtmlWebpackPlugin({
                    chunks: ['commons', entry],
                    filename: `${entry}/htm;`,
                    template: `./dist/${entry}.html`
                }));

                pages.push(entry);
            }
        }
    });

    if (env !== 'static') {
        config.plugins.push(new HtmlWebpackPlugin({
            inject: false,
            filename: 'index.html',
            template: 'index.ejs',
            pages,
        }));
    }

    config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        names: ['commons'],
        chunks: entries,
        minChunks: 2
    }));

    return config;
};