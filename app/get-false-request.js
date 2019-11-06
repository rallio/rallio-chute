const Models = require('../models/index')
async function getFalse (message_id, tag, type, account_id) {
   
    const model = Models.Request
    if(type === 'location'){
      const record = model.findOne({
        where: {
          message_id: message_id,
          request_success: null,
          account_id: account_id
        },
        raw: true,
      })
       
      return record
    }else{
      const record = model.findOne({
        where: {
          message_id: message_id,
          request_success: null,
          tag: tag
        },
        raw: true,
      })
       
      return record
    }
   


  }

  async function getTrue(id){
  
    const model = Models.Request
  
      const record = model.findAll({
        where: {
          message_id: id,
          request_success: true,
         },
        raw: true,
      })
       
      return record
  }

  async function getAll(id){
    const model = Models.Request
  
    const record = model.findAll({
      where: {
        message_id: id,
      },
      raw: true,
    })
     
    return record
  }
  
  module.exports = { getFalse, getTrue, getAll };