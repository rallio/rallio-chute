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
const handleMessages = async (messages) => {
  debugger
  // READ
  return messages.map(async (message) => {
    console.log('message...', message);
    // debugger
    const { tags = [] } = message;
    const messageIdExists = await checkDB(message.MessageId)
    console.log('message existis', messageIdExists)
    const retry = await checkRetry(messageIdExists)
    console.log("RETRY!!!!!!!", retry)
    const processedTags = Promise.all(tags.split(",").map(tag => {
    // debugger
    const messageObject = {
      tag: tag,
      file_url: message.url,
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
    }

    return sendToChute(messageObject).catch(err => {
      console.error(err);
      debugger
      return Infinity;
    })

    }));
    const locationObject = {
      tag: null,
      file_url: message.url,
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
    }

    const processedLocation = sendToChute(locationObject);
    console.log("AFTER LOCATION", processedLocation)
    const promises = [
    processedTags.then(() => {
      return true
    }),
    processedLocation
  ]

  return Promise.all(promises);
  })
}

const pollPromise = () => longPoller().then(async  (response) => {
  const { Messages } = response;
  debugger

  if (!Messages)  {
    return 0;
  }

  let mappedMessages
  try {
    mappedMessages = Messages.map((m) => {
      const { ReceiptHandle, MessageId } = m;

      return { ...JSON.parse(m.Body), ReceiptHandle, MessageId };
    })
  } catch (e) {
    console.error('no body')
    // throw new Error('unable to parse Body');
    // debugger
    return Infinity;
  }
  if (!mappedMessages) {
    console.error('no messages')
    // throw new Error('no messages');
    // debugger
    return 0;
  }

  const messagesProcessedPromise = await handleMessages(mappedMessages).catch(console.error);

  // DELETE
  const messagesProcessed = await Promise.all(messagesProcessedPromise);

  if (!messagesProcessed) {
    return Infinity;
  }

  const messageRemovedPromises = messagesProcessed.map(removeFromSqs);

  await Promise.all(messageRemovedPromises).catch(console.error); // TODO AWS error handle
  debugger
  return messageRemovedPromises.length
})


let pollCount = 0
let processedMessagesCount = 0
const start = async () => {
  while(await pollPromise() > 0) {
    console.log('were still waiting...', ++pollCount)
  }

  console.log('The queue is empty', {pollCount, processedMessagesCount});
}

start()
