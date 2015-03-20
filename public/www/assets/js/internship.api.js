
angular.module('internship.api', ['internship.config'])
.factory('API', [
  '$http', 'CONFIG',
  function($http, CONFIG) {
    var API = { }
    API.get = function(path, params) {
      return $http({
        method: 'GET',
        url: CONFIG.server + path,
        params: params || {},
      })
      .then(getData)
    }
    API.post = function(path, data) {
      return $http({
        method: 'POST',
        url: CONFIG.server + path,
        data: data || {},
      })
      .then(getData)
    }
    return API
    function getData(response) {
      return response.data
    }
  }
])
.factory('Login', [
  'API', '$rootScope', 'CONFIG',
  function(API, $rootScope, CONFIG) {
    var Login = { }
    Login.isLoggedIn = false
    Login.accessToken = localStorage.accessToken
    Login.logout = function() {
      delete Login.accessToken
      delete localStorage.accessToken
      check()
    }
    Login.login = function() {
      var loginURL = CONFIG.server + '/login'
      window.open(loginURL, '_blank', 'dialog=true,width=640,height=480')
      $(window).one('message', function(e) {
        var event = e.originalEvent
        if (event.data[0] != 'token') return
        if (event.origin != CONFIG.server) {
          var message = 'Wrong login origin detected\n' +
            'Expected: ' + CONFIG.server + '\n' +
            'Actual: ' + event.origin
          alert(message)
          throw new Error(message)
        }
        localStorage.accessToken = Login.accessToken = event.data[1]
        check().then(function() {
          event.source.postMessage(['loginOK'], '*')
        })
      })
    }
    function check() {
      if (!Login.accessToken) {
        Login.isLoggedIn = false
        return
      }
      return API.get('/me', { access_token: Login.accessToken })
      .then(function(user) {
        Login.isLoggedIn = true
        Login.user = user
      })
      .catch(function() {
        Login.isLoggedIn = false
      })
    }
    check()
    return Login
  }
])
.factory('Places', [
  'API',
  function(API) {
    return {
      all: function() {
        return API.get('/api/places')
      }
    }
  }
])
