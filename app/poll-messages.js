const {handleMessages} = require('./handle-messages')
const {longPoller} = require('./long-poller')
const {removeFromSqs} = require('./remove-from-sqs')
const pollMessages = ({
    poller = longPoller,
    remove = removeFromSqs,
    handle = handleMessages
} = {}) => poller().then(async (response = {}) => {

  const {
    Messages
  } = response;

  if (!Messages) {
    return 0;
  }

  let mappedMessages;
  try {
    mappedMessages = Messages.map((m) => {
      const {
        ReceiptHandle,
        MessageId
      } = m;

      return {
        ...JSON.parse(m.Body),
        ReceiptHandle,
        MessageId
      };
    });
  } catch (e) {
    console.error('no body');
    return Infinity;
  }
  if (!mappedMessages) {
    console.error('no messages');
    return 0;
  }

  const messagesProcessed = await Promise.all(handle(mappedMessages)).catch(console.error);

  if (!messagesProcessed) {
    return Infinity;
  }
  
  const messageRemovedPromises = messagesProcessed.map(message => {
    return remove({
      ReceiptHandle: message.ReceiptHandle
    });
  });
  
  await Promise.all(messageRemovedPromises).catch(console.error); // TODO AWS error handle

//   processedMessagesCount += messageRemovedPromises.length;

  return messageRemovedPromises.length;
});



module.exports = { pollMessages }