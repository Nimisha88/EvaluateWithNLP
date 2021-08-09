const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// const devMode = process.env.NODE_ENV !== "production";
const devMode = process.argv[process.argv.indexOf('--mode') + 1] !== 'production';
console.log(`Webconfig is running in ${process.argv[process.argv.indexOf('--mode') + 1]} mode`);

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/client/js/app.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "client"),
  },
  devServer: {
    contentBase: "client",
    open: true,
    port: 9090,
    proxy: {
      '/api/*': 'http://localhost:8080',
    }
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.css$/,
        use: [devMode ? "style-loader": MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(?:ico|svg|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/client/views/index.html'
    }),
    new CleanWebpackPlugin(),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [{
        urlPattern: /\//,
        handler: 'NetworkOnly',
      },]
    }),
  ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
};
