
var WebToken = require('./web-token')
var Students = require('./students')
var co = require('co')

exports.middleware = function() {
  return function*(next) {

    this.getLoggedInUserId = co.wrap(function*() {
      var token = this.request.query['access_token']
      if (!token) throw new Error('access_token required')
      return WebToken.verify(token)
    }.bind(this))

    this.getLoggedInUser = function() {
      return this.getLoggedInUserId().then(function(id) {
        return Students.get(id)
      })
    }.bind(this)

    yield next

  }
}
