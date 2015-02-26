// select places for internship places page
db.select().from(function() {
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