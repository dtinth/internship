
var WebToken = require('./web-token')
var co = require('co')

exports.middleware = function() {
  return function*(next) {
    this.getLoggedInUser = co.wrap(function*() {
      var token = this.request.query['access_token']
      if (!token) throw new Error('access_token required')
      return WebToken.verify(token)
    }.bind(this))
    yield next
  }
}
