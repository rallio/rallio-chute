/* eslint-disable no-console */
require('dotenv').config();

const pollMessages = ({
  handleMessages = require('./handle-messages').handleMessages,
  QueueUrl = process.env.AWS_SQS_QUEUE_URL,
  longPoller = require('./long-poller').longPoller,
  removeFromSqs = require('../util/remove-from-sqs').removeFromSqs,
  checkDB = require('./check-existing').checkDB,
  checkRetry = require('./check-retry').checkRetry,
  sendToChute = require('./send-to-chute').sendToChute,
}) => longPoller({ QueueUrl }).then(async (response) => {
  const { Messages } = response;

  if (!Messages) {
    return 0;
  }

  let mappedMessages;
  try {
    // debugger
    mappedMessages = Messages.map((m) => {
      const { ReceiptHandle, MessageId } = m;

      return { ...JSON.parse(m.Body), ReceiptHandle, MessageId };
    });
  } catch (e) {
    console.error('no body');
    Promise.reject(e) 
  }
  if (!mappedMessages) {
    console.error('no messages');
    Promise.reject('no messages') 
  }

  const messagesProcessed = await Promise.all(handleMessages({
    messages: mappedMessages,
    checkDB,
    checkRetry,
    sendToChute,
  })).catch(console.error);
console.log("#####messagesProcessed", messagesProcessed)
  if (!messagesProcessed) {
    Promise.reject('unable to process messages')
  } 
  console.log("#####QueueUrl", QueueUrl)

  const messageRemovedPromises = messagesProcessed.map(message => {
    console.log("#####message", message)
    return removeFromSqs({
      QueueUrl,
      ReceiptHandle: message.ReceiptHandle
    })
    .catch(console.error);
  });

  await Promise.all(messageRemovedPromises).catch(console.error);

  return messageRemovedPromises.length;
});

module.exports = { pollMessages };