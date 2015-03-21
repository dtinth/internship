
angular.module('internship.config', ['ngRoute'])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/places/:places_id', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]).config(['$locationProvider',function($locationProvider) {
  	$locationProvider.html5Mode(false).hashPrefix('!');
  }])
.value('CONFIG', {
  server: 'http://localhost:8001'
})

