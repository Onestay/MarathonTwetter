const webpack = require('webpack');
const baseDir = './src/public/javascript/';
module.exports = {
	entry: {
//		welcome: `${baseDir}/welcome.js`,
//		startSetup: `${baseDir}/startSetup.js`,
//		importSchedule: `${baseDir}/importSchedule.js`,
		dashboard: `${baseDir}/dashboard.jsx`
	},
	output: {
		path: './src/public/build',
		filename: `[name].bundle.js`
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node-modules/,
				loaders: ['babel-loader']
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.jsx$/,
				exclude: /node-modules/,
				loaders: ['react-hot', 'babel-loader']
			}
		]
	},
	resolve: {
		alias: {
			$: 'jquery',
			jquery: 'jquery',
			tether: 'tether'
		}
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.Tether': 'tether'
		})
	]
};
