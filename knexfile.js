
// Our database config
//
var config = {
  client: 'mysql',
  connection: {
    host     : 'localhost',
    user     : 'legacy',
    password : 'legacy_project',
    database : 'legacy'
  }
}

// Use same configuration for both development and production database.
//
module.exports = {
  development: config,
  production:  config,
}

