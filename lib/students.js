
var db = require('../db')
var co = require('co')
var KUName = require('./ku-name')

/**
 * Takes a KU nontri username (such as b5410xxxxxx) and returns the
 * database ID for the user.  If the KU student is new, the student
 * is checked with KU's server for eligibility and is added into the database.
 */
exports.loginOrRegister = function(username) {
  return co(function*() {
    var ids = yield db.select('id').from('students').where({ student_id: studentId })
    if (ids.length == 0) {
      var studentId = exports.getStudentIdFromUsername(username)
      var student = yield exports.getStudentRegistrationData(studentId)
      ids = yield db.insert([student], 'id').into('students')
    }
    return ids[0]
  })
}

/**
 * Returns the User info by ID
 */
exports.get = function(id) {
  return Promise.resolve(db.first().from('students').where({ id: id }))
}

/**
 * Queries the student ID with KU and check for eligibility, then
 * returns the student data to be inserted into database.
 */
exports.getStudentRegistrationData = function(studentId) {
  return co(function*() {
    var info = yield KUName.getKUInfo(studentId)
    var major
    if (info.major == 'E17') {
      major = 'SKE'
    } else if (info.major == 'E09') {
      major = 'CPE'
    } else {
      throw new Error('Student is not in an allowed major!')
    }
    var name = `${info.en[1]} ${capitalize(info.en[2])}`
    return { student_id: studentId, name: name, major: major }
  })
}

exports.getStudentIdFromUsername = function(username) {
  var match = username.match(/^b(\d{10})$/)
  if (!match) throw new Error("Invalid username")
  return match[1]
}

function capitalize(text) {
  return text.toLowerCase().replace(/\w/, function(a) {
    return a.toUpperCase()
  })
}
