"use strict";
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
    entry: "./server.ts", // Entry point for your app
    target: "node", // Since this is a server-side app
    mode: "production", // Can be 'development' or 'production'
    output: {
        filename: "server.js", // Output bundle name
        path: path.resolve(__dirname, "dist"), // Output directory
    },
    resolve: {
        extensions: [".ts", ".js"], // Resolve TypeScript and JavaScript files
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Compile all .ts files
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        // Copies the "mails" folder to the "dist" directory
        new CopyWebpackPlugin({
            patterns: [{ from: "mails", to: "mails" }],
        }),
    ],
    externals: {
        // Ensure external modules like `node_modules` are not bundled
        mongoose: "commonjs mongoose",
        express: "commonjs express",
        // Add other dependencies you don't want bundled here
    },
};
