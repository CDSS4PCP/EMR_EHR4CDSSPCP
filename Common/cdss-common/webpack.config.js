const webpack = require('webpack');

module.exports = {
    resolve: {
        fallback: {
            buffer: require.resolve('buffer/'),
            timers: require.resolve('timers-browserify'),
            fs: false,
            utils: false,
            util: false,
            path: require.resolve('path-browserify'),
            constants: false,
            assert: false,
            process: false,
            events: false
        }
    },
    plugins: [
    // fix "process is not defined" error:
        new webpack.ProvidePlugin({
            process: 'process/browser',
        })
    ],
    output: {
        filename: 'cdss.js',
    },
};
