/* eslint-disable no-console */
const { pollMessages } = require('./poll-messages')

let pollCount = 0;
let processedMessagesCount = 0;

const start = async ({
  poll = pollMessages,
  handleMessages = require('./handle-messages').handleMessages,
  sendToChute = require('./send-to-chute').sendToChute,
  QueueUrl = process.env.AWS_QUEUE_URL
} = {}) => {
  try {
    while(await poll({
      handleMessages,
      sendToChute,
      QueueUrl,
    }).then(messagesCount => {
      processedMessagesCount += messagesCount;
      return messagesCount;
    }) > 0) {
      pollCount++;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

  console.log('The queue is empty', {pollCount, processedMessagesCount});

  return {pollCount, processedMessagesCount}
};

module.exports = { start };