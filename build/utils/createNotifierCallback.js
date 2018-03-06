'use strict'

const path = require('path')
const notifier = require('node-notifier')
const packageConfig = require('../../package.json')

module.exports = (severity, errors) => {
  console.log(severity)
  console.log(errors)
  if (severity !== 'error') return

  const error = errors[0]
  const filename = error.file && error.file.split('!').pop()

  notifier.notify({
    title: packageConfig.name,
    message: severity + ': ' + error.name,
    subtitle: filename || '',
  })
}