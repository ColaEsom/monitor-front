
module.exports = {
  devServer: {
    port: 4396,
    proxy: {
      "/mo": {
        target: "http://localhost:18088/",
        ws: true,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true,
      }
    }
  }
}