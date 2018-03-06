'use strict'
const path = require('path')

const config = require('../config')

module.exports = _path => path.posix.join(config.common.assetsSubDirectory, _path)