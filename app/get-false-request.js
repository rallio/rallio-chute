const Models = require('../models/index')
async function getFalse (id) {
    console.log("****IN get false ", id)
    const model = Models.Request
     const record = model.findAll({
      where: {
        receipt_handle: id,
        request_success: false
      },
      raw: true,
    })
     
    return record
  }
  
  module.exports = { getFalse };