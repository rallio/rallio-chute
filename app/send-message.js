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

//   request(options, function (error, response, body) {
//   console.log(error)
//   if (error) throw new Error(error);
//   // console.log("#######response",response)
//   console.log("#######response",response.complete)
//   return response
// });
//_________________________________
return new Promise((resolve, reject) =>{
  console.log("DATA", data)
  // debugger
  oauth_token = process.env.CHUTE_OAUTH_TOKEN
  var request = require("request");

  var options = { method: 'POST',
  url: 'http://api.getchute.com/v2/albums/'+ data.album +'/assets/upload',
  headers: 
   { 'Content-Type': 'application/json' },
  body: 
   {
     file_url: data.file_url || data.url,
     oauth_token: oauth_token },
  json: true };


  request(options, function (error, _, body) {
    let rejectError = error || body.response.error;

    if (rejectError) {
      debugger
      console.log("Receive Error", rejectError);
      return reject(rejectError);
    }

    try {
      resolve(body.response);
    } catch(err) {
      reject({ message: 'missing body response', data: body});
    }
  });
})
  
}
module.exports = { sendMessage };
