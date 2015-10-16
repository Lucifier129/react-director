var webpack = require('webpack');
var path = require('path');

module.exports = {
    watch: true,
    entry: {
        //counter: './examples/counter',
        test: './examples/test'
    },
    output: {
        path: './examples/dist',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['', '.js'],
        alias: {
            'react-director': __dirname + '/src'
        }
    }
};
