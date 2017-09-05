// Dependencies
import webpack from 'webpack';
import path from 'path';
import ChunksPlugin from 'webpack-split-chunks';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// Environment
const isDevelopment = process.env.NODE_ENV !== 'production';

// Paths
const PATHS = {
  index: path.join(__dirname, 'src/app_react'),
  build: path.join(__dirname, 'src/public/build'),
  src: path.join(__dirname, 'src')
};

// Webpack config functions

const getDevtool = () => 'cheap-module-eval-source-map';

const getEntry = () => {
  const entry = [
    PATHS.index
  ];

  if (isDevelopment) {
    entry.push('webpack-hot-middleware/client?reload=true');
  }

  return entry;
};

const getOutput = () => ({
  path: PATHS.build,
  filename: '[name].bundle.js'
});

const getPlugins = () => {
  const plugins = [
    // Passem variables node
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.EnvironmentPlugin({
      'NODE_ENV': 'development'
    }),
    // Afegim copyright als scripts
    new webpack.BannerPlugin("Copyright analogicemotion.com - Multimedia Publishers"),
    new webpack.optimize.OccurrenceOrderPlugin(true)
  ];
  /*
  const plugins = [
    new ChunksPlugin({
      to: 'vendor',
      test: /node_modules/
    })
  ];
  */

  if (isDevelopment) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.ProgressPlugin()
      //new HtmlWebpackPlugin({ title: 'Webpack App' })
    );
  } else {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        }
      })
    );
  }

  return plugins;
};

const getLoaders = () => ({
  loaders: [{
    test: /\.jsx?$/,
    loaders: ['react-hot-loader', 'babel-loader'],
    include: PATHS.src,
    exclude: /node_modules/
  },
  {
    test: /(\.css)$/,
    loaders: ['style-loader','css-loader']
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
  }]
});


// Webpack Config
var config  = {
  devtool: getDevtool(),
  entry: getEntry(),
  output: getOutput(),
  plugins: getPlugins(),
  module: getLoaders(),
  target: 'web'
};

// Exports
export default config;
