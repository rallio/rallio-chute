/* eslint-disable no-console */
require('dotenv').config();

const hash = require('../util/hash');
const AWS = require('aws-sdk');

const {
  AWS_SQS_ACCESS_KEY_ID,
  AWS_SQS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_SQS_QUEUE_URL,
  // NODE_ENV
} = process.env;

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const {
  DelaySeconds = 0,
  MessageBody = JSON.stringify({ account_id: null, account_name: null, franchisor_id: 8, franchisor_name: 'Bean Me Up - Irvine', photo_id: 93, photo_tags: 'coffee,tea,bakery,wifi,study', photo_url: 'https://res.cloudinary.com/ralliohq/bmuc02gx9og4tcdqghcb.jpg'}),
  QueueUrl = AWS_SQS_QUEUE_URL,
  region = AWS_REGION,
  accessKeyId = AWS_SQS_ACCESS_KEY_ID,
  secretAccessKey = AWS_SQS_SECRET_ACCESS_KEY,
  numberOfMessagesToSend = 1
} = hash(process.argv);

if (accessKeyId) {
  AWS.config.update({ accessKeyId });
}
if (secretAccessKey) {
  AWS.config.update({ secretAccessKey });
}
if (region) {
  AWS.config.update({ region });
}

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

