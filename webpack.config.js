const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const pages = ['login', 'dashboard', 'postList', 'postPage'];
const isProduction = process.env.NODE_ENV === 'production';

const config = {
    mode: isProduction ? 'production' : 'development',

    entry: pages.reduce((config, page) => {
        config[page] = `./src/pages/${page}/index.js`;
        return config;
    }, {}),
    output: {
        hashFunction: 'xxhash64',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/index.[contenthash].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: ['html-loader'],
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader', // Tailwind CSS
                ],
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules'),
                ],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.(xlsx|pdf)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(gif|png|avif|jpe?g)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]/[name].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: './src/index.html',
            filename: 'index.html',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ].concat(
        pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    template: `./src/pages/${page}/index.html`,
                    filename: `${page}/index.html`,
                    chunks: [page],
                })
        )
    ),
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            fs: false,
            Buffer: require.resolve('buffer'),
            'process/browser': require.resolve('process/browser'),
        },
        alias: { process: 'process/browser' },
    },
    devServer: {
        static: './dist/',
        hot: true,
        open: true,
        devMiddleware: {
            publicPath: '/dist/',
            writeToDisk: true,
        },
        client: {
            overlay: {
                runtimeErrors: (error) => {
                    if (error.message === 'ResizeObserver loop limit exceeded') {
                        return false;
                    }
                    return false;
                },
            },
        },
    },
};

module.exports = config;
