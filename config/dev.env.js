'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://localhost:9999"'
  // BASE_API: '"http://192.168.0.185:9999"'
  BASE_API: '"http://api.jsztgj.com"'
})
