/* eslint-disable no-console */
const { pollMessages } = require('./poll-messages')

let pollCount = 0;
let processedMessagesCount = 0;
const start = async (poll = pollMessages) => {
  
  while(await poll() > 0) {
    console.log('were still waiting...', ++pollCount);
  }

  console.log('The queue is empty', {pollCount, processedMessagesCount});

  return {pollCount, processedMessagesCount}
};



// start();

module.exports = { start };