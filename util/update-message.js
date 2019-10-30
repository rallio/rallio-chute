var request = require("request");
require('dotenv').config();

const {
  CHUTE_OAUTH_TOKEN
} = process.env;

async function sendDetails ({data,firstResult}) {
  const id = firstResult.data[0].id
  const tags = data.all_tags.split(',')
  return new Promise((resolve, reject) => {
    console.log("DATA", data);

    const options = {
      method: 'PUT',
      url: `https://api.getchute.com/v2/albums/${data.album}/assets/${id}`,
      headers:
      { 'Content-Type': 'application/json' },
      body: {
        oauth_token: CHUTE_OAUTH_TOKEN,
        asset: {    
            tags: tags,
            caption: data.description
        }
    },
      json: true
    };

    request(options, (error, _, body) => {
      let rejectError = error || body.response.error;

      if (rejectError) {

        console.log("Receive Error", rejectError);
        return reject(rejectError);
      }

      try {
        resolve(body.response);
      } catch(err) {
        reject({ message: 'missing body response', data: body});
      }
    });
  });
}
module.exports = { sendDetails };