'use strict'
const path = require('path')

const config = require('../../config')

exports.assetsPath = _path => path.posix.join(config.common.assetsSubDirectory, _path)