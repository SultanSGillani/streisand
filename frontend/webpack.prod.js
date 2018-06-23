const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WebpackCdnPlugin = require('webpack-cdn-plugin');

module.exports = merge(common, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/.dev$/, function (resource) {
            resource.request = resource.request.replace(/dev/, `prod`);
        }),
        new WebpackCdnPlugin({
            modules: {
                'react': [
                    {name: 'react', var: 'React', path: `umd/react.${process.env.NODE_ENV}.min.js`},
                    {name: 'react-dom', var: 'ReactDOM', path: `umd/react-dom.${process.env.NODE_ENV}.min.js`},
                    {name: 'redux', var: 'Redux', path: `dist/redux.min.js`},
                    {name: 'reactstrap', var: 'Reactstrap', path: `dist/reactstrap.full.min.js`},
                    {name: 'react-redux', var: 'ReactRedux', path: `dist/react-redux.min.js`},
                    {name: 'react-router', var: 'ReactRouter', path: `umd/ReactRouter.min.js`}

                ],
            }
        })
    ]
});
