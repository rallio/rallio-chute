/* eslint-disable no-console */
require('dotenv').config();
const AWS = require('aws-sdk');

const hash = require('../util/hash');

const {
  apiVersion = process.env.API_VERSION,
  DelaySeconds = 0,
  endpoint = process.env.AWS_DB_URL,
  MessageBody = 'Hello AWS',
  QueueUrl = process.env.QUE_URL
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

sqs.sendMessage({ DelaySeconds, MessageBody, QueueUrl }, (err, response) => {
  if (err) {
    console.error(err);
  } else {
    console.table(response);
  }
});
