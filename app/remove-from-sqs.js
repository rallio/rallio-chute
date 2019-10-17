require('dotenv').config();
const AWS = require('aws-sdk');

// Set the region
AWS.config.update({
  accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

async function removeFromSqs(data) {
  ReceiptHandle = data, // required
  QueueUrl = process.env.QUE_URL
  return new Promise((resolve, reject) => {
    if (!ReceiptHandle) {
      return reject({ message: 'missing ReceiptHandle' });
    }

    const handleDelete = (err, data) => {
      if (err) {
       console.error(err);
       return reject({ message: err });
      }

      resolve(data);
    };

    try {
      const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

      sqs.deleteMessage({ QueueUrl, ReceiptHandle }, handleDelete);
    } catch(e) {
      console.error(e);
      reject({ message: e });
    }
  });
};

module.exports = { removeFromSqs };
