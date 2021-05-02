const path = require('path');
const webpack = require('webpack');

module.exports = function (env) {
  return {
    mode: 'production',
    devtool: env.production ? 'source-map' : 'inline-source-map',
    optimization: {
      minimize: !!env.production,
    },
    entry: './src/CookieMonster.js',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      filename: 'CookieMonsterDev.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: 'CookieMonsterDev.js.map',
        publicPath: 'https://cookiemonsterteam.github.io/CookieMonster/dist/',
        fileContext: 'public',
      }),
    ],
  };
};
