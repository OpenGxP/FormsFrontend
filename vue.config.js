module.exports = {
  devServer: {
    disableHostCheck: true
  }
}

module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false)
  }
}
