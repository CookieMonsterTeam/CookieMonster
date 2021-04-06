const path = require('path');

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
      filename: 'CookieMonster.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
