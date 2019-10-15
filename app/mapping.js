const Models = require('../models/index')

async function chuteMapping (data, modelName, pkName) {
  console.log("****IN MAPPING ", data, modelName, pkName)
  const model = Models[modelName]
  const pk = data[pkName]

console.log("MODEL", model)
  const record = model.findAll({
    where: {
      tag: pk
    }
  });

  console.log('********record', record)
  return record
}

module.exports = { chuteMapping };
// const where = account_id ? { where: {pk}} : undefined;
// console.log("where", where)
// const record = await model.findAll({where})
