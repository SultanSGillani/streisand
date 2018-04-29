var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        'webpack-dev-server/client?http://localhost:3000',

        // bundle the client for hot reloading
        'webpack/hot/only-dev-server',

        // activate HMR for React
        'react-hot-loader/patch',

        './src/index.tsx'
    ],
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
        publicPath: '/dist/' // necessary for HMR to know where to load the hot update chunks
    },
    devtool: 'eval', // inline-source-map
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [
            '.webpack.js',
            '.web.js',
            '.ts',
            '.tsx',
            '.js'
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),

        // enable HMR globally
        new webpack.HotModuleReplacementPlugin(),

        // prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin(),

        // do not emit compiled assets that include errors
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        rules: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, enforce: "pre", loader: 'source-map-loader' },

            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, use: ['react-hot-loader/webpack', 'awesome-typescript-loader'] },

            {
                test: /\.scss$/, use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'redux': 'Redux',
        'react-bootstrap': 'ReactBootstrap'
    }
};