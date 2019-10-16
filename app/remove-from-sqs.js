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

let removeFromSqs = (data) => {
console.log("###data", data)
  var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
  var queueURL = process.env.QUE_URL;
  var params = {
    MaxNumberOfMessages: 1,
    QueueUrl: queueURL,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
  };
  
  var deleteParams = {
    QueueUrl: queueURL,
    ReceiptHandle: data.receiptHandle
  };
  sqs.deleteMessage(deleteParams, function(err, data) {
    if (err) {
     console.log("Delete Error", err);
    } else {
      console.log("Message Deleted", data);
    }
  });
};

module.exports = { removeFromSqs };