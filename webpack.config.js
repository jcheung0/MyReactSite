const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const Joi = require('webpack-validator').Joi
const parts = require('./libs/parts');
var webpack = require('webpack');
const pkg = require('./package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');


const schemaExtension = Joi.object({
  sassLoader: Joi.any(),
  toolbox: Joi.any(),

})

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
  	path.join(__dirname,'node_modules','purecss'),
  	path.join(__dirname, 'app', 'main.css')
   ],
   build: path.join(__dirname, 'build')
};

const common = {
	entry: {
		app: PATHS.app,
		style: PATHS.style

		//vendor: Object.keys(pkg.dependencies)

		//vendor: ['react']

	  },
	  output: {
	    path: PATHS.build,
		//filename: '[name].[chunkhash].js',
		//filename: '[name].[chunkhash].js',
		
		filename: '[name].js'
	  },
	  plugins: [
	    new HtmlWebpackPlugin({
	      title: 'Webpack demo',
	      filename: 'index.html',
		  template: 'app/index.html'

	    }),
	    new webpack.SourceMapDevToolPlugin({
	      test: [/\.js$/, /\.jsx$/],
	        exclude: 'vendor',
	        filename: "app.[hash].js.map",
	        append: "//# sourceMappingURL=[url]",
	        moduleFilenameTemplate: '[resource-path]',
	        fallbackModuleFilenameTemplate: '[resource-path]',

	      // Match assets just like for loaders.
	      //test: string | RegExp | Array,
	      //include: string | RegExp | Array,

	      // `exclude` matches file names, not package names!
	      //exclude: string | RegExp | Array,

	      // If filename is set, output to this file.
	      // See `sourceMapFileName`.
	      //filename: string,

	      // This line is appended to the original asset processed. For
	      // instance '[url]' would get replaced with an url to the
	      // sourcemap.
	      //append: false | string,

	      // See `devtoolModuleFilenameTemplate` for specifics.
	      //moduleFilenameTemplate: string,
	      //fallbackModuleFilenameTemplate: string,

	      //module: bool, // If false, separate sourcemaps aren't generated.
	      //columns: bool, // If false, column mappings are ignored.

	      // Use simpler line to line mappings for the matched modules.
	      //lineToLine: bool | {test, include, exclude}
	    })
	  ],
	  resolve: {
    	extensions: ['', '.js', '.jsx']
  	}

}

var config;
// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
	config = merge(
		common,
		parts.minify(),
		parts.extractBundle({
        	name: 'vendor',
        	entries: ['react']
      	}),
      	/*{
        	devtool: 'source-map'
      	}*/
		parts.extractCSS(PATHS.style),
		parts.purifyCSS([PATHS.app]),

		//parts.setupCSS(PATHS.app),
		parts.setFreeVariable(
			'process.env.NODE_ENV',
			'production'
		),
		parts.clean(PATHS.build)

	);

    break;
    case 'stats':
	    config = merge(
	    	common,
			parts.minify(),
			parts.extractBundle({
	        	name: 'vendor',
	        	entries: ['react']
	      	}),
	      	/*{
	        	devtool: 'source-map'
	      	}*/
			parts.extractCSS(PATHS.style),
			parts.purifyCSS([PATHS.app]),

			//parts.setupCSS(PATHS.app),
			parts.setFreeVariable(
				'process.env.NODE_ENV',
				'production'
			),
			parts.clean(PATHS.build)
	    	);
    	break;
  default:
  	config = merge(
      common,
      {
        devtool: 'eval-source-map'
      },

      /*{
	      devtool: 'source-map',
	        output: {
	          path: PATHS.build,
	          filename: '[name].[chunkhash].js',
	          // This is used for require.ensure. The setup
	          // will work without but this is useful to set.
	          chunkFilename: '[chunkhash].js'
	      	}
		},*/
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      }),
		parts.setupCSS(PATHS.style),
		{
			module: {
		        loaders: [
		            {
		                test: /\.js?$/,
		                exclude: /node_modules/,
		                loader: 'babel'
		            }, 
		            {
		                test: /\.json?$/,
		                loader: 'json'
		            },
		            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
		            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		            ,
		            {
		            	test: /\.jsx?$/,
		            	loaders: ['babel?cacheDirectory'],
      					include: PATHS.app
					},
					{
			          test:/\.scss$/,
			          loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')

			          //loaders: ["style-loader", "css-loader", "sass-loader"],
			          //include: PATHS.app,node_modules
			        }
		        ]
		    },
		    postcss: [autoprefixer],
		    toolbox: {                                                                                                                                                                               
			    theme: path.join(__dirname, '../client/toolbox-theme.scss')                                                                                                                            
			  },
			sassLoader: {
			  data: '@import "' + path.resolve(__dirname, 'theme/_theme.scss') + '";',
			  includePaths: [path.resolve(__dirname, './app')]

			},
			plugins:[
				new ExtractTextPlugin('bundle.css', { allChunks: true }),

			]

		}
	);
}

//module.exports = validate(config);

// Run validator in quiet mode to avoid output in stats
module.exports = validate(config, {
  quiet: true,
  schemaExtension: schemaExtension
});

