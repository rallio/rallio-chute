require('dotenv').config();

const  AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

module.exports = ({
  MaxNumberOfMessages = 1,
  QueueUrl = process.env.AWS_SQS_QUEUE_URL,
  VisibilityTimeout = 0,
  WaitTimeSeconds = process.env.LONG_POLLING_WAIT_TIME
} = {}) => {
  const params = {
    MaxNumberOfMessages,
    QueueUrl,
    VisibilityTimeout,
    WaitTimeSeconds,
    // ReceiveMessageWaitTimeSeconds: Number(WaitTimeSeconds)
    // https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html#sqs-long-polling
  };

  return new Promise((resolve, reject) => {
    console.log('looking for up to 10 messages...', params);
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  })
};
