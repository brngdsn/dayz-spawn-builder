const webpack = require('webpack')
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 'v0.0.0'

module.exports = {
  publicPath: '/dayz-spawn-builder/',
  configureWebpack: {
      plugins: [
          new webpack.DefinePlugin({
              'process.env': {
                  PACKAGE_VERSION: '"' + version + '"'
              }
          })
      ]
  },
}