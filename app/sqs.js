require('dotenv').config();
const AWS = require('aws-sdk');

const {
  AWS_API_VERSION = '2012-11-05',
  AWS_REGION = 'us-east-1',
  AWS_SQS_ACCESS_KEY_ID = 'abc123',
  AWS_SQS_SECRET_ACCESS_KEY = 's3cr3t',
} = process.env;

AWS.config.update({
  accessKeyId: AWS_SQS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SQS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

module.exports = () =>
  new AWS.SQS({
    apiVersion: AWS_API_VERSION
  });
