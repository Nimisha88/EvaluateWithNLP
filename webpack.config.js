const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/client/js/app.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./deploy"),
  },
  devServer: {
    contentBase: "./deploy",
    open: true
  },
  module: {
    rules: [
      {
	test: /\.js$/,
	exclude: /node_modules/,
	use: {
	  loader: 'babel-loader',
	  options: {
	    presets: ['@babel/preset-env']
	  }
	}
      },
      {
	test: /\.css$/,
	use: ["style-loader", "css-loader"]
      },
      {
	test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
	type: 'asset/resource',
      },
    ]
  },
  plugins: [
    new HTMLWebpackPlugin ({
      template: './src/client/index.html'
    }),
    new CleanWebpackPlugin(),
  ],
};
