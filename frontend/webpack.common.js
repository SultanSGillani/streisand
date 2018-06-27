const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config()

module.exports = {
    entry: {
        app: './src/index.tsx'
    },
    output: {
        publicPath: '/',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.APIURL': JSON.stringify(process.env.APIURL)
        }),
        new HtmlWebpackPlugin({
            title: 'Phoenix',
            template: 'index.html',
            filename: 'index.html',
            cdnModule: 'react'
        }),
    ],
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-redux': 'ReactRedux',
        'redux': 'Redux',
        'reactstrap': 'Reactstrap',
        'react-router': 'ReactRouter'
    },
};

