const path = require('path');

module.exports = function override(config, env) {
  if (env === 'production') {
    // Disable source maps completely
    config.devtool = false;
    
    // Remove source map files
    config.plugins = config.plugins.filter(plugin => 
      !plugin.constructor.name.includes('SourceMap')
    );

    // Minimize and uglify
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: false,
    };

    // Remove comments
    config.module.rules.push({
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        compact: true,
        comments: false,
      },
    });
  }
  
  return config;
} 