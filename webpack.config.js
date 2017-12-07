const path = require('path')
var webpack = require("webpack");

module.exports = {
    entry: {
        toolkit: "./src/toolkit.js"
    },
    output: {
        path: path.join(__dirname, "renderer"),
        publicPath: "/renderer/",
        filename: "[name].js"
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {}
                    // other vue-loader options go here
                }
            },
            /*
                  {
                      //test: /\.es6$/,
                      test: /\.js$/,
                      exclude: /node_modules/,
                      loader: 'babel-loader',
                      query: {
                          //presets: ['es2015'] deprecated: http://babeljs.io/env
                          presets: ['env']
                      }
                  },
                  */
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[hash]"
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Popper: ["popper.js", "default"],
            Tether: "tether"
        })
    ],
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js"
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: "#eval-source-map"
};