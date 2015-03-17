
exports.up = function(knex, Promise) {
  
  return knex.schema

  .createTable('files', function(t) {
    t.increments()
    t.string('url')
  })

  .createTable('students', function(t) {
    t.increments()
    t.string('student_id', 12).unique()
    t.string('name').nullable()
    t.string('nickname').nullable()
    t.string('major').nullable()
    t.string('contact_url').nullable()
    t.integer('file_id').unsigned().references('id').inTable('files')
    t.boolean('is_admin')
  })

  .createTable('places', function(t) {
    t.increments()
    t.string('name')
    t.string('full_name')
    t.string('address')
    t.float('latitude')
    t.float('longitude')
    t.text('about')
    t.string('website_url')
    t.integer('file_id').unsigned().references('id').inTable('files')
  })

  .createTable('reviews', function(t) {
    t.increments()
    t.text('summary')
    t.text('detail')
    t.date('start')
    t.date('finish')
    t.string('position')
    t.boolean('is_admin')
    t.integer('reviewer_id').unsigned().references('id').inTable('students')
    t.integer('place_id').unsigned().references('id').inTable('places')
  })

  .createTable('tag_categories', function(t) {
    t.increments()
    t.string('name')
    t.integer('order').defaultTo(1)
  })

  .createTable('tags', function(t) {
    t.increments()
    t.integer('tag_category_id').unsigned().references('id').inTable('tag_categories')
    t.string('value')
  })

  .createTable('tag_review', function(t) {
    t.increments()
    t.integer('tag_id').unsigned().references('id').inTable('tags')
    t.integer('review_id').unsigned().references('id').inTable('reviews')
  })

  .createTable('rating_categories', function(t) {
    t.increments()
    t.string('name')
    t.string('description')
    t.integer('order').defaultTo(1)
  })

  .createTable('ratings', function(t) {
    t.increments()
    t.integer('score')
    t.integer('review_id').unsigned().references('id').inTable('reviews')
    t.integer('rating_category_id').unsigned().references('id').inTable('rating_categories')
  })

}

exports.down = function(knex, Promise) {

  return knex.schema
  .dropTable('files')
  .dropTable('students')
  .dropTable('places')
  .dropTable('reviews')
  .dropTable('tag_categories')
  .dropTable('tags')
  .dropTable('tag_review')
  .dropTable('rating_categories')
  .dropTable('ratings')
  
}

