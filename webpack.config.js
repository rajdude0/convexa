const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './app/index.js',
    output: {
        path: __dirname,
        filename: 'bundle.js',
        publicPath: '/app/assets'
    },
    resolve: {
        modules: [
            'node_modules'
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'app')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude:/node_modules/,
            use: ['babel-loader']
        },
        {
            test: /\.(css|scss)$/,
            use: [
              "style-loader",
              "css-loader",
              "sass-loader"
            ]
          },
          {
            test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
            loaders: ["file-loader"]
          }
    
    ]


    },
   
}