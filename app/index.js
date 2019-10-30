/* eslint-disable no-console */
const { pollMessages } = require('./poll-messages')

let pollCount = 0;
let processedMessagesCount = 0;

const start = async (poll = pollMessages) => {
  while(await poll().then(messagesCount => {
    processedMessagesCount += messagesCount;
    return messagesCount;
  }) > 0) {
    pollCount++;
  }

  console.log('The queue is empty', {pollCount, processedMessagesCount});

  return {pollCount, processedMessagesCount}
};

module.exports = { start };