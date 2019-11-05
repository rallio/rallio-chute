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
    return Infinity;
  }
  if (!mappedMessages) {
    console.error('no messages');
    return 0;
  }
  // debugger
  const messagesProcessed = await Promise.all(handleMessages({
    messages: mappedMessages,
    checkDB,
    checkRetry,
    sendToChute,
  })).catch(console.error);

  if (!messagesProcessed) {
    return Infinity;
  }

  // debugger
  const messageRemovedPromises = messagesProcessed.map(message => {
    return removeFromSqs({ ReceiptHandle: message.ReceiptHandle })
    .catch(err => {
      console.error(err)
      debugger
      /*
      "The security token included in the request is invalid."
      */
    })
    .then(resp => {
      console.log('remove from sqs', resp)
      debugger
      return resp
    });
  });

  await Promise.all(messageRemovedPromises).catch(console.error); // TODO AWS error handle

  return messageRemovedPromises.length;
});

module.exports = { pollMessages };