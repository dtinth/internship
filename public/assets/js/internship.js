
angular.module('internship', [])
.controller('PlacesController', [
  '$scope',
  function($scope) {
    $scope.places = [
      {
        "place_id": 1,
        "name": "Orion",
        "rating": 4,
        "review_count": 6,
        "id": 1,
        "full_name": "Orion Health",
        "address": "Bangkok, Thailand",
        "latitude": 1.1,
        "longitude": 1.1,
        "about": "about orion",
        "website_url": "www.orionhealth.com"
      },
      {
        "place_id": 1,
        "name": "Lnwshop",
        "rating": 5,
        "review_count": 3,
        "id": 1,
        "full_name": "Lnwsho Co. Ltd.",
        "address": "Bangkok, Thailand",
        "latitude": 1.1,
        "longitude": 1.1,
        "about": "about Lnwshop",
        "website_url": "www.Lnwshop.com"
      }
    ]
    $scope.filters = [
      {
        title: 'Paid',
        color: 'blue',
        options: [
          { text: 'Paid' },
          { text: 'Non-Paid' },
        ]
      },
      {
        title: 'Field',
        color: 'green',
        options: [
          { text: 'Data Mining' },
          { text: 'Data Warehouse' },
          { text: 'Web Service' },
          { text: 'Business Intelligence' },
          { text: 'Business IT' },
          { text: 'Game Development' },
          { text: 'Mobile Application' },
          { text: 'iOS' },
          { text: 'Android' },
          { text: 'Research' },
          { text: 'Facebook' }
        ]
      },
    ]
  }
])
