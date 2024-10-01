const webpack = require('webpack')

module.exports = {
    resolve: {
        fallback: {
            buffer: require.resolve('buffer/'),
            timers: require.resolve('timers-browserify'),
            // fs: require.resolve("browserify-fs"), // Exclude the fs module from being bundled
            fs: false, // Exclude the fs module from being bundled
            // path: false, // Exclude the path module from being bundled
            // process: false,
            // "process": require.resolve("process/browser"),
            utils: false,
            util: false,
            path: require.resolve("path-browserify"),
            "constants": false,
            "assert": false
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