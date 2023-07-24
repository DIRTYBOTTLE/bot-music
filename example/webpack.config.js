/*
 * @Author: DirtyBottle 479763003@qq.com
 * @Date: 2023-01-18 02:36:21
 * @LastEditors: DirtyBottle 479763003@qq.com
 * @LastEditTime: 2023-03-24 16:13:19
 * @FilePath: /exa-popper/webpack.config.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: './index.html',
    filename: 'index.html',
})

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, './index.js'),
    plugins: [htmlWebpackPlugin],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ]
    },
}