/* eslint-disable no-console */
require('dotenv').config();
const longPoller = require('./long-poller');
const { removeFromSqs } = require('./remove-from-sqs');

const {
  AWS_SQS_QUEUE_URL,
} = process.env;

const pollMessages = ({
  handleMessages = require('./handle-messages').handleMessages,
  QueueUrl = AWS_SQS_QUEUE_URL
}) => longPoller({ QueueUrl }).then(async (response) => {
  const { Messages } = response;

  if (!Messages) {
    return 0;
  }

  let mappedMessages;
  try {
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

  const messagesProcessed = await Promise.all(handleMessages(mappedMessages)).catch(console.error);

  if (!messagesProcessed) {
    return Infinity;
  }

  const messageRemovedPromises = messagesProcessed.map(message => {
    return removeFromSqs({ ReceiptHandle: message.ReceiptHandle });
  });

  await Promise.all(messageRemovedPromises).catch(console.error); // TODO AWS error handle

  return messageRemovedPromises.length;
});

module.exports = { pollMessages };