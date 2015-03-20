var db = require('./db')
var schema = db.schema
var koaBody = require('koa-body')({ multipart: true });
var fs = require('fs')
var crypto = require('crypto')

var KULogin   = require('./lib/ku-login')
var Students  = require('./lib/students')
var WebToken  = require('./lib/web-token')
var Promise   = require('bluebird')

exports.install = function(router) {

  /**
   * GET /api/students/{id}
   * Returns the student's info.
   * ---
   * parameters:
   *  - { name: id, in: path, type: integer,
   *      description: 'User ID in the database.' }
   * responses:
   *  200: { description: 'The student info.' }
   */
  router.get('/api/students/:id', function*(next) {
    var students = []; 
    try {
      students = yield db.select().from('students').where('id',this.params.id);
    } catch(e) {
      console.error(e);
    }
    this.body = students[0];
  })

  /**
   * GET /login
   * Redirects user to login page.
   * ---
   * responses:
   *  302: { description: 'Redirection to login page.' }
   */
  router.get('/login', function*(next) { 
    var SELF_BASE = 'http://localhost:8001'
    this.redirect(KULogin.getURL(SELF_BASE + '/login/callback'))
  })

  /**
   * GET /me
   * Returns the authenticated user's information.
   * ---
   * parameters:
   *  - { name: access_token, type: string, in: query,
   *      description: 'The access_token obtained from logging in' }
   * responses:
   *  200: { description: "Authenticated user's information" }
   */
  router.get('/me', function*(next) { 
    this.body = yield this.getLoggedInUser()
  })

  /*
   * GET /login/callback
   */
  router.get('/login/callback', function*(next) { 
    var locals = { code: this.request.query.code }
    yield this.render('login_callback', locals)
  })

  /*
   * POST /login/verify
   */
  router.post('/login/verify', function*(next) { 
    var nontriUsername = yield KULogin.check(this.request.query.code)
    var userId  = yield Students.loginOrRegister(nontriUsername)
    var token   = WebToken.sign(userId)
    this.body = { token: token }
  })

  /**
   * GET /api/places
   * Returns all available internship places.
   * ---
   * responses:
   *  200: { description: "An array of internship places." }
   */
  router.get('/api/places' , function*(next) {	
    // var places = db.select().from(function() {
   //      this.column('reviews_ratings.place_id', 'rating_categories.name')
   //      	.avg('reviews_ratings.score as avg_rating').count('rating_categories.name as review_count')
   //              .from(function() {
   //                  this.column('ratings.rating_category_id','ratings.score','reviews.place_id')
   //                  .from('reviews')
   //                      .join('ratings', 'reviews.id', 'ratings.review_id').as('reviews_ratings')
   //              })
   //              .join('rating_categories', 'rating_categories.id', 'reviews_ratings.rating_category_id')
   //                  .groupBy('rating_categories.name')
   //                  .as('reviews_score')
   //      	})
   //          .join('places', 'places.id', 'reviews_score.place_id').where('reviews_score.name','overall')
   //          .as('places_api')
    var reviews = [], places = [],tags = [],tc =[];
    try {
      reviews = yield db.select().from('reviews')
      places = yield db.select().from('places')
      tags = yield db.select('reviews.id as review_id','tag_id','tag_category_id').from(function() {
        this.select('tags.id as tag_id','tag_category_id','tag_review.review_id').from('tag_review').join('tags','tag_review.tag_id','tags.id').as('t1')
      }).join('reviews','reviews.id','t1.review_id')
      tc = yield db.select().from('tag_categories').join('tags','tags.tag_category_id','tag_categories.id')
    } catch(e) {
      console.error(e)
    } 
    for(var i = places.length - 1; i >= 0; --i) {
      var assoc_review =  reviews.filter(function(review){
                return review.place_id == places[i].id
      })
      place_tags = []
      assoc_review.forEach(function(review){
        place_tags.push(tags.filter(function(tag) {
          return review.id == tag.review_id
        }))
      })
      place_tags = [].concat.apply([], place_tags)
      id = []
      var set = place_tags.filter(function(element) {
        id.push(element.tag_id)  
        return !(element.tag_id in id)
      })
      set.forEach(function(tag){
        tag.name = tc.filter(function(t) {
          return tag.tag_id == t.id
        })[0].value
      })
      places[i].tags = set
      places[i].reviews_count = assoc_review.length
    }
     
    this.body = places
  });
  
  /**
   * GET /api/places/{id}
   * Retrives the information about one internship place.
   * ---
   * parameters:
   *  - { name: id, in: path, type: integer, description: 'The place ID' }
   * responses:
   *  200: { description: "The info about internship place." }
   */
  router.get('/api/places/:id' , function*(next) {
  //  this.body = "get internships with id :" + this.params.id;
    var place_by_id = [],tags = [];
    try {
      place_by_id = yield db.select().from('places').join('files','files.id','places.file_id').where('places.id', this.params.id);
      //tags = yield db.select('reviews.id as review_id','tag_id','tag_category_id').from(function() {
      //  this.select('tags.id as tag_id','tag_category_id','tag_review.review_id').from('tag_review').join('tags','tag_review.tag_id','tags.id').as('t1')
      //}).join('reviews','reviews.id','t1.review_id') 
    } catch(e) {
      console.error(e) 
    }

    this.body = place_by_id[0]; 
  });
 
  /**
   * GET /api/reviews/{id}
   * Retrives a review information.
   * ---
   * parameters:
   *  - { name: id, in: path, type: integer, description: 'The review ID.' }
   * responses:
   *  200: { description: "Detailed review information." }
   */
  router.get('/api/reviews/:id' , function*(next) {
    var tags = [],review_by_id = [];
    try { 
      tags = yield db.select('tags.id','tags.tag_category_id').from('tag_review').join('tags','tags.id','tag_review.tag_id')
      review_by_id = yield db.select().from('reviews').where('id', this.params.id)
    } catch(e) {
      console.error(e)
    } 
    review_by_id[0].tags = tags 
    this.body =  review_by_id[0]
  });

  /**
   * POST /api/reviews
   * Creates a review.
   * ---
   * parameters:
   *  - { name: summary, in: formData, type: string,
   *      description: 'Review summary in less than 140 characters.' }
   *  - { name: detail, in: formData, type: string,
   *      description: 'Detailed review.' }
   *  - { name: start, in: formData, type: string,
   *      description: 'Start date.' }
   *  - { name: finish, in: formData, type: string,
   *      description: 'Finish date.' }
   *  - { name: position, in: formData, type: string,
   *      description: 'Position' }
   *  - { name: is_admin, in: formData, type: string,
   *      description: 'Is admin? What is this?!!' }
   *  - { name: place_id, in: formData, type: integer,
   *      description: 'The place ID this review belongs to.' }
   *  - { name: access_token, in: formData, type: string,
   *      description: 'The access token of the logged in user.' }
   * responses:
   *  200: { description: "Review is created." }
   */
  router.post('/api/reviews', koaBody , function*(next) {
    var requestBody = this.request.body
    var message = ""
    // data to save
    var reviewer = requestBody.reviewer_id
    var place = requestBody.place_id
    
    try {
      hasReviewer = (yield db.select().from('students').where('id', reviewer)).length > 0
      hasPlace  = (yield db.select().from('places').where('id', place)).length > 0
      if(hasPlace && hasReviewer) {
        var insert = yield db('reviews').insert(requestBody);
        message = insert[0] 
      }
      else { 
        message = "not found reviewer or place" 
      }
    } catch (e) {
      console.error(e)
      message = "can not save : something is wrong"
    }
    this.body = message 
  });
  
  



  /*
   * POST create place
   * FIELD :
   */
  router.post('/api/places', koaBody , function*(next) {
    var requestBody = this.request.body
    var message = ""
    // data to save
    var name = requestBody.name
    var full_name = requestBody.full_name
    
    try {
      hasPlace  = (yield db.select().from('places').where('name',name).orWhere('full_name',full_name)).length > 0
      if(!hasPlace) {
        var insert = yield db('places').insert(requestBody);
        message = insert[0]
      }
      else {
        var message = "place already exists"
      }
    } catch (e) {
      console.error(e)
      message = "can not save : something is wrong"
    }
    this.body = message 
  });

  router.get('/api/reviews', function*(next) {
    var query = this.request.query;
    var ratings = [],tags = [],overall_rating = [];
    try {
      ratings = yield db.select().from('ratings')
      tags = yield db.select('reviews.id as review_id','tag_id','tag_category_id').from(function() {
        this.select('tags.id as tag_id','tag_category_id','tag_review.review_id').from('tag_review').join('tags','tag_review.tag_id','tags.id').as('t1')
      }).join('reviews','reviews.id','t1.review_id') 
      overall_rating = yield db.select().from('rating_categories').where('name','overall')
    } catch(e) {
      console.error(e)
    }
    var overall_rating_id = overall_rating[0].id 
    //get review by place id
    if(query.place_id != undefined) {
      var reviews_by_place_id = [];
      try {
        reviews_by_place_id = yield db.select().from('reviews').where('place_id', query.place_id)
      } catch(e) {
        console.error(e)
      } 
      for(var i = reviews_by_place_id.length - 1 ; i >= 0 ; --i) {
        reviews_by_place_id[i].ratings = ratings.filter(function(rating) {
          return rating.review_id == reviews_by_place_id[i].id
        })
        reviews_by_place_id[i].tags = tags.filter(function(tag) {
          return tag.review_id == reviews_by_place_id[i].id
        })

      }
      this.body = reviews_by_place_id
    }
    //get all reviews
    else {
      var all_reviews = []; 
      try {
        all_reviews = yield db.select().from('reviews');
      } catch(e) {
        console.error(e)
      }
      
      for(var i = all_reviews.length - 1 ; i >= 0 ; --i) {
        all_reviews[i].tags = tags.filter(function(tag) {
          return tag.review_id == all_reviews[i].id
        })
        var array = ratings.filter(function(rating) { 
          return rating.review_id == all_reviews[i].id
        })
        array.forEach(function(rating) {
          if(rating.rating_category_id == overall_rating_id) {
            all_reviews[i].overall = rating.score
          }
        })
        if(all_reviews[i].overall == undefined) all_reviews[i].overall = null
        all_reviews[i].ratings = array;
      }
     
      this.body = all_reviews
     }
  });

  router.get('/api/tags', function*(next) { 
    var tag_categories = []; 
    try {
      tag_categories = yield db.select('id','name').from('tag_categories').orderBy('order')
    } catch(e) {
      console.error(e)
    }

    var tags = []
    try { 
      tags = yield db.select('id','tag_category_id','value').from('tags')
    } catch(e) { 
      console.error(e)
    }

    for (var i = tag_categories.length - 1; i >= 0; --i) {
      tag_categories[i].tags = tags.filter(function(tag) {
        return tag.tag_category_id == tag_categories[i].id
      })
    } 
    this.body = tag_categories
  });

    /*
     * POST /files handle file upload to store in temp and move to local file storage with hased name
     */
    router.post('/files', koaBody, function *(next) {
      var reqbody = this.request.body
      var file = fs.readFileSync(reqbody.files.file.path)
      var filetype = reqbody.files.file.name.substring(reqbody.files.file.name.lastIndexOf('.'),reqbody.files.file.name.length)
      var sha256 = crypto.createHash("sha256");
      sha256.update(file, 'utf-8')
      var result = sha256.digest("hex");
      //move file into local storage
      fs.rename(reqbody.files.file.path, __dirname + '/files/' + result + filetype,function (err) {
      if (err) throw err;
      	console.log('renamed complete');
      })
      var insert;
      try {
        insert = yield db('files').insert({url : result+filetype})
      } catch(e) {
        console.error(e)
      }
      if(insert == undefined) this.body = "cannot insert";
      else this.body = insert[0];
    });

  /**
   * GET /swagger.json
   * Returns an API documentation in Swagger.io format.
   * ---
   * responses:
   *  200: { description: 'The API description in Swagger.io format' }
   */
  var swagger = (function() {
    var yaml = require('js-yaml')
    var assign = require('object-assign')
    var code = fs.readFileSync(module.filename, 'utf-8')
    var swagger = {
      swagger: '2.0',
      info: { title: 'Internship', version: '0.0' },
      paths: { }
    }
    var comments = code.match(/\/\*\*(?:[^\*]|\*[^\/])*\*\//g)
        .map(function(x) {
          return x
            .replace(/^\/\*\*|\*\/$/g, '')
            .replace(/^[ \t]*\*[ ]/mg, '')
            .trim()
        })
    var paths = comments
        .map(function(x) {
          var match = /^(GET|POST|DELETE|PUT|PATCH)\s+(\/[\S+]+)\s+([\s\S]*?)---([\s\S]*)$/.exec(x)
          if (match) {
            return {
              method: match[1],
              path: match[2],
              operation: assign({ summary: match[3] }, yaml.safeLoad(match[4]))
            }
          } else {
            return null
          }
        })
        .filter(function(x) { return x != null })
    paths.forEach(function(pathItem) {
      var pathname = pathItem.path
      var method = pathItem.method.toLowerCase()
      var path = swagger.paths[pathname] || (swagger.paths[pathname] = { })
      path[method] = pathItem.operation
    })
    return swagger
  })()
  router.get('/swagger.json', function*(next) {
    this.body = swagger
  })

}






