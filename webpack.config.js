const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/client/js/app.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./deploy/client"),
  },
  devServer: {
    contentBase: "./deploy/client",
    open: true,
    port: 9090,
    proxy: {
      '/api/*': 'http://localhost:8080',
    }
  },
  module: {
    rules: [
      {
	test: /\.js$/,
	exclude: /node_modules/,
	use: {
	  loader: 'babel-loader',
	  options: {
	    presets: ['@babel/preset-env'],
	    plugins: ['@babel/plugin-transform-runtime'],
	  }
	}
      },
      {
	test: /\.css$/,
	use: ["style-loader", "css-loader"]
      },
      {
	test: /\.(?:ico|svg|gif|png|jpg|jpeg)$/i,
	type: 'asset/resource',
      },
    ]
  },
  plugins: [
    new HTMLWebpackPlugin ({
      template: './src/client/views/index.html'
    }),
    new CleanWebpackPlugin(),
  ],
};
