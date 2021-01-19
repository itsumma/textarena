const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');


const bannerPack = new webpack.BannerPlugin({
  banner: [
    `Some v${pkg.version}`,
  ].join('\n'),
  entryOnly: true,
});
const constantPack = new webpack.DefinePlugin({
  SOME_VERSION: JSON.stringify(pkg.version),
});

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, './src'),
  entry: {
    'textarena': ['./Textarena.ts'],
    'style': ['../scss/style.scss'],
  },
  output: {
    filename: '[name].js',
    library: 'Textarena',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'public'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', 'scss'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        // Include ts and js files.
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "textarena.css",
            },
          },
          'extract-loader',
          'css-loader',
          'sass-loader',
        ],
      }
    ],
  },
  plugins: [
    bannerPack,
    constantPack,
  ],
  devServer: {
    hot: false,
    contentBase: path.join(__dirname, 'public'),
    host: '0.0.0.0',
  },
};
