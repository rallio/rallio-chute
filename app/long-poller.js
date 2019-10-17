require('dotenv').config();

const sqs = require('./sqs');

module.exports = ({
  MaxNumberOfMessages = 10,
  QueueUrl = process.env.QUE_URL,
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
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      let messages;

      try {
        messages = data.Messages.map(({ Body }) => JSON.parse(Body));
      } catch(e) {
        reject({ data, message: 'unable to parse messages' });
      }

      if (!messages) {
        return;
      }

      return resolve(messages);
    });
  })
};
