const AWS = require('aws-sdk');
require('dotenv').config();

const {
  AWS_API_VERSION = '2012-11-05',
  AWS_REGION,
  AWS_SQS_ACCESS_KEY_ID,
  AWS_SQS_SECRET_ACCESS_KEY,
  AWS_SQS_QUEUE_URL
} = process.env;

if (AWS_SQS_ACCESS_KEY_ID) {
  AWS.config.update({
    accessKeyId: AWS_SQS_ACCESS_KEY_ID
  });
}
if (AWS_SQS_SECRET_ACCESS_KEY) {
  AWS.config.update({
    secretAccessKey: AWS_SQS_SECRET_ACCESS_KEY
  });
}
if (AWS_REGION) {
  AWS.config.update({
    region: AWS_REGION
  });
}

const sqs = new AWS.SQS({ apiVersion: AWS_API_VERSION });

const removeFromSqs = ({
  ReceiptHandle = '', // required
  QueueUrl = AWS_SQS_QUEUE_URL
} = {}) => {
  return new Promise((resolve, reject) => {
    if (!ReceiptHandle) {
      return reject({ message: 'missing ReceiptHandle' });
    }

    const handleDelete = (err, data) => {
      if (err) {
        return reject({ message: err });
      }
      resolve(data);
    };

    try {
      sqs.deleteMessage({ QueueUrl, ReceiptHandle }, handleDelete);
    } catch(e) {
      reject({ message: 'unable to delete message', data: e });
    }
  });
};

module.exports = { removeFromSqs };
