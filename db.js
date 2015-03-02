
module.exports = require('knex')({
  client: 'mysql',
  connection: {
    host     : 'localhost',
    user     : 'legacy',
    password : 'legacy_project',
    database : 'legacy'
  }
})

