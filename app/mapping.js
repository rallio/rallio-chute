const Models = require('../models/index')

async function chuteMapping (data, modelName, pkName) {
  // console.log("****IN MAPPING ", data, modelName, pkName)
  const model = Models[modelName]
  const pk = data[pkName]

// console.log("MODEL", model)
  const record = model.findAll({
    where: {
      tag: pk
    },
    raw: true,
  });
  // console.log('********record', record)
  return record
}

module.exports = { chuteMapping };

