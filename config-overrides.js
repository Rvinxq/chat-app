module.exports = function override(config, env) {
  // Disable source maps in production
  if (env === 'production') {
    config.devtool = false;
  }
  
  return config;
} 