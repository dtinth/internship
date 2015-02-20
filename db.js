
module.exports = require('knex')({
  client: 'mysql',
  connection: {
    host     : '158.108.233.148',
    user     : 'thai',
    password : 'mylegacytest',
    database : 'legacy'
  }
})

