const {sqs} = require('./index')
require('dotenv').config()

const {
  NODE_ENV
} = process.env

const createQueue = ({
    QueueName, /* required */
    endpoint = NODE_ENV === 'test' ? 'http://127.0.0.1:9324' : null,
    Attributes = {},
    tags = {}
  } = {}) => {
  return new Promise((resolve, reject) => {
    if (!QueueName) {
      return reject('missing required QueueName');
    }

    const params = {
      QueueName,
      ...(Object.keys(Attributes).length && { Attributes }),
      ...(Object.keys(tags).length && { tags }),
    };

    sqs(endpoint ? { endpoint }: undefined).createQueue(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
};

module.exports = { createQueue };
