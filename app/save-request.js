const Models = require('../models/index')

async function saveRequest (data) {
    const model = Models.Request
  console.log("in save request", model)
  const request = model.create({
    album: data.album,
    url: data.file_url,
    account_id: data.account_id,
    franchisor_id: data.franchisor_id,
    photo_id: data.photo_id
  });
  console.log("REQUEST", request)
}

module.exports = { saveRequest };
