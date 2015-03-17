var db = require('./db')
var schema = db.schema
var koaBody = require('koa-body')({ multipart: true });
var fs = require('fs')
var crypto = require('crypto')

var KULogin         = require('./lib/ku-login')
var Students        = require('./lib/students')
var WebToken        = require('./lib/web-token')

exports.install = function(router) {
  /*
   * GET student
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

  /*
   * GET login
   */
  router.get('/login', function*(next) { 
    var SELF_BASE = 'http://localhost:8001'
    this.redirect(KULogin.getURL(SELF_BASE + '/login/callback'))
  })

  /*
   * GET me
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

  /*
   * GET all internship places objects
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
    var places = [];
    try {
      places = yield db.select().from('places')
    } catch(e) {
      console.error(e)
    }
    var reviews = [];
    try {
      reviews = yield db.select().from('reviews')
    } catch(e) {
      console.erroe(e)
    }

    for(var i = places.length - 1; i >= 0; --i) {
      	places[i].reviews_count = reviews.filter(function(review){
        return review.place_id == places[i].id
      }).length
    } 
    this.body = places
  });
  
  /*
   * GET single internship place by internship id
   */
  router.get('/api/places/:id' , function*(next) {
  //  this.body = "get internships with id :" + this.params.id;
    var place_by_id = [];
    try {
      place_by_id = yield db.select().from('places').join('files','files.id','places.file_id').where('places.id', this.params.id);
    } catch(e) {
      console.error(e) 
    }

    this.body = place_by_id[0]; 
  });
 

  /*
   * GET all internship review objects
   */
  router.get('/api/reviews/:id' , function*(next) {
    
    var review_by_id = [];
    try {
      review_by_id = yield db.select().from('reviews').where('id', this.params.id)
    } catch(e) {
      console.error(e)
    }
      
    this.body =  review_by_id[0]
  });

  
  /*
   * POST create review
   * FIELD : summary(string), detail(string), start(date), finish(date), position(string), is_admin(bit), reviewer_id(int), place_id(int)
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
    var ratings = [];
    try {
      ratings = yield db.select().from('ratings')
    } catch(e) {
      console.error(e)
    }
    //get 'overall' rating category
    var overall_rating = [] 
    try {
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
      tags = yield db.select('tag_category_id','value').from('tags')
    } catch(e) { 
      console.error(e)
    }

    for (var i = tag_categories.length - 1; i >= 0; --i) {
      tag_categories[i].tags = tags.filter(function(tag) {
        return tag.tag_category_id = tag_categories[i].id
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
}

