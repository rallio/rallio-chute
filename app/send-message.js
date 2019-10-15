require('dotenv').config();
const fetch = require('node-fetch');

// const sendMessage = async ({
//   // VERBOSE = process.env.VERBOSE,
//   oauth_token = process.env.OAUTH_TOKEN
// } = {}) => {
//   console.log("get to send Message")
//
//   console.log("get here ")
//   fetch('http://api.getchute.com/v2/albums?oauth_token=67df6982cd69ebbb0126adfe38adb0c10c6d9460248c59bb08d2bfad20b676aa')
//     .then(res => res.text())
//     .then(body => console.log('BODY', body));
// };

async function sendMessage (data) {
  oauth_token = process.env.OAUTH_TOKEN
  console.log("get to send Message", data)

  console.log("get here ")
  fetch('http://api.getchute.com/v2?album=2691079&file_url=https%3A%2F%2Fres.cloudinary.com%2Fralliohq%2Fq_auto%2Fkpzrnztisv7zuiborbdc.jpg&filedata=binary%20data&oauth_token=67df6982cd69ebbb0126adfe38adb0c10c6d9460248c59bb08d2bfad20b676aa%20')
    .then(res => res.text())
    .then(body => console.log('BODY', body));
  // return result;
}
module.exports = { sendMessage };


  // 'http://api.getchute.com/v2/albums?oauth_token=67df6982cd69ebbb0126adfe38adb0c10c6d9460248c59bb08d2bfad20b676aa'
