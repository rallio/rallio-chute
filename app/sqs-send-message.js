/* eslint-disable no-console */
require('dotenv').config();

const hash = require('../util/hash');
var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
}); 
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const {
  DelaySeconds = 0,
  MessageBody = JSON.stringify({"account_id":51,"franchisor_id":null,"photo_id":91,"url":"https://res.cloudinary.com/ralliohq/q_auto/z8nhurfmjyaavqmcg2v3.jpg","tags":"pet,cat,kitten,mammal,animal,manx,plant,ground"}),
  QueueUrl = process.env.AWS_SQS_QUEUE_URL,
  numberOfMessagesToSend = 1
} = hash(process.argv);

let promises = [];
promises.length = numberOfMessagesToSend;
promises.fill();

const messagePromises = promises.map(() => {
  return new Promise((resolve, reject) => {
    sqs.sendMessage({ DelaySeconds, MessageBody, QueueUrl }, (err, response) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.table(response);
        resolve(response);
      }
    });
  });
});

Promise.all(messagePromises)
  .catch(console.error)
  .then(() => console.log(`✅ ${messagePromises.length} messages sent.`))

