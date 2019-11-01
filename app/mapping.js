const Models = require('../models/index')

async function chuteMapping ({pk, modelName, pkName}) {
  const model = Models[modelName]
  console.log("pk", pk)
  console.log("modelName", modelName)
  console.log("pkName", pkName)
  const records = await model.findAll({
    where: {
      [pkName]: pk
    },
    raw: true,
  });
  console.log("RECORDS", records)
  return records[0];
}

module.exports = { chuteMapping };

