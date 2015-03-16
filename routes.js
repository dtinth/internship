var db = require('./db')
var schema = db.schema
var koaBody = require('koa-body')({ multipart: true });
var fs = require('fs')
var crypto = require('crypto')

var KULogin         = require('./lib/ku-login')
var KUName          = require('./lib/ku-name')
var WebToken        = require('./lib/web-token')

exports.install = function(router) {
  /*
   * GET user
   */
  router.get('/users', function*(next) {
    this.body = yield this.render('index');
  })

  /*
   * GET login
   */
  router.get('/login', function*(next) { 
    this.redirect(KULogin.getURL('http://localhost:8001/login/callback'))
  })

  /*
   * GET me
   */
  router.get('/me', function*(next) { 
    var username = yield this.getLoggedInUser()
    this.body = { name: username, username: username }
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
    var user    = yield KULogin.check(this.request.query.code)
    var info    = yield KUName.getKUInfo(user.replace(/^b/, ''))
    if (info.major != 'E17' && info.major != 'E09') {
      throw new Error('Student is not in allowed major!')
    }
    var token   = WebToken.sign(user)
    this.body = { token: token }
  })

  /*
   * POST login
   */
  router.post('/login', function*(next) { 
    this.body = "posted";
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
    var places = db.select().from('places')
    var places_result = yield places.exec(function(err, rows) {
      if (err) return console.error(err);
      //console.log(rows)
    });
    var reviews = db.select().from('reviews')
    var reviews_result = yield reviews.exec(function(err, rows) {
      if (err) return console.log(err);
    })

    for(var i = places_result.length - 1; i >= 0; --i) {
      places_result[i].reviews_count = reviews_result.filter(function(review){
        return review.place_id == places_result[i].id
      }).length
    } 
    this.body = places_result
  });
  
  /*
   * GET single internship place by internship id
   */
  router.get('/api/places/:id' , function*(next) {
  //  this.body = "get internships with id :" + this.params.id;
    var place_by_id = db.select().from('places').join('files','files.id','places.file_id').where('places.id', this.params.id);
    var place_by_id_result = yield place_by_id.exec(function(err, rows) {
      if (err) return console.error(err);
    })

    this.body = place_by_id_result[0] 
  });
 

  /*
   * GET all internship review objects
   */
  router.get('/api/reviews/:id' , function*(next) {
    
    var review_by_id = db.select().from('reviews').where('id', this.params.id)
    var review_by_id_result = yield review_by_id.exec(function(err, rows) {
      if (err) return console.error(err)
    })
      
    this.body =  review_by_id_result[0]
  });

  
  /*
   * POST create review
   * FIELD : summary(string), detail(string), start(date), finish(date), position(string), is_admin(bit), reviewer_id(int), place_id(int)
   */
  router.post('/api/reviews' , function*(next) {
    var queryString = request.querystring;

    this.body = queryString;
  });


  router.get('/api/reviews', function*(next) {
    var query = this.request.query;
    var ratings = db.select().from('ratings')
    var ratings_result = yield ratings.exec(function(err, rows) {
      if (err) return console.error(err);
    });
    //get 'overall' rating category
    var overall_rating = db.select().from('rating_categories').where('name','overall')
    var overall_rating_result = yield overall_rating.exec(function(err, rows) {
      if (err) return console.error(err);
    });
    var overall_rating_id = overall_rating_result[0].id
    
    //get review by place id
    if(query.place_id != undefined) {
      var reviews_by_place_id = db.select().from('reviews').where('place_id', query.place_id)
      var reviews_by_place_id_result = yield reviews_by_place_id.exec(function(err, rows) {
        if(err) return console.log(err)
      })
      for(var i = reviews_by_place_id_result.length - 1 ; i >= 0 ; --i) {
        reviews_by_place_id_result[i].ratings = ratings_result.filter(function(rating) {
          return rating.review_id == reviews_by_place_id_result[i].id
        })
        
      }
      this.body = reviews_by_place_id_result
    }
    //get all reviews
    else {
      var all_reviews =  db.select().from('reviews');
      var all_reviews_results = yield all_reviews.exec(function(err, rows) {
        if(err) return console.log(err)
      })
      
      for(var i = all_reviews_results.length - 1 ; i >= 0 ; --i) {
        var array = ratings_result.filter(function(rating) { 
          return rating.review_id == all_reviews_results[i].id
        })
        array.forEach(function(rating) {
          if(rating.rating_category_id == overall_rating_id) {
            all_reviews_results[i].overall = rating.score
          }
        })
        if(all_reviews_results[i].overall == undefined) all_reviews_results[i].overall = null
        all_reviews_results[i].ratings = array;
      }
     
      this.body = all_reviews_results
     }
  });

    router.get('/api/tags', function*(next) { 
      var tag_categories = db.select('id','name').from('tag_categories').orderBy('order')
      var tag_categories_result = yield tag_categories.exec(function(err,rows) {
        if(err) return console.log(err)
      })

      var tags = db.select('tag_category_id','value').from('tags')
      var tags_result = yield tags.exec(function(err, rows) {
        if(err) return console.log(err)    
      })

      for (var i = tag_categories_result.length - 1; i >= 0; --i) {
        tag_categories_result[i].tags = tags_result.filter(function(tag) {
          return tag.tag_category_id = tag_categories_result[i].id
        })
      } 
      this.body = tag_categories_result
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
      //TODO save path reference into database
      this.body = JSON.stringify(this.request.body)
    });
}

