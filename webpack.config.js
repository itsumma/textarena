const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: {
    textarena: ['./src/Textarena.ts'],
    demo: ['./demo/index.ts'],
  },
  output: {
    filename: '[name].js',
    library: {
      name: 'Textarena',
      type: 'umd',
      export: 'default',
    },
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
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          // Disables attributes processing
          sources: false,
        }
      },      
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },      
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(svg)$/i,
        type: 'asset/source',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './demo/index.html',
      inject: false,
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
  ],
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
    config.plugins.push(
      new webpack.BannerPlugin({
        banner: [
          '@license',
          'Copyright 2022 © ITSumma Ltd.',
          'SPDX-License-Identifier: AGPL-3.0-only',
        ].join('\n'),
      }),
    );
  } else {
    config.devtool = 'inline-source-map';
    config.mode = 'development';
  }
  return config;
};
