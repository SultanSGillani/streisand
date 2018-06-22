const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');
const WebpackCdnPlugin = require('webpack-cdn-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        host: "0.0.0.0",
        port: 3000,
        contentBase: './',
        historyApiFallback: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new WebpackCdnPlugin({
            modules: {
                'react': [
                    {name: 'react', var: 'React', path: `umd/react.${process.env.NODE_ENV}.js`},
                    {name: 'react-dom', var: 'ReactDOM', path: `umd/react-dom.${process.env.NODE_ENV}.js`},
                    {name: 'redux', var: 'Redux', path: `dist/redux.js`},
                    {name: 'reactstrap', var: 'Reactstrap', path: `dist/reactstrap.full.js`},
                    {name: 'react-redux', var: 'ReactRedux', path: `dist/react-redux.js`},
                    {name: 'react-router', var: 'ReactRouter', path: `umd/react-router.js`}
                ],
            },
            prod: process.env.NODE_ENV === 'production',
            publicPath: '/node_modules', // override when prod is false
        })
    ],
    watchOptions: {
        aggregateTimeout: 500
    }
});
