const path = require('path');
const webpack = require('webpack');

const config = {
  context: path.resolve(__dirname, './src'),
  entry: {
    textarena: ['./Textarena.ts'],
    style: ['../scss/style.scss'],
  },
  output: {
    filename: '[name].js',
    library: 'Textarena',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'public'),
    assetModuleFilename: 'textarena.css',
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
        exclude: /node_modules/,
        type: 'asset/resource',
        use: [
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    hot: false,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    host: '0.0.0.0',
  },
};

module.exports = (env, argv) => {
  if (argv.mode == 'production') {
    config.mode = 'production';
    config.plugins = [
      new webpack.BannerPlugin({
        banner: [
          '@license',
          'Copyright 2022 © ITSumma Ltd.',
          'SPDX-License-Identifier: AGPL-3.0-only',
        ].join('\n'),
      }),
    ];
  } else {
    config.devtool = 'inline-source-map';
    config.mode = 'development';
  }
  return config;
};
