require('dotenv').config();
const {
  sendMessage
} = require('./send-message');
const {
  savedToDatabase
} = require('./save-request');
const {
  chuteMapping
} = require('./mapping');
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

let getSqs = () => {

  var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
  var queueURL = process.env.QUE_URL;
  var params = {
    MaxNumberOfMessages: 10,
    QueueUrl: queueURL,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
  };

  return new Promise((resolve, reject) =>{
    sqs.receiveMessage(params, function (err, data) {
      if (err) {
        console.log("Receive Error", err);
        reject(err)
      } else if (data.Messages) {
        console.log("######data.Messages", data.Messages)
        const likedPhoto = JSON.parse(data.Messages[0].Body);
        // console.log("likedPhoto", likedPhoto)
        const tags = likedPhoto.tags.split(',');
        const mappedTags = tags.map((tag) => {
        // console.log("tag", tag)
          return {
            tag: tag,
            file_url: likedPhoto.url,
            account_id: likedPhoto.account_id,
            franchisor_id: likedPhoto.franchisor_id,
            photo_id: likedPhoto.photo_id
          }
        });
        resolve(mappedTags);
      }
    });
  })
};

module.exports = { getSqs };
// sqs.receiveMessage(params, function (err, data) {
//  if (err) {
//    console.log("Receive Error", err);
//  } else if (data.Messages) {
//    console.log("data.Messages", data.Messages)
//    const likedPhoto = JSON.parse(data.Messages[0].Body);
//    console.log("likedPhoto", likedPhoto)
//    const tags = likedPhoto.tags.split(',');
//    tags.map((tag) => {
//    console.log("tag", tag)
//      data = {
//        album: tag,
//        file_url: likedPhoto.url,
//        acocunt_id: likedPhoto.account_id,
//        franchisor_id: likedPhoto.franchisor_id,
//        photo_id: likedPhoto.photo_id
//      }
//      console.log("data", data)
//      return data;
//    });
//  }
// });

// var deleteParams = {
//   QueueUrl: queueURL,
//   ReceiptHandle: data.Messages[0].ReceiptHandle
// };
// sqs.deleteMessage(deleteParams, function(err, data) {
//   if (err) {
//     console.log("Delete Error", err);
//   } else {
//     console.log("Message Deleted", data);
//   }
// });
