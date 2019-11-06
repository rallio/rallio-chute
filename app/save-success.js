const Models = require('../models/index')

async function saveSuccess (data) {
  const model = Models.Request

  const request = model.update({
    request_success: true,
  }, {where: {id: data.id}})

  .then((res) => console.log("SUCCESS", res) || res);
//   console.log("REQUEST", request)
  return request
}

module.exports = { saveSuccess };
