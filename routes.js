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
    var SELF_BASE = 'http://128.199.76.147:8001'
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


  router.get('/api/countries', function*(next) { 
    var countries = [],tags = [];
    try {
      countries = yield db.select().from('countries')
    } catch(e) {
      console.error(e) 
    }

    this.body = countries; 

  })

  router.get('/api/availablecountries', function*(next) { 
    var ava_countries = [],tags = [];
    try {
      ava_countries = yield db.select('countries.id','countries.name').from('countries').join('places','places.country_id','countries.id');
    } catch(e) {
      console.error(e) 
    }

    this.body = ava_countries; 
  })

  /**
   * GET /api/places
   * Returns all available internship places.
   * ---
   * responses:
   *  200: { description: "An array of internship places." }
   */
  router.get('/api/places' , function*(next) {	
    var reviews = [], places = [],tags = [],tc =[];
    try {
      reviews = yield db.select().from('reviews')
      places = yield db.select('places.id','places.name','places.full_name','places.address','places.latitude','places.longitude','places.about','places.website_url','places.file_id','places.country_id').from('places').join('countries','places.country_id','countries.id')
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
  })

  router.get('/api/places/thai' , function*(next) {	
    var reviews = [], places = [],tags = [],tc =[];
    try {
      reviews = yield db.select().from('reviews')
      places = yield db.select('places.id','places.name','places.full_name','places.address','places.latitude','places.longitude','places.about','places.website_url','places.file_id','places.country_id').from('places').join('countries','places.country_id','countries.id').where('countries.name','Thailand')
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

    router.get('/api/places/overseas' , function*(next) {	
    var reviews = [], places = [],tags = [],tc =[];
    try {
      reviews = yield db.select().from('reviews')
      places = yield db.select('places.id','places.name','places.full_name','places.address','places.latitude','places.longitude','places.about','places.website_url','places.file_id','places.country_id').from('places').join('countries','places.country_id','countries.id').whereNot('countries.name','Thailand')
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
      place_by_id = yield db.select('places.id','country_id','name','full_name','file_id','address','latitude','longitude','about','website_url').from('places').join('files','files.id','places.file_id').where('places.id', this.params.id);
      //tags = yield db.select('reviews.id as review_id','tag_id','tag_category_id').from(function() {
      //  this.select('tags.id as tag_id','tag_category_id','tag_review.review_id').from('tag_review').join('tags','tag_review.tag_id','tags.id').as('t1')
      //}).join('reviews','reviews.id','t1.review_id')
      url = yield db.select('url').from('files').where('id', place_by_id[0].file_id)
      place_by_id[0].url = url[0].url;
    } catch(e) {
      console.error(e) 
    }

    this.body = place_by_id[0]; 
  });

  

  router.get('/api/tagcategories' , function*(next) {
  //  this.body = "get internships with id :" + this.params.id;
    var tag_categories = [],tags = [];
    try {
      tag_categories = yield db.select().from('tag_categories')
    } catch(e) {
      console.error(e) 
    }

    this.body = tag_categories; 
  });


  router.get('/api/ratingcategories' , function*(next) {
  //  this.body = "get internships with id :" + this.params.id;
    var rating_categories = [],tags = [];
    try {
      rating_categories = yield db.select().from('rating_categories')
    } catch(e) {
      console.error(e) 
    }

    this.body = rating_categories; 
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
    var tags = [],review_by_id = [],rating_by_review_id = [];
    try {
      rating_by_review_id = yield db.select('ratings.id','score','review_id','name','description','rating_categories.order').from('ratings').join('rating_categories','ratings.rating_category_id','rating_categories.id').where('review_id',this.params.id).orderBy('ratings.id')     
      tags = yield db.select('t1.id','tag_category_id','name','value','tag_categories.order','t1.review_id').from(function() {
        this.select('tags.id','tags.value','tags.tag_category_id','tag_review.review_id').from('tag_review').join('tags','tags.id','tag_review.tag_id').as('t1')
      }).join('tag_categories','tag_categories.id','t1.tag_category_id').where('t1.review_id',this.params.id)
    //tags = yield db.select('tags.id','tags.tag_category_id').from('tag_review').join('tags','tags.id','tag_review.tag_id')
      review_by_id = yield db.select().from('reviews').where('id', this.params.id)
    } catch(e) {
      console.error(e)
    } 
    review_by_id[0].tags = tags
    review_by_id[0].ratings = rating_by_review_id
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
    console.log("requestBody")
    console.log(requestBody);
    var reviewer = requestBody.reviewer_id
    var place = requestBody.place_id
    var start_date = requestBody.start
    var finish_date = requestBody.finish
    var detail = requestBody.detail
    var sum = requestBody.summary
    var rating = requestBody.ratings
    var tag = requestBody.tags
    var position = requestBody.position
    var review_obj = {"reviewer_id":reviewer,"place_id":place,"start":start_date,"finish":finish_date,"detail":detail,"summary":sum,"position":position} 
    try {
      hasReviewer = (yield db.select().from('students').where('id', reviewer)).length > 0
      hasPlace  = (yield db.select().from('places').where('id', place)).length > 0
      if(hasPlace && hasReviewer) {
        var review_id = yield db('reviews').insert(review_obj)
        console.log("test",review_id)
        review_id = review_id[0]
        console.log("tag",tag)
        for(var i = 0 ; i < tag.length ; i++){
          var tag_obj = {"tag_id":tag[i],"review_id":review_id}
          yield db('tag_review').insert(tag_obj) 
        }
        console.log("tag fin")
        for(var i = 0 ; i < rating.length ; i++){
          var rating_obj = {"score":rating[i].rating_score,"review_id":review_id,"rating_category_id":rating[i].rating_category}
          yield db('ratings').insert(rating_obj)
        }
        message = review_id
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
  router.delete('/api/reviews/:id', koaBody ,function*(next){
    var requestBody = this.request.body
    var reviewer_id = requestBody.reviwer_id;
    var review_id = this.params.id
    var review_obj = yield db('reviews').where('id',review_id)
    if(review_obj[0].reviwer_id == reviewer_id){
      yield db('ratings').where('review_id',review_id).del()
      yield db('tag_review').where('review_id',review_id).del()
      yield db('reviews').where('id',review_id).del()    
      this.body = "deleted"
    }
    else{
      this.body = "error"
    }

  });  
  router.put('/api/reviews/:id', koaBody , function*(next) {
    var requestBody = this.request.body
    var message = ""
    // data to save
    console.log("requestBody")
    console.log(requestBody);
    var reviewer = requestBody.reviewer_id
    var place = requestBody.place_id
    var start_date = requestBody.start
    var finish_date = requestBody.finish
    var detail = requestBody.detail
    var sum = requestBody.summary
    var rating = requestBody.ratings
    var tag = requestBody.tags
    var position = requestBody.position
    var review_obj = {"reviewer_id":reviewer,"place_id":place,"start":start_date,"finish":finish_date,"detail":detail,"summary":sum,"position":position}
    try {
      
      hasPlace  = (yield db.select().from('places').where('id', place)).length > 0
      var review = (db('reviews').where('id',this.params.id))
      var review_obj = (yield review)[0]
      var review_id = review_obj.id
      console.log('test',review_obj);
      if(reviewer != review_obj.reviewer_id){
        message = "error"

      }
      else if(hasPlace) {
        review.update(review_obj)
        console.log('test22')
        yield db('tag_review').where('review_id',review_id).del()
        console.log('tag_review')
        for(var i = 0 ; i < tag.length ; i++){
          var tag_obj = {"tag_id":tag[i],"review_id":review_id}
          yield db('tag_review').insert(tag_obj)
        }
        console.log("tag fin")
        yield db('ratings').where('review_id',review_id).del()
        for(var i = 0 ; i < rating.length ; i++){
          var rating_obj = {"score":rating[i].rating_score,"review_id":review_id,"rating_category_id":rating[i].rating_category}
          yield db('ratings').insert(rating_obj)
        }
        message = review_id
      }
      else {
        message = "not found reviewer or place"
         }
      }catch(e){
        console.error(e)
      }
        this.body = message  
  })



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
    var file_id = requestBody.file_id
    var address
    try {
      hasPlace  = (yield db.select().from('places').where('name',name).orWhere('full_name',full_name)).length > 0
      hasFile = (yield db.select().from('files').where('id',file_id)).length > 0 
      if(!hasPlace && hasFile) {
        var insert = yield db('places').insert(requestBody);
        message = insert[0]
      }
      else {
        var message = "place already exists or file is not exists"
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
      console.log(reqbody)
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
      else this.body = { 'file_id' : insert[0], 'url' : result+filetype };
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






