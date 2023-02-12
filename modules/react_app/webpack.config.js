const path = require("path");

module.exports = {
  entry: "./src/module_detail.js",
  output: {
    path : path.resolve('../../bom_squad/static/bundles/'),
    filename: "module_detail_bundle.js",
    publicPath: '/',
  },
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png|svg|jpg|gif$/,
        use: ["file-loader"],
      },
    ],
  },
  mode:'development',
  plugins: [
  ],
};