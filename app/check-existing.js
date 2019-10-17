const Models = require('../models/index')
async function checkDB (data) {
    const model = Models.Request
    const record = model.findAll({
      where: {
        message_id: data
      },
      raw: true,
    })
   
    return record
  }
  
  module.exports = { checkDB };