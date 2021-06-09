const path = require('path')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  css: {
    extract: false
  },
  chainWebpack: config => {
    config.module.rules.delete('svg')

    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src/assets/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: '[name]' })

    config.module
      .rule('images')
      .exclude.add(resolve('src/assets/icon'))
  }
}
