const path = require('path');

module.exports = function (env) {
  return {
    mode: 'production',
    devtool: env.production ? 'source-map' : 'inline-source-map',
    optimization: {
      minimize: !!env.production,
    },
    entry: {
      CookieMonster: {
        import: './src/CookieMonster.js',
        filename: './CookieMonster.js',
      },
    },
    output: {
      filename: 'CookieMonster.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
