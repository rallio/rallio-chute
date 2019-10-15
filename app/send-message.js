require('dotenv').config();
const fetch = require('node-fetch');
var fs = require('fs'),
request = require('request');
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
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
async function sendMessage (data) {
  console.log("DATA", data)
  //file from url to png
  download(data.file_url, 'temp.png', function(){
    console.log('done',);
});
}

// async function sendMessage (data) {
//   oauth_token = process.env.OAUTH_TOKEN
//   console.log("get to send Message", data)

//   // console.log("get here ")
//   // fetch('https://api.getchute.com/v2/albums/'+ data.album + '/assets/upload?file_url=' + data.file_url +'&oauth_token=67df6982cd69ebbb0126adfe38adb0c10c6d9460248c59bb08d2bfad20b676aa')
//   //   .then(res => res.text())
//   //   .then(body => console.log('BODY', body));
//   // // return result;
//    const body = {
//     "file_url": "http://res.cloudinary.com/ralliohq/image/upload/v1570654705/nfrenxbsmrgy4pj3sxeq.jpg"
//   }
//   debugger
//   fetch('http://api.getchute.com/v2?album=2691079&file_url=http%3A%2F%2Fres.cloudinary.com%2Fralliohq%2Fimage%2Fupload%2Fv1570654705%2Fnfrenxbsmrgy4pj3sxeq.jpg&filedata=binary%20data&oauth_token=67df6982cd69ebbb0126adfe38adb0c10c6d9460248c59bb08d2bfad20b676aa', {
//         method: 'post',
//         body:    JSON.stringify(body),
//         headers: { 'Content-Type': 'application/json' },
//     })
//     .catch(console.error)
//     .then(res => res.json())
//     .then(json => console.log(json));
// }
module.exports = { sendMessage };


  // 'http://api.getchute.com/v2/albums?oauth_token=67df6982cd69ebbb0126adfe38adb0c10c6d9460248c59bb08d2bfad20b676aa'
