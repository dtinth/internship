var  db = require('./db')
var schema = db.schema

exports.install = function(router) {
	/*
	 * GET user
     */
	router.get('/users', function*(next) {
		this.body = yield this.render('index');
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
		 var places = db.select().from(function() {
		 				this.column('reviews_ratings.place_id', 'rating_categories.name')
		 				 	.avg('reviews_ratings.score as avg_rating').count('rating_categories.name as review_count')
		 				 		.from(function() {
		 								this.column('ratings.rating_category_id','ratings.score','reviews.place_id')
		 									.from('reviews')
		 										.join('ratings', 'reviews.id', 'ratings.review_id').as('reviews_ratings')
		 						})
		 							.join('rating_categories', 'rating_categories.id', 'reviews_ratings.rating_category_id')
		 								.groupBy('rating_categories.name')
		 									.as('reviews_score')
		 			})
		 				.join('places', 'places.id', 'reviews_score.place_id')
		 					.as('places_api')

		var tags = db.column('reviews.place_id', 'tag_review.review_id', 'tag_review.tag_id')
						.from('tag_review')
							.join('reviews', 'reviews.id', 'tag_review.review_id')
								.as('review_tag_review')
		
		var tag_category_tag = db.select().from('tag_categories').join('tags','tag_categories.id','tags.tag_category_id').as('tag_category_tag')

		//console.log(places.toString())
		//console.log(tags.toString())
		//console.log(tag_category_tag.toString())
		var places_result = yield places.exec(function(err, rows) {
			if (err) return console.error(err);
			//console.log(rows)
		});
		var tags_result = yield tags.exec(function(err,rows) {
			if (err) return console.error(err);
		})
		var tag_category_tag_result = yield tag_category_tag.exec(function(err,rows) {
			if (err) return console.error(err);
		})
		this.body = { "tag_category_tag" : tag_category_tag_result ,"places" : places_result , "tags" : tags_result }
	});
	
	/*
	 * GET single internship place by internship id
     */
	router.get('/api/places/:id' , function*(next) {
		this.body = "get internships with id :" + this.params.id;
	});

	/*
	 * GET all internship review objects
     */
	router.get('/api/review/:id' , function*(next) {
		this.body = "get review with id : " + this.params.id;
	});

	/*
	 * GET all filter objects
     */
	router.get('/api/filter', function*(next) {
		this.body = "get all internships";
	});
	
	/*
	 * POST create review
	 * FIELD : summary(string), detail(string), start(date), finish(date), position(string), is_admin(bit), reviewer_id(int), place_id(int)
     */
	router.post('/api/review/' , function*(next) {
		this.body = this.request.body;
	});
	
}

