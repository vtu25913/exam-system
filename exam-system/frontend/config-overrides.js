module.exports = function override(config, env) {
  if (env === 'development') {
    // Remove HMR-related plugins that cause the WebSocket crash on Windows
    config.plugins = config.plugins.filter(
      (plugin) =>
        plugin.constructor.name !== 'HotModuleReplacementPlugin' &&
        plugin.constructor.name !== 'ReactRefreshPlugin'
    );
    // Disable hot in devServer
    if (config.devServer) {
      config.devServer.hot = false;
      config.devServer.liveReload = false;
    }
    // Remove HMR entries from entry points
    if (Array.isArray(config.entry)) {
      config.entry = config.entry.filter(
        (e) => !e.includes('webpack/hot') && !e.includes('react-refresh')
      );
    }
  }
  return config;
};
