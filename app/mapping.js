const Models = require('../models/index')

async function chuteMapping (data, modelName, pkName) {
  const model = Models[modelName]
  const pk = data[pkName]

  const record = model.findAll({
    where: {
      [pkName]: pk
    },
    raw: true,
  });

  return record
}

module.exports = { chuteMapping };

