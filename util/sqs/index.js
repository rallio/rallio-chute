const AWS = require('aws-sdk');
require('dotenv').config();

const {
  NODE_ENV = 'development',
    AWS_API_VERSION = '2012-11-05',
    AWS_SQS_ACCESS_KEY_ID,
    AWS_SQS_SECRET_ACCESS_KEY,
    AWS_REGION = 'us-east-1',
} = process.env;

const isTesing = NODE_ENV === 'test';

if (AWS_SQS_ACCESS_KEY_ID && !isTesing) {
  AWS.config.update({
    accessKeyId: AWS_SQS_ACCESS_KEY_ID
  });
}
if (AWS_SQS_SECRET_ACCESS_KEY && !isTesing) {
  AWS.config.update({
    secretAccessKey: AWS_SQS_SECRET_ACCESS_KEY
  });
}
if (AWS_REGION) {
  AWS.config.update({
    region: AWS_REGION
  });
}

const sqs = ({ endpoint } = {}) => {
  if (isTesing) {
    hackAWSCredentials();
  }

  return new AWS.SQS({
    apiVersion: AWS_API_VERSION,
    ...(endpoint && { endpoint })
  });
}

const hackAWSCredentials = () => {
  /*
  // HACK required for the test environment to run on ci

  Even though we're running AWS sqs in a docker component, AWS will complain if there's no region, access key and secrets set, even when they're not necessary.
  */
  AWS.config.update({
    accessKeyId: '...',
    secretAccessKey: '...'
  });
};

module.exports = {
  sqs,
  hackAWSCredentials
};