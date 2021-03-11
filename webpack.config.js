/** We know this is not how Webpack should be used, but we are slowly transferring our code.
 * For now this is how at least start to create a structure that allows us to transfer towards
 * more modular code. Any help is highly appreciated.
*/
const path = require('path');

module.exports = {
	mode: 'production',
	devtool: 'eval-source-map',
	entry: {
		CookieMonster: { import: './src/CookieMonster.js', filename: './CookieMonster.js' },
	},
	output: {
		filename: 'CookieMonster.js',
		path: path.resolve(__dirname, 'dist'),
	},
};
