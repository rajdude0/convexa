const path = require('path');
const configs = require('./configs');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        react: './app/index.js', 
        studio: './app/studio/js/studio.js'
    },
    mode:"development",
    output: {
        path: __dirname,
        filename: 'bundle-[name].js',
        publicPath: '/app/assets'
    },
    resolve: {
        modules: [
            'node_modules'
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'app'),
        port:configs.default.UIPORT,
        hot:true,
        inline:true,
        proxy:{
            "/api/*":`http://localhost:${configs.default.APIPORT}/`
        }
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