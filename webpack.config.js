const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: {
        index: './src/index.js',
        styles: './src/style.css'
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module:{
        rules:[
            {test: /\.css$/, use: ['style-loader', 'css-loader']}
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};