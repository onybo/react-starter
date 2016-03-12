// For info about this file refer to webpack and webpack-hot-middleware documentation
// Rather than having hard coded webpack.config.js for each environment, this
// file generates a webpack config for the environment passed to the getConfig method.
// this file is copied from: https://github.com/coryhouse/react-slingshot/blob/master/webpack.config.js
// Copyright (c) 2015 Cory House
'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var developmentEnvironment = 'development' ;
var productionEnvironment = 'production';
var testEnvironment = 'test';

var getPlugins = function (env) {
  var GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env),
    __DEV__: env === developmentEnvironment
  };

  var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS) //Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
  ];

  switch (env) {
    case productionEnvironment:
      plugins.push(new ExtractTextPlugin('styles.css'));
      plugins.push(new webpack.optimize.DedupePlugin());
      plugins.push(new webpack.optimize.UglifyJsPlugin());
      break;

    case developmentEnvironment:
      plugins.push(new webpack.HotModuleReplacementPlugin());
      break;
  }

  return plugins;
};

var getEntry = function (env) {
  var entry = [];

  if (env === developmentEnvironment ) { // only want hot reloading when in dev.
    entry.push('webpack-hot-middleware/client');
  }

  entry.push('./src/index');

  return entry;
};

var getLoaders = function (env) {
  var loaders = [{ test: /\.jsx?$/, include: path.join(__dirname, 'src'), loaders: ['babel'] }];

  if (env === productionEnvironment ) {
    // generate separate physical stylesheet for production build using ExtractTextPlugin. This provides separate caching and avoids a flash of unstyled content on load.
    loaders.push({test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract("css?sourceMap!sass?sourceMap")});
  } else {
    loaders.push({test: /(\.css|\.scss)$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap']});
  }

  return loaders;
};

function getConfig(env) {
  return {
    debug: true,
    devtool: env === productionEnvironment  ? 'source-map' : 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    noInfo: false, // set to false to see a list of every file being bundled.
    entry: getEntry(env),
    target: env === testEnvironment ? 'node' : 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: {
      path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
      publicPath: '/dist/',
      filename: 'bundle.js'
    },
    plugins: getPlugins(env),
    module: {
      loaders: getLoaders(env)
    },
    resolve: { extensions: ['', '.js', '.jsx'] }
  };
}

module.exports = getConfig