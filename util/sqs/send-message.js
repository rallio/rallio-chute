require('dotenv').config();

const {
  AWS_SQS_QUEUE_URL
} = process.env;

const sendMessage = ({
  DelaySeconds = 0,
  MessageBody = JSON.stringify({
    account_id: null,
    account_name: null,
    franchisor_id: 8,
    franchisor_name: "Bean Me Up - SoCal",
    photo_id: 93,
    photo_tags: "animal,mammal,pet,furniture,dog",
    photo_url: "https://res.cloudinary.com/ralliohq/q_auto/s7swm1swodxajmli0uhf.jpg"
  }),
  QueueUrl = AWS_SQS_QUEUE_URL,
  sqs = require('./index').sqs(),
} = {}) => {
  const config = {
    DelaySeconds,
    MessageBody,
    QueueUrl
  };

  return new Promise((resolve, reject) => {
    const handleMessage = (err, response) => {
      if (err) {
        return reject(err);
      }

      resolve(response);
    };

    try {
      sqs.sendMessage(config, handleMessage);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

module.exports = { sendMessage };