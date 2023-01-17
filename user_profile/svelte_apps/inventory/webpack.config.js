const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve("../../../bom_squad/static/bundles/"),
    filename: 'inventory_bundle.js',
    publicPath: "/",
  },
  devServer: {
    contentBase: path.join(__dirname, 'static'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
          },
        },
      },
    ],
  },
  mode: "development",
};