
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))

exports.getKUInfo = getKUInfo
exports.getRawNisitData = getRawNisitData

function getKUInfo(id) {
  return getRawNisitData(id).get(1).then(parseData)
}

function getRawNisitData(id) {
  return request('http://nisit.kasetsart.org/WebFormList_Student_Result.aspx?report=2&std_idno=' + id + '&head=2&sort=1')
}

function parseData(code) {
  var rows = code.split('id="DBWebGrid1">')[1].split('</tr>')
  var cells = rows[2].split('</td>')
                .map(function(x) { return x.match(/[^>]*$/)[0] })
  return {
    id: cells[1],
    th: [cells[2], cells[3]],
    en: [cells[14], cells[15], cells[16]],
    major: cells[6],
  }
}

if (require.main === module) {
  var id = process.argv[2]
  if (!id.match(/^[0-9]{10}$/)) throw new Error('Invalid ID')
  getKUInfo(id)
    .then(function(data) { console.log(data) })
    .catch(function(err) { console.error(err) })
}


