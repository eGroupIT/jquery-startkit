'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction ? false : true;

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: sourceMapEnabled,
  }
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: sourceMapEnabled,
  }
}

// generate loader string to be used with extract text plugin
function generateLoaders (loader, loaderOptions) {
  const loaders = [cssLoader, postcssLoader]

  if (loader) {
    loaders.push({
      loader: loader + '-loader',
      options: Object.assign({}, loaderOptions, {
        sourceMap: sourceMapEnabled
      })
    })
  }

  if (isProduction) {
    return ExtractTextPlugin.extract({
      use: loaders,
      fallback: 'vue-style-loader'
    })
  } else {
    return ['vue-style-loader'].concat(loaders)
  }
}

module.exports = () => ({
  loaders: {
    css: generateLoaders(),
    postcss: generateLoaders(),
    scss: generateLoaders('sass'),
  },
  cssSourceMap: sourceMapEnabled,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
})
