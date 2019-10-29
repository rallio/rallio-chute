const {sqs} = require('./index')

const createQueue = ({
    QueueName, /* required */
    endpoint = null,
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

    sqs({ endpoint }).createQueue(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
};

module.exports = { createQueue };
