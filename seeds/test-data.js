
var co = require('co')

exports.seed = co.wrap(function*(knex) {

  var student = yield getStudent('5410545036', 'Thai Pangsakulyanont', 'SKE')

  var place1 = yield getPlace({
    place: {
      name: 'Test Company',
      full_name: 'The Internship Test Company',
      address: '5555 Ngam Vong Van, Lat Yao, Chatuchak, Bangkok, 10900, Thailand',
      latitude: 13.851867,
      longitude: 100.567519,
      about: 'This is a test company for internship project',
      website_url: 'http://localhost:9000/',
    },
  })

  function getStudent(studentId, name, major) {
    return co(function*() {
      try {
        return (yield knex.table('students')
            .insert({ student_id: studentId, name: name, major: major }))[0]
      } catch (e) {
        return (yield knex.first('id').from('students')
            .where({ student_id: studentId })).id
      }
    })
  }

  function getPlace(options) {
    return co(function*() {
      var info = options.place
      var existing = yield knex.first('id').from('places').where({ name: info.name })
      if (existing) return existing.id
      return (yield knex.table('places').insert(info, 'id'))[0]
    })
  }

})
