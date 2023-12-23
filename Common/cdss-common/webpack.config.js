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
            constants: false,
            // constants: require.resolve("constants-browserify"),
            path: require.resolve("path-browserify"),
            // assert: require.resolve("assert/")
            assert: false
        }
    },
    plugins: [
        // fix "process is not defined" error:
        new webpack.ProvidePlugin({
            process: 'process/browser',
        })
    ]

};
