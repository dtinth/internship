
var CLIENT_ID     = process.env.POP3AUTH_CLIENT_ID || '4'
var CLIENT_SECRET = process.env.POP3AUTH_CLIENT_SECRET || '2_2'
var request       = require('request')
var Promise       = require('bluebird')
var co            = require('co')

if (CLIENT_ID == '4') {
  console.error('WARNING! Insecure client ID and secret for POP3Auth')
}

exports.getURL = function(callbackURL) {
  return 'https://pop3auth.herokuapp.com/dialog/oauth?' +
      'server=nontri.ku.ac.th&with=your+Nontri+account&' +
      'example=b5XXXXXXXXX&response_type=code&' +
      'client_id=' + CLIENT_ID + '&' +
      'redirect_uri=' + encodeURIComponent(callbackURL)
}

exports.check = function(code) {
  return co(function*() {
    var url = 'https://pop3auth.herokuapp.com/oauth/access_token?' +
        'client_id=' + CLIENT_ID + '&' +
        'client_secret=' + CLIENT_SECRET + '&' +
        'code=' + code
    var data = yield Promise.promisify(request)(url)
    var body = data[1]
    var token = require('querystring').parse(body)['access_token']
    return token
  }).then(co.wrap(function*(token) {
    var url = 'https://pop3auth.herokuapp.com/me?access_token=' + token
    var data = yield Promise.promisify(request)(url)
    var body = JSON.parse(data[1])
    if (body.server != 'nontri.ku.ac.th') {
      throw new Error('Only nontri server allowed')
    }
    var user = body.user
    if (!user.match(/^b\d{10}$/)) {
      throw new Error('Invalid user returned')
    }
    return user
  }))
}

