
var jwt = require('jsonwebtoken')
var LOGIN_SECRET = process.env.LOGIN_SECRET || 'insecure'

if (LOGIN_SECRET == 'insecure') {
  console.error('WARNING! Insecure LOGIN_SECRET')
}

exports.sign = function(data) {
  return jwt.sign(data, LOGIN_SECRET, { expiresInSeconds: 86400 * 14 })
}

exports.verify = function(token) {
  return jwt.verify(token, LOGIN_SECRET)
}

