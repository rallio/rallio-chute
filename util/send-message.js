var request = require("request");
require('dotenv').config();

const {
  CHUTE_OAUTH_TOKEN
} = process.env;

async function sendMessage (data) {
  return new Promise((resolve, reject) => {
    console.log("DATA", data);

    const options = {
      method: 'POST',
      url: `http://api.getchute.com/v2/albums/${data.album}/assets/upload`,
      headers:
      { 'Content-Type': 'application/json' },
      body: {
      file_url: data.file_url || data.url,
      oauth_token: CHUTE_OAUTH_TOKEN
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
module.exports = { sendMessage };
