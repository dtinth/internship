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
		//var query = db.select().table('places')	
		//var query = db.raw("SELECT * FROM places AS p LEFT JOIN (SELECT ra_re.place_id , name, AVG(score) as avg_score FROM rating_categories as ra_c LEFT JOIN (SELECT ra.rating_category_id , ra.score, re.place_id FROM reviews AS re LEFT JOIN ratings AS ra ON re.id = ra.review_id) as ra_re ON ra_c.id = ra_re.rating_category_id GROUP BY name) as reviews_ratings ON p.id = reviews_ratings.place_id");	io
		var query = db.select().from(function() {
						this.column('reviews_ratings.place_id', 'rating_categories.name')
						 	.avg('reviews_ratings.score')
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

		console.log(query.toString())
		var result = yield query.exec(function(err, rows) {
			if (err) return console.error(err);
			//console.log(rows)
		});
		this.body = result
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

