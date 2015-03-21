$('#upload-img').click(function(){
   $("input[type='file']").trigger('click');
})

$("input[type='file']").change(function(){
   $('#img-path').text(this.value.replace(/C:\\fakepath\\/i, ''))
})    

angular.module('internship', ['internship.api'])
.controller('LoginController', [
  '$scope', 'Login',
  function($scope, Login) {
    $scope.Login = Login
  }
])
.controller('PlacesController', [
  '$scope', 'Places',
  function($scope, Places) {
    $scope.places_in_thailand = [
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
        "place_id": 2,
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
    Places.all().then(function(places) {
      $scope.places = places
    })
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
      {
        title: 'Working Hours',
        color: 'orange',
        options: [
          { text: 'Fixed' },
          { text: 'Flexible' },
        ]
      },
      {
        title: 'Programming Languages',
        color: 'red',
        options: [
          { text: 'JAVA' },
          { text: 'C' },
          { text: 'C++' },
          { text: 'C#' },
          { text: 'Python' },
          { text: 'Ruby' },
          { text: 'HTML' },
          { text: 'CSS' },
          { text: 'JS' },
          { text: '.NET' },
          { text: 'Others' }
        ]
      },
    ]
    $scope.countryFilters = [
      {
        title: 'Country',
        color: 'black',
        options: [
          { text: 'Germany' },
          { text: 'Japan' },
          { text: 'Korea' },
          { text: 'Austria' },
          { text: 'Others' },
        ]
      },
    ]
  }
])
.controller('SpecificPlacesController', [
  '$scope',
  function($scope) {
    $scope.place = [
      {
        "place_id": 1,
        "name": "Kookmin U.",
        "full_name": "Kookmin University",
        "environment_rating": 4,
        "coworker_rating": 3,
        "mentor_rating": 6,
        "transportation_rating": 6,
        "benefits_rating": 5,
        "overall_rating": 6,
        "address": "Seoul, South Korea",
        "google_maps": "<iframe src=\"https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3278.912058887085!2d135.73391!3d34.732611000000006!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600122e9fc7b1ce7%3A0x2109b99d4ee8a89c!2z5aWI6Imv5YWI56uv56eR5a2m5oqA6KGT5aSn5a2m6Zmi5aSn5a2m!5e0!3m2!1sen!2sth!4v1425477162088\" width=\"400\" height=\"300\" frameborder=\"0\" style=\"border:0\"></iframe>",
      },
    ]
    $scope.short_reviews = [
      {
        "student_id": 1,
        "student_name": "James",
        "field": "Backend",
        "rating": 4,
        "time": "2014: Sep 15 - Dec 26",
        "review_text": "not more than 140 characthers not more than 140 characthers not more than 140 characthers",
       
      },
      {
        "student_id": 2,
        "student_name": "Aim",
        "field": "Frontend",
        "rating": 5,
        "time": "2014: Sep 1 - Dec 26",
        "review_text": "So Good So Good So Good So Good So Good So Good So Good So Good So Good So Good ",
       
      },
      {
        "student_id": 3,
        "student_name": "Ming",
        "field": "UI/UX",
        "rating": 6,
        "time": "2014: Sep 1 - Dec 26",
        "review_text": "Love Love Love Love Love Love Love Love Love Love Love Love Love Love Love Love",
       
      },

    ]
    $scope.place_rating = [
      {
        "name": "Environment",
        "desc": "บรรยากาศการทำงาน สนุกไหม",
      },
      {
        "name": "Coworker",
        "desc": "เพื่อนร่วมงานเป็นอย่างไร",
      },
      {
        "name": "Employee/Mentor",
        "desc": "ผู้ดูแลให้คำแนะนำและการดูแลที่ดีไหม",
      },
      {
        "name": "Transportation",
        "desc": "การเดินทางสะดวกไหม",
      },
      {
        "name": "Benefits",
        "desc": "ประโยชน์ต่างๆที่ได้รับจากการฝึกงานครั้งนี้",
      },
      {
        "name": "Overall",
        "desc": "ความพึงพอใจโดยรวม",
      },
    ]
    $scope.tag = [
      {
        options: [
          { text: 'Germany' },
          { text: 'Japan' },
          { text: 'Korea' },
          { text: 'Austria' },
          { text: 'Others' },
        ]
      },
    ]
  }
])
.controller('ThailandPlaceController', [
  '$scope','$http',
  function($scope, $http) {
    var obj = {}
    $http.get("http://128.199.76.147:8001/api/places")
    .success(function(response) {
      var places = response;
      $http.get("http://128.199.76.147:8001/api/tags")
      .success(function(response) {
        var tags = response;
        places.forEach(function(place) {
          var cat = [];
        })
        obj = { 'places' : places , 'filters' : tags }  
        $scope.places_in_thailand = obj;
      });
    })
  }
])
