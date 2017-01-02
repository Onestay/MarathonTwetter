module.exports = {
	entry: './src/public/javascript/welcome.js',
	output: {
		path: './src/public/build',
		filename: 'welcome.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node-modules/,
				loaders: ['react-hot', 'babel-loader']
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			}
		]
	},
	plugins: [
		new webpack.ProviderPlugin({
			jQuery: 'jquery',
			$: 'jquery',
			jquery: 'jquery'
		})
	]
};
