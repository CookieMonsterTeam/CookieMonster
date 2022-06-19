const path = require('path');
const webpack = require('webpack');

module.exports = function (env) {
  return {
    mode: 'production',
    devtool: env.minimize ? 'source-map' : 'inline-source-map',
    optimization: {
      minimize: !!env.minimize,
    },
    entry: './src/CookieMonster.js',
    resolve: {
      extensions: ['.js'],
    },
    output: {
      filename: env.finalfile ? 'CookieMonster.js' : 'CookieMonsterDev.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename:
          env.finalfile && env.minimize ? 'CookieMonster.js.map' : 'CookieMonsterDev.js.map',
        publicPath: 'https://cookiemonsterteam.github.io/CookieMonster/dist/',
        fileContext: 'public',
      }),
    ],
  };
};
