require('dotenv').config();

const {
  AWS_SQS_QUEUE_URL,
  LONG_POLLING_WAIT_TIME,
  MAX_NUMBER_OF_MESSAGES = 1
} = process.env;

const longPoller = ({
  VisibilityTimeout = 0,
  MaxNumberOfMessages = MAX_NUMBER_OF_MESSAGES || 1,
  QueueUrl = AWS_SQS_QUEUE_URL,
  WaitTimeSeconds = LONG_POLLING_WAIT_TIME,
  sqs = require('../util/sqs').sqs()
} = {}) => {
  const params = {
    MaxNumberOfMessages,
    QueueUrl,
    VisibilityTimeout,
    WaitTimeSeconds,
    // ReceiveMessageWaitTimeSeconds: Number(WaitTimeSeconds)
    // https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html#sqs-long-polling
  };
  console.log(`looking for up to ${MaxNumberOfMessages} message(s)...`, params);

  return new Promise((resolve, reject) => {
    // debugger
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      // debugger
      return resolve(data);
    });
  });
};
module.exports={longPoller}