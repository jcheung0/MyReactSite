const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
const ImageWebpack = require('image-webpack-loader');

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;


exports.devServer = function(options) {
  return {

  	watchOptions: {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,
      // Poll using interval (in ms, accepts boolean too)
      poll: 1000
    },
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
}

exports.setupCSS = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: paths
        },{
          test:/\.scss$/,
          loaders: ["style-loader", "css-loader", "sass-loader"],
          include: paths
        }
      ]
    }
  };
}


exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        // Don't beautify output (enable for neater output)
		  beautify: false,

		  // Eliminate comments
		  comments: true,

		  // Compression specific options
		  compress: {
		    warnings: false,

		    // Drop `console` statements
		    drop_console: true
		  },

		  // Mangling specific options
		  mangle: {
		    // Don't mangle $
		    except: ['$'],

		    // Don't care about IE8
		    screw_ie8 : true,

		    // Don't mangle function names
		    keep_fnames: true
		  },
      except: ['webpackJsonp']
      })
    ]
  };
}


exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
}


exports.extractBundle = function(options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define an entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })
    ]
  };
}


exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
      })
    ]
  };
}


exports.extractCSS = function(paths) {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
}


exports.purifyCSS = function(paths) {
  return {
    plugins: [
      new PurifyCSSPlugin({
        basePath: process.cwd(),
        // `paths` is used to point PurifyCSS to files not
        // visible to Webpack. You can pass glob patterns
        // to it.
        paths: paths
      }),
    ]
  }
}
exports.compressImages = function(paths){
  return {
      module:{
        loaders:[
          {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
        ]
      }
  }
}

exports.reactLoader = function(path){
  return {
    module: {
  loaders: [
    {
      test: /\.jsx?$/,
      // Enable caching for improved performance during development
      // It uses default OS directory by default. If you need
      // something more custom, pass a path to it.
      // I.e., babel?cacheDirectory=<path>
      loaders: ['babel?cacheDirectory'],
      // Parse only app files! Without this it will go through
      // the entire project. In addition to being slow,
      // that will most likely result in an error.
      include: PATHS.app
    }
    ]
    }
  }
}
