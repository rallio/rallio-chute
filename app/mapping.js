const Models = require('../models/index')

async function chuteMapping ({pk, modelName, pkName}) {
  const model = Models[modelName]
  const records = await model.findAll({
    where: {
      [pkName]: pk
    },
    raw: true,
  });

  return records[0];
}

module.exports = { chuteMapping };

