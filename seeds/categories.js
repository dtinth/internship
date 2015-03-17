
var co = require('co')

exports.seed = co.wrap(function*(knex) {

  yield knex.delete().from('tags')
  yield knex.delete().from('tag_categories')
  yield knex.delete().from('rating_categories')

  yield knex.table('tag_categories').insert([
    { id: 1, name: 'Country', order: 1 },
    { id: 2, name: 'Paid', order: 2 },
    { id: 3, name: 'Field', order: 3 },
    { id: 4, name: 'Working Hours', order: 4 },
    { id: 5, name: 'Programming Language', order: 5 },
  ])

  yield knex.table('tags').insert([

    { tag_category_id: 1, value: 'Austria' },
    { tag_category_id: 1, value: 'Germany' },
    { tag_category_id: 1, value: 'Japan' },
    { tag_category_id: 1, value: 'Korea' },

    { tag_category_id: 2, value: 'Paid' },
    { tag_category_id: 2, value: 'Non-Paid' },

    { tag_category_id: 3, value: 'Business Intelligence' },
    { tag_category_id: 3, value: 'Data Mining' },
    { tag_category_id: 3, value: 'Data Warehouse' },
    { tag_category_id: 3, value: 'Database' },
    { tag_category_id: 3, value: 'Games' },
    { tag_category_id: 3, value: 'IT Support' },
    { tag_category_id: 3, value: 'Mobile (Android)' },
    { tag_category_id: 3, value: 'Mobile (iOS)' },
    { tag_category_id: 3, value: 'Multimedia' },
    { tag_category_id: 3, value: 'Research' },
    { tag_category_id: 3, value: 'Testing' },
    { tag_category_id: 3, value: 'Web Service' },
    { tag_category_id: 3, value: 'Website' },

    { tag_category_id: 4, value: 'Fixed' },
    { tag_category_id: 4, value: 'Flexible' },

    { tag_category_id: 5, value: 'C#' },
    { tag_category_id: 5, value: 'C' },
    { tag_category_id: 5, value: 'C++' },
    { tag_category_id: 5, value: 'CSS' },
    { tag_category_id: 5, value: 'HTML' },
    { tag_category_id: 5, value: 'Java' },
    { tag_category_id: 5, value: 'JavaScript' },
    { tag_category_id: 5, value: 'Python' },
    { tag_category_id: 5, value: 'Ruby' },

  ])

  yield knex.table('rating_categories').insert([
    { name: 'Environment', order: 1,
      description: 'บรรยากาศภายในที่ทำงาน', },
    { name: 'Coworker', order: 2,
      description: 'ผู้ร่วมงาน เช่น พนักงานคนอื่นๆ ในบริษัท หรือเพื่อนในแล็บ', },
    { name: 'Employer/Mentor', order: 3,
      description: 'ผู้ว่าจ้าง อาจารย์ประจำแล็บ หรือพี่เลี้ยง', },
    { name: 'Transportation', order: 4,
      description: 'ความสะดวกในการเดินทาง', },
    { name: 'Food', order: 5,
      description: 'คุณภาพ ราคา ความอร่อยของอาหารในละแวกนั้น', },
    { name: 'Benefits', order: 6,
      description: 'สวัสดิการและรายได้ (เบี้ยเลี้ยง เงินเดือน วันหยุด สวัสดิการอื่นๆ)', },
    { name: 'Overall', order: 99,
      description: 'ความพึงพอใจโดยรวม (ชอบทำงาน หรืออยากกลับไปทำงานที่นี่หรือไม่)', },
  ])

})

