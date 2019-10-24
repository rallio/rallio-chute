require('dotenv').config();

const  AWS = require('aws-sdk');

const {
  AWS_API_VERSION = '2012-11-05',
  AWS_REGION,
  AWS_SQS_ACCESS_KEY_ID,
  AWS_SQS_SECRET_ACCESS_KEY,
  AWS_SQS_QUEUE_URL,
  LONG_POLLING_WAIT_TIME,
  MAX_NUMBER_OF_MESSAGES = 1
} = process.env;

module.exports = ({
  VisibilityTimeout = 0,
  MaxNumberOfMessages = MAX_NUMBER_OF_MESSAGES,
  QueueUrl = AWS_SQS_QUEUE_URL,
  WaitTimeSeconds = LONG_POLLING_WAIT_TIME
} = {}) => {
  const params = {
    MaxNumberOfMessages,
    QueueUrl,
    VisibilityTimeout,
    WaitTimeSeconds,
    // ReceiveMessageWaitTimeSeconds: Number(WaitTimeSeconds)
    // https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html#sqs-long-polling
  };

  if (AWS_SQS_ACCESS_KEY_ID) {
    AWS.config.update({ accessKeyId: AWS_SQS_ACCESS_KEY_ID });
  }
  if (AWS_SQS_SECRET_ACCESS_KEY) {
    AWS.config.update({ secretAccessKey: AWS_SQS_SECRET_ACCESS_KEY });
  }
  if (AWS_REGION) {
    AWS.config.update({ region: AWS_REGION });
  }

  const sqs = new AWS.SQS({ apiVersion: AWS_API_VERSION });

  return new Promise((resolve, reject) => {
    console.log(`looking for up to ${MAX_NUMBER_OF_MESSAGES} message(s)...`, params);
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
};
