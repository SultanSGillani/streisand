const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'redux': 'Redux',
        'reactstrap': 'Reactstrap'
    }
};