/* eslint-disable no-console */
require('dotenv').config();
const sqs = require('./sqs');
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
  DelaySeconds = 0,
  MessageBody = JSON.stringify(defaultPhoto),
  QueueUrl = process.env.QUE_URL,
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

