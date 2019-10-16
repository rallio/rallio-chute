require('dotenv').config();

const AWS = require('aws-sdk');
const tagMapper = require('./tag-mapper');

module.exports = ({
  MaxNumberOfMessages = 10,
  QueueUrl = process.env.QUE_URL,
  VisibilityTimeout = 0,
  WaitTimeSeconds = process.env.LONG_POLLING_WAIT_TIME,
  apiVersion = '2012-11-05',
  accessKeyId = process.env.AWS_SQS_ACCESS_KEY_ID,
  secretAccessKey = process.env.AWS_SQS_SECRET_ACCESS_KEY,
  region = process.env.AWS_REGION,
  endpoint = process.env.AWS_DB_URL
} = {}) => {
  const sqs = new AWS.SQS({ apiVersion });

  if (endpoint) {
    AWS.config.update({ endpoint });
  }

  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region
  });

  const params = {
    MaxNumberOfMessages,
    QueueUrl,
    VisibilityTimeout,
    WaitTimeSeconds: Number(WaitTimeSeconds)
    // ReceiveMessageWaitTimeSeconds: Number(WaitTimeSeconds)
    // https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html#sqs-long-polling
  };

  return new Promise((resolve, reject) => {
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        console.error("Receive Error", err);
        return reject(err);
      }

      let messages;

      try {
        messages = data.Messages.map(({ Body }) => JSON.parse(Body));
      } catch(e) {
        console.error(e);
      }

      if (!messages) {
        return reject({ data, message: 'unable to parse messages' });
      }

      return resolve(messages);
    });
  })
};
