/* eslint-disable no-console */
const longPoller = require('./long-poller');
const { removeFromSqs } = require('./remove-from-sqs');
const { sendToChute } = require('./send-to-chute');
const {checkDB} = require('./check-existing');

async function checkRetry(messageIdExists){
  if (messageIdExists.length > 0){
    return true
  }else{
    return false
  }
}
const handleMessages = messages => {
  return messages.map(async (message) => {
    const { photo_tags = [] } = message;
    const messageIdExists = await checkDB(message.MessageId);
    const retry = await checkRetry(messageIdExists);
   
    const processedTags = Promise.all(photo_tags.split(',').map(tag => {
      const messageObject = {
        tag: tag,
        file_url: message.photo_url,
        account_id: message.account_id,
        franchisor_id: message.franchisor_id,
        photo_id: message.photo_id,
        receiptHandle: message.ReceiptHandle,
        message_id: message.MessageId,
        type: 'tag',
        db: 'TagMap',
        pk: tag,
        pkName: 'tag',
        retry: retry
      };

      return sendToChute(messageObject)
    }));

    const locationObject = {
      tag: null,
      file_url: message.photo_url,
      account_id: message.account_id,
      franchisor_id: message.franchisor_id,
      photo_id: message.photo_id,
      receiptHandle: message.ReceiptHandle,
      message_id: message.MessageId,
      type: 'location',
      db: 'LocationMap',
      pk: message.account_id,
      pkName: 'account_id',
      retry:retry
    };

    const processedLocation = sendToChute(locationObject);
    const promises = [
      processedTags.then(() => true),
      processedLocation
    ];

    return Promise.all(promises).then(() => {
      return message
    });
  });
}

const pollPromise = () => longPoller().then(async (response) => {
  const { Messages } = response;

  if (!Messages)  {
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

  processedMessagesCount += messageRemovedPromises.length;

  return messageRemovedPromises.length;
});


let pollCount = 0;
let processedMessagesCount = 0;
const start = async () => {
  while(await pollPromise() > 0) {
    console.log('were still waiting...', ++pollCount);
  }

  console.log('The queue is empty', {pollCount, processedMessagesCount});
};

// start();

module.exports = { start };