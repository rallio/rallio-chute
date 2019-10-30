/* eslint-disable no-console */
const hash = require('../util/hash');
const AWS = require('aws-sdk');
require('dotenv').config();

const {
  AWS_API_VERSION = '2012-11-05',
  AWS_REGION,
  AWS_SQS_ACCESS_KEY_ID,
  AWS_SQS_SECRET_ACCESS_KEY,
  // AWS_SQS_QUEUE_URL,
  NODE_ENV = 'development'
} = process.env;

if (NODE_ENV !== 'test') {
  if (AWS_SQS_ACCESS_KEY_ID) {
    AWS.config.update({ accessKeyId: AWS_SQS_ACCESS_KEY_ID });
  }
  if (AWS_SQS_SECRET_ACCESS_KEY) {
    AWS.config.update({ secretAccessKey: AWS_SQS_SECRET_ACCESS_KEY });
  }
  if (AWS_REGION) {
    AWS.config.update({ region: AWS_REGION });
  }
}

const {
  DelaySeconds = 0,
  MessageBody = JSON.stringify({account_id: null, account_name: null, franchisor_id: 8, franchisor_name: "Bean Me Up - SoCal", photo_id: 93, photo_tags: "animal,mammal,pet,furniture,dog", photo_url: "https://res.cloudinary.com/ralliohq/q_auto/s7swm1swodxajmli0uhf.jpg"}),
  QueueUrl = 'http://127.0.0.1:9324/queue/photo-liked',
  numberOfMessagesToSend = 1,
  sqs = new AWS.SQS({ apiVersion: AWS_API_VERSION }),
} = hash(process.argv);

let promises = [];
promises.length = numberOfMessagesToSend;
promises.fill();

const messagePromises = promises.map(() => {
  return new Promise((resolve, reject) => {
    const handleSendMessage = (err, response) => {

      if (err) {
        console.error(err);
        return reject(err);
      }

      console.log(response);
      resolve(response);
    };

    try {
      console.log('sending message: ', {
        DelaySeconds,
        MessageBody,
        QueueUrl
      });
      sqs.sendMessage({
        DelaySeconds,
        MessageBody,
        QueueUrl
      }, handleSendMessage);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
});

Promise.all(messagePromises)
  .catch(console.error)
  .then(() => console.log(`✅ ${messagePromises.length} messages sent.`))

