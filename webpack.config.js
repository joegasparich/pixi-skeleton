/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    target: "web",
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    mode: "development",
    devServer: {
        contentBase: "./dist",
        hot: true,
        port: 4200,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "Game",
            template: "src/index.html",
        }),
        new CopyWebpackPlugin({patterns: [{ from: "./src/assets", to: "assets" }]}),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: "file-loader",
            },
        ],
    },
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                configFile: "./tsconfig.json",
            }),
        ],
        extensions: [".tsx", ".ts", ".js", "*"],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};
