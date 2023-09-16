const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        script: './src/script.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
    // ... other config options
};

