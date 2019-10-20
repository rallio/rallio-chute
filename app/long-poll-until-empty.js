/* eslint-disable no-console */
const longPoller = require('./long-poller');
const { removeFromSqs } = require('./remove-from-sqs');
const { sendToChute } = require('./send-to-chute');
const {checkDB} = require('./check-existing');
// const removeMessageFromQueue = message => removeFromSqs(message);
async function checkRetry(messageIdExists){
  if (messageIdExists.length > 0){
    return true
  }else{
    return false
  }
}
const handleMessages = async (messages) => {
  const messagesProcessedPromise = messages.map(async (message) => {
    const { tags = [] } = message;
    const messageIdExists = await checkDB(message.MessageId)
    console.log('message existis', messageIdExists)
    const retry = await checkRetry(messageIdExists)
    console.log("RETRY!!!!!!!", retry)
    const processedTags = Promise.all(tags.split(",").map(tag => {
   
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
    
    return sendToChute(messageObject)
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
    
    const processedLocation = sendToChute(locationObject).then;
    console.log("AFTER LOCATION!!!!!", processedLocation)
    const promises = [
    processedLocation.then(() => {
      return true
    }),
    // processedLocation
  ]

  return Promise.all(promises);
  })

  const messagesProcessed = await Promise.all(messagesProcessedPromise);

  return messagesProcessed;
}

const pollPromise = () => longPoller().then(response => {
  const { Messages } = response;

  if (!Messages)  {
    return 0
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
    return Infinity;
  }
  if (!mappedMessages) {
    console.error('no messages')
    // throw new Error('no messages');
    return 0;
  }
  //
  const messagesProcessedPromise = handleMessages(mappedMessages).catch(console.error);
  messagesProcessedPromise.then(messages => messages.length).then(count => {
    processedMessagesCount += count;
  });
  return messagesProcessedPromise.then(messages => messages.length);
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
