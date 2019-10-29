const Models = require('../models/index')

async function chuteMapping (data, modelName, pkName) {
  const model = Models[modelName]
  let pk = data.pk

  const records = await model.findAll({
    where: {
      [pkName]: pk
    },
    raw: true,
  });
  return records[0];
}

module.exports = { chuteMapping };

