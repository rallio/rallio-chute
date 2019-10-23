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
  MessageBody = {account_id: null, account_name: null, franchisor_id: 8, franchisor_name: "Bean Me Up - SoCal", photo_id: 93, photo_tags: "animal,mammal,pet,furniture,dog", photo_url: "https://res.cloudinary.com/ralliohq/q_auto/s7swm1swodxajmli0uhf.jpg"},
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

