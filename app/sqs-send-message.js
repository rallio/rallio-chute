/* eslint-disable no-console */
require('dotenv').config();
const AWS = require('aws-sdk');
const faker = require('faker');

const hash = require('../util/hash');

const defaultPhoto = {
  url: faker.image.imageUrl(),
  account_id: 51,
  franchisor_id: null,
  photo_id: 89,
  tags: [faker.random.word(), faker.random.word()]
}

const {
  apiVersion = process.env.API_VERSION,
  DelaySeconds = 0,
  endpoint = process.env.AWS_DB_URL,
  MessageBody = JSON.stringify(defaultPhoto),
  QueueUrl = process.env.QUE_URL,
  numberOfMessagesToSend = 1
} = hash(process.argv);

if (endpoint) {
  AWS.config.update({ endpoint });
}
AWS.config.update({
  accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const sqs = new AWS.SQS({ apiVersion });

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

