const {
  sqs
} = require('./index');
require('dotenv').config();

const {
  NODE_ENV
} = process.env;

const purgeQueue = ({
  QueueUrl,
  /* required */
  endpoint = NODE_ENV === 'test' ? 'http://127.0.0.1:9324' : null
} = {}) => {
  return new Promise((resolve, reject) => {
    if (!QueueUrl) {
      return reject('missing required QueueUrl');
    }

    const params = {
      QueueUrl
    };

    sqs(endpoint ? {
      endpoint
    } : undefined).purgeQueue(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
};

module.exports = {
  purgeQueue
};
