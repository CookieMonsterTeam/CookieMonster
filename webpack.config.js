const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		cache: { import: './src/Cache/Cache.js', filename: './Cache.js' },
		config: { import: './src/Config/Config.js', filename: './Config.js' },
		data: { import: './src/Data/Data.js', filename: './Data.js' },
		disp: { import: './src/Disp/Disp.js', filename: './Disp.js' },
		footer: { import: './src/Footer/Footer.js', filename: './Footer.js' },
		header: { import: './src/Header/Header.js', filename: './Header.js' },
		main: { import: './src/Main/Main.js', filename: './Main.js' },
		sim: { import: './src/Sim/Sim.js', filename: './Sim.js' },
	},
	output: {
		filename: 'Data.js',
		path: path.resolve(__dirname, 'dist'),
	},
};
