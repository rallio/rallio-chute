require('dotenv').config();

async function sendMessage (data) {
//   console.log("DATA", data)
//   oauth_token = process.env.OAUTH_TOKEN
//   var request = require("request");

//   var options = { method: 'POST',
//   url: 'http://api.getchute.com/v2/albums/'+ data.album +'/assets/upload',
//   headers: 
//    { 'Content-Type': 'application/json' },
//   body: 
//    { file_url: data.file_url,
//      oauth_token: oauth_token },
//   json: true };

// request(options, function (error, response, body) {
//   console.log(error)
//   if (error) throw new Error(error);
//   console.log("response",response)
//   console.log(body);
// });
  return true
}
module.exports = { sendMessage };
